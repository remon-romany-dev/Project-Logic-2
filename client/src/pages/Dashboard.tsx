import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Shield,
  Code2,
  ImagePlus,
  LayoutGrid,
  TrendingUp,
  Zap,
  Clock,
  ArrowRight,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// Mock data - will be replaced with real API data
const mockQuotas = [
  { name: "Gemini", provider: "gemini", used: 450, limit: 1500, color: "bg-blue-500", isFree: true },
  { name: "Claude", provider: "claude", used: 200, limit: 1000, color: "bg-purple-500", isFree: true },
  { name: "Groq", provider: "groq", used: 0, limit: 10000, color: "bg-orange-500", isFree: true },
  { name: "OpenAI", provider: "openai", used: 50, limit: 100, color: "bg-green-500", isFree: false },
];

const mockRecentChats = [
  { id: "1", title: "WordPress Security Analysis", model: "Gemini", time: "2 hours ago" },
  { id: "2", title: "Plugin Performance Fix", model: "Claude", time: "5 hours ago" },
  { id: "3", title: "Elementor Template Design", model: "GPT-4o", time: "1 day ago" },
];

export default function Dashboard() {
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();

  const quickActions = [
    { icon: MessageSquare, label: t("nav.chat"), href: "/chat", color: "from-blue-500 to-cyan-500" },
    { icon: Shield, label: t("nav.wpDoctor"), href: "/wordpress-doctor", color: "from-green-500 to-emerald-500" },
    { icon: Code2, label: t("nav.ide"), href: "/ide", color: "from-purple-500 to-pink-500" },
    { icon: ImagePlus, label: t("nav.imageAi"), href: "/image-ai", color: "from-orange-500 to-red-500" },
    { icon: LayoutGrid, label: t("nav.elementor"), href: "/elementor", color: "from-indigo-500 to-blue-500" },
  ];

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Welcome Header */}
        <motion.div variants={item}>
          <h1 className="text-2xl font-bold sm:text-3xl">
            {t("dashboard.welcome")}, {user?.firstName || "User"}!
          </h1>
          <p className="text-muted-foreground">
            {t("landing.subtitle")}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("dashboard.requestsToday")}</p>
                <p className="text-2xl font-bold">127</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("dashboard.costSaved")}</p>
                <p className="text-2xl font-bold">$24.50</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Chats</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Projects Analyzed</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Actions */}
          <motion.div variants={item} className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("dashboard.quickActions")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {quickActions.map((action, index) => (
                    <Link key={index} href={action.href}>
                      <Button
                        variant="outline"
                        className="h-auto w-full flex-col gap-2 p-4 hover-elevate"
                        data-testid={`quick-action-${action.href.replace("/", "")}`}
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${action.color}`}>
                          <action.icon className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-sm font-medium">{action.label}</span>
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quota Status */}
          <motion.div variants={item}>
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <CardTitle className="text-base">{t("dashboard.quotaStatus")}</CardTitle>
                <Badge variant="secondary">{t("quota.free")}</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockQuotas.map((quota) => {
                  const percentage = (quota.used / quota.limit) * 100;
                  const remaining = quota.limit - quota.used;
                  const isLow = percentage > 80;
                  
                  return (
                    <div key={quota.name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${quota.color}`} />
                          <span className="font-medium">{quota.name}</span>
                          {quota.isFree && (
                            <Badge variant="outline" className="px-1 py-0 text-xs">
                              Free
                            </Badge>
                          )}
                        </div>
                        <span className={isLow ? "text-destructive" : "text-muted-foreground"}>
                          {remaining.toLocaleString()} {t("quota.remaining")}
                        </span>
                      </div>
                      <Progress 
                        value={percentage} 
                        className={`h-2 ${isLow ? "[&>div]:bg-destructive" : ""}`}
                        data-testid={`quota-${quota.provider}`}
                      />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Chats */}
        <motion.div variants={item}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle>{t("dashboard.recentChats")}</CardTitle>
              <Link href="/chat">
                <Button variant="ghost" size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  {t("chat.newChat")}
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockRecentChats.map((chat) => (
                  <Link key={chat.id} href={`/chat/${chat.id}`}>
                    <div className="flex items-center justify-between rounded-lg border border-border p-4 hover-elevate">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <MessageSquare className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{chat.title}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className="px-1 py-0 text-xs">
                              {chat.model}
                            </Badge>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {chat.time}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className={`h-4 w-4 text-muted-foreground ${isRTL ? "rotate-180" : ""}`} />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
