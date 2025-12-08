// Smart Quota Manager for Remon Romany Genius
// Automatically cycles through free API tiers

import { storage } from "../storage";
import { AI_PROVIDERS, getProviderById, getModelById, type AIModel } from "./providers";
import type { ApiQuota } from "@shared/schema";

interface QuotaCheckResult {
  canProceed: boolean;
  provider: string;
  model: AIModel;
  cost: number;
  quotaUsed: number;
  quotaRemaining: number;
  switchedProvider?: string; // If we switched to a different provider
}

export class QuotaManager {
  private userId: string;
  private quotas: Map<string, ApiQuota> = new Map();

  constructor(userId: string) {
    this.userId = userId;
  }

  async loadQuotas(): Promise<void> {
    const quotas = await storage.getApiQuotas(this.userId);
    
    // Initialize quotas if not exist
    if (quotas.length === 0) {
      await this.initializeQuotas();
      const newQuotas = await storage.getApiQuotas(this.userId);
      for (const quota of newQuotas) {
        this.quotas.set(quota.provider, quota);
      }
    } else {
      for (const quota of quotas) {
        // Check if we need to reset daily quotas
        const lastReset = quota.lastResetAt ? new Date(quota.lastResetAt) : new Date(0);
        const now = new Date();
        const isNewDay = lastReset.toDateString() !== now.toDateString();
        
        if (isNewDay) {
          const updated = await storage.upsertApiQuota({
            ...quota,
            usedToday: 0,
            lastResetAt: now,
          });
          this.quotas.set(quota.provider, updated);
        } else {
          this.quotas.set(quota.provider, quota);
        }
      }
    }
  }

  private async initializeQuotas(): Promise<void> {
    for (const provider of AI_PROVIDERS) {
      await storage.upsertApiQuota({
        userId: this.userId,
        provider: provider.id as any,
        dailyLimit: provider.dailyFreeLimit,
        usedToday: 0,
        isFree: provider.isFree,
        costPerRequest: provider.isFree ? "0" : "0.002000",
      });
    }
  }

  async checkAndGetBestProvider(requestedModelId: string): Promise<QuotaCheckResult> {
    await this.loadQuotas();
    
    const requestedModel = getModelById(requestedModelId);
    if (!requestedModel) {
      // Default to Gemini if model not found
      const defaultModel = getModelById("gemini-2.5-flash")!;
      return this.checkProviderQuota(defaultModel);
    }

    // First, try the requested model's provider
    const result = await this.checkProviderQuota(requestedModel);
    if (result.canProceed) {
      return result;
    }

    // If the requested provider is exhausted, try to find an alternative free provider
    const freeProviders = AI_PROVIDERS.filter((p) => p.isFree && p.id !== requestedModel.provider);
    
    for (const provider of freeProviders) {
      const alternativeModel = provider.models[0]; // Use the first model of the alternative provider
      const altResult = await this.checkProviderQuota(alternativeModel);
      if (altResult.canProceed) {
        return {
          ...altResult,
          switchedProvider: provider.name,
        };
      }
    }

    // All free tiers exhausted, check if paid is available
    const paidProviders = AI_PROVIDERS.filter((p) => !p.isFree);
    for (const provider of paidProviders) {
      const paidModel = provider.models[0];
      return {
        canProceed: true,
        provider: provider.id,
        model: paidModel,
        cost: paidModel.costPerRequest || 0,
        quotaUsed: 0,
        quotaRemaining: Infinity,
        switchedProvider: `${provider.name} (Paid)`,
      };
    }

    // Should never reach here, but return a failed result
    return {
      canProceed: false,
      provider: requestedModel.provider,
      model: requestedModel,
      cost: 0,
      quotaUsed: 0,
      quotaRemaining: 0,
    };
  }

  private async checkProviderQuota(model: AIModel): Promise<QuotaCheckResult> {
    const quota = this.quotas.get(model.provider);
    const provider = getProviderById(model.provider);

    if (!quota || !provider) {
      return {
        canProceed: false,
        provider: model.provider,
        model,
        cost: 0,
        quotaUsed: 0,
        quotaRemaining: 0,
      };
    }

    const usedToday = quota.usedToday || 0;
    const dailyLimit = quota.dailyLimit || 0;
    const remaining = dailyLimit - usedToday;

    // For paid providers, always allow (wallet check happens elsewhere)
    if (!provider.isFree) {
      return {
        canProceed: true,
        provider: model.provider,
        model,
        cost: model.costPerRequest || 0,
        quotaUsed: usedToday,
        quotaRemaining: Infinity,
      };
    }

    // For free providers, check if quota is available
    if (remaining > 0) {
      return {
        canProceed: true,
        provider: model.provider,
        model,
        cost: 0,
        quotaUsed: usedToday,
        quotaRemaining: remaining,
      };
    }

    return {
      canProceed: false,
      provider: model.provider,
      model,
      cost: 0,
      quotaUsed: usedToday,
      quotaRemaining: 0,
    };
  }

  async incrementUsage(provider: string): Promise<void> {
    const quota = this.quotas.get(provider);
    if (!quota) return;

    const newUsed = (quota.usedToday || 0) + 1;
    await storage.upsertApiQuota({
      ...quota,
      usedToday: newUsed,
    });
    
    this.quotas.set(provider, { ...quota, usedToday: newUsed });
  }

  getQuotaStatus(): { provider: string; used: number; limit: number; remaining: number; isFree: boolean }[] {
    const status = [];
    for (const [providerId, quota] of this.quotas) {
      const provider = getProviderById(providerId);
      if (provider) {
        status.push({
          provider: providerId,
          used: quota.usedToday || 0,
          limit: quota.dailyLimit || 0,
          remaining: (quota.dailyLimit || 0) - (quota.usedToday || 0),
          isFree: provider.isFree,
        });
      }
    }
    return status;
  }
}
