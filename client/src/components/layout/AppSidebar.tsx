import { Link, useLocation } from "wouter";
import {
  MessageSquare,
  Shield,
  Code2,
  ImagePlus,
  LayoutGrid,
  Settings,
  Wallet,
  Home,
  Zap,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

// AI Provider quota data (will be fetched from API)
const mockQuotas = [
  { name: "Gemini", used: 450, limit: 1500, color: "bg-blue-500" },
  { name: "Claude", used: 200, limit: 1000, color: "bg-purple-500" },
  { name: "Groq", used: 0, limit: 10000, color: "bg-orange-500" },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { t, isRTL } = useLanguage();

  const navItems = [
    { title: t("nav.home"), url: "/", icon: Home },
    { title: t("nav.chat"), url: "/chat", icon: MessageSquare },
    { title: t("nav.wpDoctor"), url: "/wordpress-doctor", icon: Shield },
    { title: t("nav.ide"), url: "/ide", icon: Code2 },
    { title: t("nav.imageAi"), url: "/image-ai", icon: ImagePlus },
    { title: t("nav.elementor"), url: "/elementor", icon: LayoutGrid },
  ];

  const settingsItems = [
    { title: t("nav.wallet"), url: "/wallet", icon: Wallet },
    { title: t("nav.settings"), url: "/settings", icon: Settings },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>{t("landing.features")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.url.replace("/", "") || "home"}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupLabel>{t("settings.title")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.url.replace("/", "")}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Quota Meters Footer */}
      <SidebarFooter className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Zap className="h-4 w-4" />
            <span>{t("dashboard.quotaStatus")}</span>
          </div>
          {mockQuotas.map((quota) => {
            const percentage = (quota.used / quota.limit) * 100;
            const remaining = quota.limit - quota.used;
            return (
              <div key={quota.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{quota.name}</span>
                  <span className="text-muted-foreground">
                    {remaining.toLocaleString()} {t("quota.remaining")}
                  </span>
                </div>
                <Progress 
                  value={percentage} 
                  className="h-2"
                  data-testid={`quota-progress-${quota.name.toLowerCase()}`}
                />
              </div>
            );
          })}
          <Badge variant="secondary" className="w-full justify-center text-xs">
            {t("quota.free")}
          </Badge>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
