// Multi-language support for Remon Romany Genius
// Supports: Arabic (RTL), English, German, French, Spanish

export type Language = "ar" | "en" | "de" | "fr" | "es";

export const languages: Record<Language, { name: string; nativeName: string; dir: "ltr" | "rtl" }> = {
  ar: { name: "Arabic", nativeName: "العربية", dir: "rtl" },
  en: { name: "English", nativeName: "English", dir: "ltr" },
  de: { name: "German", nativeName: "Deutsch", dir: "ltr" },
  fr: { name: "French", nativeName: "Français", dir: "ltr" },
  es: { name: "Spanish", nativeName: "Español", dir: "ltr" },
};

export const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.chat": "المحادثة",
    "nav.wpDoctor": "فحص ووردبريس",
    "nav.ide": "محرر الكود",
    "nav.imageAi": "توليد الصور",
    "nav.elementor": "قوالب Elementor",
    "nav.settings": "الإعدادات",
    "nav.wallet": "المحفظة",
    "nav.logout": "تسجيل الخروج",
    "nav.login": "تسجيل الدخول",

    // Landing page
    "landing.title": "Remon Romany Genius",
    "landing.subtitle": "منصة الذكاء الاصطناعي الشاملة لتطوير ووردبريس",
    "landing.description": "حلل، أصلح، وطور مشاريع ووردبريس باستخدام أحدث نماذج الذكاء الاصطناعي",
    "landing.cta": "ابدأ مجاناً",
    "landing.features": "المميزات",

    // Features
    "feature.chat": "محادثة ذكية",
    "feature.chat.desc": "تحدث مع الذكاء الاصطناعي للحصول على حلول برمجية فورية",
    "feature.wpDoctor": "فحص ووردبريس",
    "feature.wpDoctor.desc": "حلل ثيمات وإضافات ووردبريس للكشف عن المشاكل الأمنية والأداء",
    "feature.ide": "محرر كود متكامل",
    "feature.ide.desc": "اكتب وعدل الكود مع إكمال تلقائي ذكي",
    "feature.imageAi": "توليد الصور",
    "feature.imageAi.desc": "أنشئ صور احترافية باستخدام DALL-E 3 و Stable Diffusion",
    "feature.elementor": "قوالب Elementor",
    "feature.elementor.desc": "ولّد قوالب Elementor Pro جاهزة للاستيراد",
    "feature.quota": "حصص ذكية",
    "feature.quota.desc": "استخدم نماذج AI مجانية مع تبديل تلقائي ذكي",

    // Dashboard
    "dashboard.welcome": "مرحباً",
    "dashboard.quotaStatus": "حالة الحصص",
    "dashboard.recentChats": "المحادثات الأخيرة",
    "dashboard.quickActions": "إجراءات سريعة",
    "dashboard.costSaved": "التكلفة الموفرة",
    "dashboard.requestsToday": "الطلبات اليوم",

    // Chat
    "chat.newChat": "محادثة جديدة",
    "chat.placeholder": "اكتب رسالتك هنا...",
    "chat.send": "إرسال",
    "chat.selectModel": "اختر النموذج",
    "chat.thinking": "جاري التفكير...",
    "chat.copyCode": "نسخ الكود",
    "chat.copied": "تم النسخ!",

    // WordPress Doctor
    "wp.upload": "ارفع ملف ZIP",
    "wp.uploadDesc": "ارفع ثيم أو إضافة ووردبريس للتحليل",
    "wp.analyzing": "جاري التحليل...",
    "wp.security": "الأمان",
    "wp.performance": "الأداء",
    "wp.codeQuality": "جودة الكود",
    "wp.issues": "المشاكل",
    "wp.critical": "حرج",
    "wp.high": "مرتفع",
    "wp.medium": "متوسط",
    "wp.low": "منخفض",
    "wp.noIssues": "لا توجد مشاكل!",
    "wp.downloadReport": "تحميل التقرير",

    // IDE
    "ide.files": "الملفات",
    "ide.newFile": "ملف جديد",
    "ide.save": "حفظ",
    "ide.askAi": "اسأل الذكاء الاصطناعي",

    // Image AI
    "image.prompt": "صف الصورة المطلوبة...",
    "image.generate": "ولّد الصورة",
    "image.generating": "جاري التوليد...",
    "image.download": "تحميل",
    "image.regenerate": "إعادة التوليد",
    "image.gallery": "المعرض",

    // Elementor
    "elementor.describe": "صف الموقع المطلوب...",
    "elementor.generate": "ولّد القالب",
    "elementor.preview": "معاينة",
    "elementor.download": "تحميل JSON",
    "elementor.widgets": "العناصر",

    // Settings
    "settings.title": "الإعدادات",
    "settings.language": "اللغة",
    "settings.theme": "المظهر",
    "settings.dark": "داكن",
    "settings.light": "فاتح",
    "settings.notifications": "الإشعارات",
    "settings.save": "حفظ التغييرات",

    // Wallet
    "wallet.balance": "الرصيد الحالي",
    "wallet.addFunds": "إضافة رصيد",
    "wallet.history": "سجل المعاملات",
    "wallet.deposit": "إيداع",
    "wallet.usage": "استخدام",

    // Quota
    "quota.remaining": "متبقي",
    "quota.of": "من",
    "quota.free": "مجاني",
    "quota.warning": "تحذير: الحصة على وشك النفاد",
    "quota.switched": "تم التبديل إلى",

    // Common
    "common.loading": "جاري التحميل...",
    "common.error": "حدث خطأ",
    "common.retry": "إعادة المحاولة",
    "common.cancel": "إلغاء",
    "common.confirm": "تأكيد",
    "common.delete": "حذف",
    "common.edit": "تعديل",
    "common.save": "حفظ",
    "common.close": "إغلاق",
  },

  en: {
    // Navigation
    "nav.home": "Home",
    "nav.chat": "Chat",
    "nav.wpDoctor": "WordPress Doctor",
    "nav.ide": "IDE",
    "nav.imageAi": "Image AI",
    "nav.elementor": "Elementor Templates",
    "nav.settings": "Settings",
    "nav.wallet": "Wallet",
    "nav.logout": "Logout",
    "nav.login": "Login",

    // Landing page
    "landing.title": "Remon Romany Genius",
    "landing.subtitle": "The Complete AI Platform for WordPress Development",
    "landing.description": "Analyze, fix, and develop WordPress projects using the latest AI models",
    "landing.cta": "Start Free",
    "landing.features": "Features",

    // Features
    "feature.chat": "Smart Chat",
    "feature.chat.desc": "Talk to AI for instant programming solutions",
    "feature.wpDoctor": "WordPress Doctor",
    "feature.wpDoctor.desc": "Analyze WordPress themes and plugins for security and performance issues",
    "feature.ide": "Integrated IDE",
    "feature.ide.desc": "Write and edit code with intelligent auto-completion",
    "feature.imageAi": "Image Generation",
    "feature.imageAi.desc": "Create professional images using DALL-E 3 and Stable Diffusion",
    "feature.elementor": "Elementor Templates",
    "feature.elementor.desc": "Generate ready-to-import Elementor Pro templates",
    "feature.quota": "Smart Quotas",
    "feature.quota.desc": "Use free AI models with intelligent auto-switching",

    // Dashboard
    "dashboard.welcome": "Welcome",
    "dashboard.quotaStatus": "Quota Status",
    "dashboard.recentChats": "Recent Chats",
    "dashboard.quickActions": "Quick Actions",
    "dashboard.costSaved": "Cost Saved",
    "dashboard.requestsToday": "Requests Today",

    // Chat
    "chat.newChat": "New Chat",
    "chat.placeholder": "Type your message here...",
    "chat.send": "Send",
    "chat.selectModel": "Select Model",
    "chat.thinking": "Thinking...",
    "chat.copyCode": "Copy Code",
    "chat.copied": "Copied!",

    // WordPress Doctor
    "wp.upload": "Upload ZIP File",
    "wp.uploadDesc": "Upload a WordPress theme or plugin for analysis",
    "wp.analyzing": "Analyzing...",
    "wp.security": "Security",
    "wp.performance": "Performance",
    "wp.codeQuality": "Code Quality",
    "wp.issues": "Issues",
    "wp.critical": "Critical",
    "wp.high": "High",
    "wp.medium": "Medium",
    "wp.low": "Low",
    "wp.noIssues": "No issues found!",
    "wp.downloadReport": "Download Report",

    // IDE
    "ide.files": "Files",
    "ide.newFile": "New File",
    "ide.save": "Save",
    "ide.askAi": "Ask AI",

    // Image AI
    "image.prompt": "Describe the image you want...",
    "image.generate": "Generate Image",
    "image.generating": "Generating...",
    "image.download": "Download",
    "image.regenerate": "Regenerate",
    "image.gallery": "Gallery",

    // Elementor
    "elementor.describe": "Describe the website you want...",
    "elementor.generate": "Generate Template",
    "elementor.preview": "Preview",
    "elementor.download": "Download JSON",
    "elementor.widgets": "Widgets",

    // Settings
    "settings.title": "Settings",
    "settings.language": "Language",
    "settings.theme": "Theme",
    "settings.dark": "Dark",
    "settings.light": "Light",
    "settings.notifications": "Notifications",
    "settings.save": "Save Changes",

    // Wallet
    "wallet.balance": "Current Balance",
    "wallet.addFunds": "Add Funds",
    "wallet.history": "Transaction History",
    "wallet.deposit": "Deposit",
    "wallet.usage": "Usage",

    // Quota
    "quota.remaining": "remaining",
    "quota.of": "of",
    "quota.free": "Free",
    "quota.warning": "Warning: Quota almost exhausted",
    "quota.switched": "Switched to",

    // Common
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.retry": "Retry",
    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.save": "Save",
    "common.close": "Close",
  },

  de: {
    // Navigation
    "nav.home": "Startseite",
    "nav.chat": "Chat",
    "nav.wpDoctor": "WordPress Doktor",
    "nav.ide": "IDE",
    "nav.imageAi": "Bild-KI",
    "nav.elementor": "Elementor Vorlagen",
    "nav.settings": "Einstellungen",
    "nav.wallet": "Geldbörse",
    "nav.logout": "Abmelden",
    "nav.login": "Anmelden",

    // Landing page
    "landing.title": "Remon Romany Genius",
    "landing.subtitle": "Die komplette KI-Plattform für WordPress-Entwicklung",
    "landing.description": "Analysieren, reparieren und entwickeln Sie WordPress-Projekte mit neuesten KI-Modellen",
    "landing.cta": "Kostenlos starten",
    "landing.features": "Funktionen",

    // Features
    "feature.chat": "Intelligenter Chat",
    "feature.chat.desc": "Sprechen Sie mit KI für sofortige Programmierlösungen",
    "feature.wpDoctor": "WordPress Doktor",
    "feature.wpDoctor.desc": "Analysieren Sie WordPress-Themes und Plugins auf Sicherheits- und Leistungsprobleme",
    "feature.ide": "Integrierte IDE",
    "feature.ide.desc": "Code schreiben und bearbeiten mit intelligenter Autovervollständigung",
    "feature.imageAi": "Bilderzeugung",
    "feature.imageAi.desc": "Erstellen Sie professionelle Bilder mit DALL-E 3 und Stable Diffusion",
    "feature.elementor": "Elementor Vorlagen",
    "feature.elementor.desc": "Generieren Sie importfertige Elementor Pro Vorlagen",
    "feature.quota": "Intelligente Kontingente",
    "feature.quota.desc": "Nutzen Sie kostenlose KI-Modelle mit intelligentem Auto-Switching",

    // Dashboard
    "dashboard.welcome": "Willkommen",
    "dashboard.quotaStatus": "Kontingentstatus",
    "dashboard.recentChats": "Letzte Chats",
    "dashboard.quickActions": "Schnellaktionen",
    "dashboard.costSaved": "Eingesparte Kosten",
    "dashboard.requestsToday": "Anfragen heute",

    // Common
    "common.loading": "Laden...",
    "common.error": "Ein Fehler ist aufgetreten",
    "common.retry": "Erneut versuchen",
    "common.cancel": "Abbrechen",
    "common.confirm": "Bestätigen",
    "common.delete": "Löschen",
    "common.edit": "Bearbeiten",
    "common.save": "Speichern",
    "common.close": "Schließen",
  },

  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.chat": "Discussion",
    "nav.wpDoctor": "Docteur WordPress",
    "nav.ide": "IDE",
    "nav.imageAi": "IA Image",
    "nav.elementor": "Modèles Elementor",
    "nav.settings": "Paramètres",
    "nav.wallet": "Portefeuille",
    "nav.logout": "Déconnexion",
    "nav.login": "Connexion",

    // Landing page
    "landing.title": "Remon Romany Genius",
    "landing.subtitle": "La plateforme IA complète pour le développement WordPress",
    "landing.description": "Analysez, corrigez et développez des projets WordPress avec les derniers modèles IA",
    "landing.cta": "Commencer gratuitement",
    "landing.features": "Fonctionnalités",

    // Features
    "feature.chat": "Chat intelligent",
    "feature.chat.desc": "Discutez avec l'IA pour des solutions de programmation instantanées",
    "feature.wpDoctor": "Docteur WordPress",
    "feature.wpDoctor.desc": "Analysez les thèmes et plugins WordPress pour les problèmes de sécurité et de performance",
    "feature.ide": "IDE intégré",
    "feature.ide.desc": "Écrivez et modifiez du code avec une autocomplétion intelligente",
    "feature.imageAi": "Génération d'images",
    "feature.imageAi.desc": "Créez des images professionnelles avec DALL-E 3 et Stable Diffusion",
    "feature.elementor": "Modèles Elementor",
    "feature.elementor.desc": "Générez des modèles Elementor Pro prêts à importer",
    "feature.quota": "Quotas intelligents",
    "feature.quota.desc": "Utilisez des modèles IA gratuits avec changement automatique intelligent",

    // Dashboard
    "dashboard.welcome": "Bienvenue",
    "dashboard.quotaStatus": "Statut des quotas",
    "dashboard.recentChats": "Discussions récentes",
    "dashboard.quickActions": "Actions rapides",
    "dashboard.costSaved": "Coûts économisés",
    "dashboard.requestsToday": "Demandes aujourd'hui",

    // Common
    "common.loading": "Chargement...",
    "common.error": "Une erreur s'est produite",
    "common.retry": "Réessayer",
    "common.cancel": "Annuler",
    "common.confirm": "Confirmer",
    "common.delete": "Supprimer",
    "common.edit": "Modifier",
    "common.save": "Enregistrer",
    "common.close": "Fermer",
  },

  es: {
    // Navigation
    "nav.home": "Inicio",
    "nav.chat": "Chat",
    "nav.wpDoctor": "Doctor WordPress",
    "nav.ide": "IDE",
    "nav.imageAi": "IA de Imágenes",
    "nav.elementor": "Plantillas Elementor",
    "nav.settings": "Configuración",
    "nav.wallet": "Cartera",
    "nav.logout": "Cerrar sesión",
    "nav.login": "Iniciar sesión",

    // Landing page
    "landing.title": "Remon Romany Genius",
    "landing.subtitle": "La plataforma de IA completa para desarrollo WordPress",
    "landing.description": "Analiza, repara y desarrolla proyectos WordPress usando los últimos modelos de IA",
    "landing.cta": "Comenzar gratis",
    "landing.features": "Características",

    // Features
    "feature.chat": "Chat inteligente",
    "feature.chat.desc": "Habla con IA para soluciones de programación instantáneas",
    "feature.wpDoctor": "Doctor WordPress",
    "feature.wpDoctor.desc": "Analiza temas y plugins de WordPress para problemas de seguridad y rendimiento",
    "feature.ide": "IDE integrado",
    "feature.ide.desc": "Escribe y edita código con autocompletado inteligente",
    "feature.imageAi": "Generación de imágenes",
    "feature.imageAi.desc": "Crea imágenes profesionales usando DALL-E 3 y Stable Diffusion",
    "feature.elementor": "Plantillas Elementor",
    "feature.elementor.desc": "Genera plantillas Elementor Pro listas para importar",
    "feature.quota": "Cuotas inteligentes",
    "feature.quota.desc": "Usa modelos de IA gratuitos con cambio automático inteligente",

    // Dashboard
    "dashboard.welcome": "Bienvenido",
    "dashboard.quotaStatus": "Estado de cuotas",
    "dashboard.recentChats": "Chats recientes",
    "dashboard.quickActions": "Acciones rápidas",
    "dashboard.costSaved": "Costo ahorrado",
    "dashboard.requestsToday": "Solicitudes hoy",

    // Common
    "common.loading": "Cargando...",
    "common.error": "Ha ocurrido un error",
    "common.retry": "Reintentar",
    "common.cancel": "Cancelar",
    "common.confirm": "Confirmar",
    "common.delete": "Eliminar",
    "common.edit": "Editar",
    "common.save": "Guardar",
    "common.close": "Cerrar",
  },
};

// Get browser language
export function detectLanguage(): Language {
  if (typeof navigator === "undefined") return "en";
  
  const browserLang = navigator.language.split("-")[0];
  if (browserLang in languages) {
    return browserLang as Language;
  }
  return "en";
}

// Translation function
export function t(key: string, lang: Language = "en"): string {
  return translations[lang]?.[key] || translations.en[key] || key;
}

// Get direction for language
export function getDirection(lang: Language): "ltr" | "rtl" {
  return languages[lang]?.dir || "ltr";
}
