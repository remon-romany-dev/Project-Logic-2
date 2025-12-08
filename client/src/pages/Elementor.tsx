import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wand2,
  Download,
  Eye,
  Copy,
  Check,
  Loader2,
  LayoutGrid,
  Type,
  Image,
  Square,
  Columns,
  Heading,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";

interface ElementorWidget {
  id: string;
  elType: string;
  widgetType?: string;
  settings: Record<string, unknown>;
  elements?: ElementorWidget[];
}

interface GeneratedTemplate {
  id: string;
  name: string;
  description: string;
  template: ElementorWidget[];
  createdAt: Date;
}

// Mock template
const mockTemplate: ElementorWidget[] = [
  {
    id: "section-1",
    elType: "section",
    settings: { layout: "full_width", gap: "extended" },
    elements: [
      {
        id: "column-1",
        elType: "column",
        settings: { _column_size: 100 },
        elements: [
          {
            id: "heading-1",
            elType: "widget",
            widgetType: "heading",
            settings: {
              title: "Welcome to Our Agency",
              align: "center",
              title_color: "#1a1a1a",
              typography_typography: "custom",
              typography_font_size: { unit: "px", size: 48 },
            },
          },
          {
            id: "text-1",
            elType: "widget",
            widgetType: "text-editor",
            settings: {
              editor: "<p>We create stunning WordPress websites that drive results.</p>",
              align: "center",
            },
          },
        ],
      },
    ],
  },
  {
    id: "section-2",
    elType: "section",
    settings: { layout: "boxed", gap: "default" },
    elements: [
      {
        id: "column-2",
        elType: "column",
        settings: { _column_size: 33 },
        elements: [
          {
            id: "icon-box-1",
            elType: "widget",
            widgetType: "icon-box",
            settings: {
              title: "Web Design",
              description_text: "Beautiful, responsive websites",
              selected_icon: { value: "fas fa-laptop-code" },
            },
          },
        ],
      },
      {
        id: "column-3",
        elType: "column",
        settings: { _column_size: 33 },
        elements: [
          {
            id: "icon-box-2",
            elType: "widget",
            widgetType: "icon-box",
            settings: {
              title: "Development",
              description_text: "Custom WordPress solutions",
              selected_icon: { value: "fas fa-code" },
            },
          },
        ],
      },
      {
        id: "column-4",
        elType: "column",
        settings: { _column_size: 34 },
        elements: [
          {
            id: "icon-box-3",
            elType: "widget",
            widgetType: "icon-box",
            settings: {
              title: "SEO",
              description_text: "Search engine optimization",
              selected_icon: { value: "fas fa-chart-line" },
            },
          },
        ],
      },
    ],
  },
];

const widgetIcons: Record<string, typeof Heading> = {
  heading: Heading,
  "text-editor": Type,
  image: Image,
  button: Square,
  "icon-box": LayoutGrid,
  section: Columns,
};

const renderWidgetPreview = (widget: ElementorWidget, depth = 0) => {
  const Icon = widgetIcons[widget.widgetType || widget.elType] || Square;
  
  return (
    <div
      key={widget.id}
      className={`border-l-2 ${depth === 0 ? "border-primary" : depth === 1 ? "border-blue-400" : "border-muted"}`}
      style={{ marginLeft: depth * 12 }}
    >
      <div className="flex items-center gap-2 rounded-r-md bg-muted/50 px-3 py-2 hover-elevate">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">
          {widget.widgetType || widget.elType}
        </span>
        {widget.elType === "section" && (
          <Badge variant="secondary" className="ml-auto text-xs">
            Section
          </Badge>
        )}
      </div>
      {widget.elements?.map((child) => renderWidgetPreview(child, depth + 1))}
    </div>
  );
};

export default function Elementor() {
  const { t } = useLanguage();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [template, setTemplate] = useState<ElementorWidget[] | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    // Simulate generation (will be replaced with real API)
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setTemplate(mockTemplate);
    setIsGenerating(false);
  };

  const copyToClipboard = () => {
    if (!template) return;
    navigator.clipboard.writeText(JSON.stringify(template, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    if (!template) return;
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "elementor-template.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const presetPrompts = [
    "Modern agency homepage with hero, services, and contact form",
    "E-commerce product showcase with testimonials",
    "Portfolio page with grid gallery and about section",
    "Blog layout with featured posts and sidebar",
    "Landing page for SaaS product with pricing table",
  ];

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-6xl space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-bold">{t("nav.elementor")}</h1>
          <p className="text-muted-foreground">{t("feature.elementor.desc")}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                {t("elementor.describe")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t("elementor.describe")}
                className="min-h-[150px] resize-none"
                data-testid="input-elementor-prompt"
              />

              {/* Preset Prompts */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Quick Presets:</p>
                <div className="flex flex-wrap gap-2">
                  {presetPrompts.map((preset, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover-elevate"
                      onClick={() => setPrompt(preset)}
                      data-testid={`preset-${index}`}
                    >
                      {preset.slice(0, 30)}...
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                className="w-full gap-2"
                size="lg"
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                data-testid="button-generate-template"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-5 w-5" />
                    {t("elementor.generate")}
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                  Uses free AI models
                </span>
              </p>
            </CardContent>
          </Card>

          {/* Output Panel */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle className="flex items-center gap-2">
                <LayoutGrid className="h-5 w-5 text-primary" />
                Generated Template
              </CardTitle>
              {template && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={copyToClipboard}
                    data-testid="button-copy-template"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? t("chat.copied") : "Copy"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={downloadJson}
                    data-testid="button-download-template"
                  >
                    <Download className="h-4 w-4" />
                    {t("elementor.download")}
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {template ? (
                <Tabs defaultValue="structure" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="structure">Structure</TabsTrigger>
                    <TabsTrigger value="json">JSON</TabsTrigger>
                  </TabsList>

                  <TabsContent value="structure">
                    <ScrollArea className="h-[400px] rounded-lg border p-4">
                      <div className="space-y-2">
                        {template.map((widget) => renderWidgetPreview(widget))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="json">
                    <ScrollArea className="h-[400px] rounded-lg bg-muted p-4">
                      <pre className="whitespace-pre-wrap font-mono text-xs">
                        {JSON.stringify(template, null, 2)}
                      </pre>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
                  <div className="text-center text-muted-foreground">
                    <LayoutGrid className="mx-auto mb-4 h-12 w-12 opacity-50" />
                    <p>Your generated template will appear here</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Widgets Reference */}
        <Card>
          <CardHeader>
            <CardTitle>{t("elementor.widgets")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[
                { name: "Heading", icon: Heading, desc: "H1-H6 titles" },
                { name: "Text Editor", icon: Type, desc: "Rich text content" },
                { name: "Image", icon: Image, desc: "Images & galleries" },
                { name: "Button", icon: Square, desc: "CTA buttons" },
                { name: "Icon Box", icon: LayoutGrid, desc: "Icons with text" },
                { name: "Section", icon: Columns, desc: "Layout container" },
              ].map((widget, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg border p-3 hover-elevate"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <widget.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{widget.name}</p>
                    <p className="text-xs text-muted-foreground">{widget.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
