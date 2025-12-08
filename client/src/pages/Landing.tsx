import { motion } from "framer-motion";
import { 
  MessageSquare, 
  Shield, 
  Code2, 
  ImagePlus, 
  LayoutGrid, 
  Zap,
  ArrowRight,
  Sparkles,
  Globe,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

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

export default function Landing() {
  const { t, isRTL } = useLanguage();

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const features = [
    {
      icon: MessageSquare,
      title: t("feature.chat"),
      description: t("feature.chat.desc"),
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Shield,
      title: t("feature.wpDoctor"),
      description: t("feature.wpDoctor.desc"),
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Code2,
      title: t("feature.ide"),
      description: t("feature.ide.desc"),
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: ImagePlus,
      title: t("feature.imageAi"),
      description: t("feature.imageAi.desc"),
      color: "from-orange-500 to-red-500",
    },
    {
      icon: LayoutGrid,
      title: t("feature.elementor"),
      description: t("feature.elementor.desc"),
      color: "from-indigo-500 to-blue-500",
    },
    {
      icon: Zap,
      title: t("feature.quota"),
      description: t("feature.quota.desc"),
      color: "from-yellow-500 to-orange-500",
    },
  ];

  const aiModels = [
    "GPT-4o",
    "Claude 3.5",
    "Gemini 2.0",
    "Groq",
    "DALL-E 3",
    "Stable Diffusion",
  ];

  const languages = ["العربية", "English", "Deutsch", "Français", "Español"];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 inline-flex"
            >
              <Badge variant="secondary" className="gap-2 px-4 py-2 text-sm">
                <Sparkles className="h-4 w-4" />
                50+ AI Models
              </Badge>
            </motion.div>

            {/* Title */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                {t("landing.title")}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              {t("landing.description")}
            </p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Button 
                size="lg" 
                onClick={handleLogin}
                className="gap-2 px-8"
                data-testid="button-cta-login"
              >
                {t("landing.cta")}
                <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Globe className="h-4 w-4" />
                5 {t("settings.language")}s
              </Button>
            </motion.div>

            {/* AI Models badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-2"
            >
              {aiModels.map((model) => (
                <Badge key={model} variant="outline" className="px-3 py-1">
                  {model}
                </Badge>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              {t("landing.features")}
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {t("landing.subtitle")}
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={item}>
                <Card className="group h-full overflow-visible hover-elevate">
                  <CardContent className="p-6">
                    <div
                      className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${feature.color}`}
                    >
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Languages Section */}
      <section className="border-t border-border bg-card/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Globe className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h2 className="mb-6 text-2xl font-bold">
              {t("settings.language")}
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {languages.map((lang) => (
                <Badge key={lang} variant="secondary" className="px-4 py-2 text-base">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  {lang}
                </Badge>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden">
              <div className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-background p-8 sm:p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                <div className="relative text-center">
                  <Sparkles className="mx-auto mb-4 h-12 w-12 text-primary" />
                  <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
                    {t("landing.title")}
                  </h2>
                  <p className="mx-auto mb-6 max-w-xl text-muted-foreground">
                    {t("landing.description")}
                  </p>
                  <Button 
                    size="lg" 
                    onClick={handleLogin}
                    className="gap-2"
                    data-testid="button-cta-login-bottom"
                  >
                    {t("landing.cta")}
                    <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Remon Romany Genius. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
