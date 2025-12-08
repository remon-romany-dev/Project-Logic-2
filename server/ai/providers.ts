// AI Provider configurations for Remon Romany Genius
// Supports: Gemini, Anthropic, OpenAI, Groq

export interface AIProvider {
  id: string;
  name: string;
  models: AIModel[];
  dailyFreeLimit: number;
  isFree: boolean;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  costPerRequest?: number; // in USD, undefined means free
  contextWindow: number;
  capabilities: string[];
}

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: "gemini",
    name: "Google Gemini",
    dailyFreeLimit: 1500,
    isFree: true,
    models: [
      {
        id: "gemini-2.5-flash",
        name: "Gemini 2.5 Flash",
        provider: "gemini",
        contextWindow: 1000000,
        capabilities: ["text", "code", "vision"],
      },
      {
        id: "gemini-2.5-pro",
        name: "Gemini 2.5 Pro",
        provider: "gemini",
        contextWindow: 2000000,
        capabilities: ["text", "code", "vision", "reasoning"],
      },
    ],
  },
  {
    id: "anthropic",
    name: "Anthropic Claude",
    dailyFreeLimit: 1000,
    isFree: true,
    models: [
      {
        id: "claude-sonnet-4-20250514",
        name: "Claude Sonnet 4",
        provider: "anthropic",
        contextWindow: 200000,
        capabilities: ["text", "code", "vision", "reasoning"],
      },
      {
        id: "claude-3-5-haiku-20241022",
        name: "Claude 3.5 Haiku",
        provider: "anthropic",
        contextWindow: 200000,
        capabilities: ["text", "code"],
      },
    ],
  },
  {
    id: "groq",
    name: "Groq",
    dailyFreeLimit: 10000,
    isFree: true,
    models: [
      {
        id: "llama-3.3-70b-versatile",
        name: "Llama 3.3 70B",
        provider: "groq",
        contextWindow: 128000,
        capabilities: ["text", "code"],
      },
      {
        id: "mixtral-8x7b-32768",
        name: "Mixtral 8x7B",
        provider: "groq",
        contextWindow: 32768,
        capabilities: ["text", "code"],
      },
    ],
  },
  {
    id: "openai",
    name: "OpenAI",
    dailyFreeLimit: 0,
    isFree: false,
    models: [
      {
        id: "gpt-4o",
        name: "GPT-4o",
        provider: "openai",
        costPerRequest: 0.002,
        contextWindow: 128000,
        capabilities: ["text", "code", "vision", "reasoning"],
      },
      {
        id: "gpt-4o-mini",
        name: "GPT-4o Mini",
        provider: "openai",
        costPerRequest: 0.0001,
        contextWindow: 128000,
        capabilities: ["text", "code", "vision"],
      },
    ],
  },
];

export function getProviderById(id: string): AIProvider | undefined {
  return AI_PROVIDERS.find((p) => p.id === id);
}

export function getModelById(modelId: string): AIModel | undefined {
  for (const provider of AI_PROVIDERS) {
    const model = provider.models.find((m) => m.id === modelId);
    if (model) return model;
  }
  return undefined;
}

export function getAllModels(): AIModel[] {
  return AI_PROVIDERS.flatMap((p) => p.models);
}

export function getFreeProviders(): AIProvider[] {
  return AI_PROVIDERS.filter((p) => p.isFree);
}
