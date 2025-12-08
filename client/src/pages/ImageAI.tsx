import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Download,
  RefreshCw,
  Image as ImageIcon,
  Loader2,
  Settings,
  Wand2,
  Copy,
  Check,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  model: string;
  size: string;
  createdAt: Date;
}

// Mock generated images
const mockImages: GeneratedImage[] = [
  {
    id: "1",
    prompt: "Professional WordPress developer working on laptop, modern office, clean design",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=512",
    model: "dall-e-3",
    size: "1024x1024",
    createdAt: new Date(),
  },
  {
    id: "2",
    prompt: "Abstract technology background, blue gradient, geometric shapes",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=512",
    model: "stable-diffusion",
    size: "1024x1024",
    createdAt: new Date(),
  },
];

export default function ImageAI() {
  const { t } = useLanguage();
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("dall-e-3");
  const [size, setSize] = useState("1024x1024");
  const [style, setStyle] = useState("vivid");
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>(mockImages);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);

    // Simulate generation (will be replaced with real API)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const newImage: GeneratedImage = {
      id: Date.now().toString(),
      prompt: prompt.trim(),
      imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=512",
      model,
      size,
      createdAt: new Date(),
    };

    setImages((prev) => [newImage, ...prev]);
    setSelectedImage(newImage);
    setIsGenerating(false);
  };

  const copyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const deleteImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    if (selectedImage?.id === id) {
      setSelectedImage(null);
    }
  };

  const modelOptions = [
    { value: "dall-e-3", label: "DALL-E 3", provider: "OpenAI", cost: "$0.04" },
    { value: "stable-diffusion", label: "Stable Diffusion XL", provider: "Stability", cost: "Free" },
  ];

  const sizeOptions = [
    { value: "1024x1024", label: "Square (1024x1024)" },
    { value: "1024x1792", label: "Portrait (1024x1792)" },
    { value: "1792x1024", label: "Landscape (1792x1024)" },
  ];

  return (
    <div className="flex h-full flex-col lg:flex-row">
      {/* Left Panel - Generate */}
      <div className="flex w-full flex-col border-b border-border lg:w-[400px] lg:border-b-0 lg:border-r">
        <div className="border-b border-border p-4">
          <h1 className="text-xl font-bold">{t("nav.imageAi")}</h1>
          <p className="text-sm text-muted-foreground">{t("feature.imageAi.desc")}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* Prompt Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Prompt</label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t("image.prompt")}
                className="min-h-[120px] resize-none"
                data-testid="input-image-prompt"
              />
            </div>

            {/* Model Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Model</label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger data-testid="select-model">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {modelOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center justify-between gap-3">
                        <span>{opt.label}</span>
                        <Badge variant={opt.cost === "Free" ? "secondary" : "outline"} className="text-xs">
                          {opt.cost}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Size Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Size</label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger data-testid="select-size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sizeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Style Selection (DALL-E 3 only) */}
            {model === "dall-e-3" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Style</label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger data-testid="select-style">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vivid">Vivid</SelectItem>
                    <SelectItem value="natural">Natural</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Generate Button */}
            <Button
              className="w-full gap-2"
              size="lg"
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              data-testid="button-generate-image"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t("image.generating")}
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5" />
                  {t("image.generate")}
                </>
              )}
            </Button>

            {/* Cost indicator */}
            <div className="text-center text-sm text-muted-foreground">
              {model === "dall-e-3" ? (
                <span className="flex items-center justify-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-yellow-500" />
                  Cost: $0.04 per image
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                  Free tier
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Gallery & Preview */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Preview */}
        <AnimatePresence mode="wait">
          {selectedImage ? (
            <motion.div
              key={selectedImage.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative flex-1 overflow-hidden bg-card/30 p-4"
            >
              <div className="relative flex h-full items-center justify-center">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.prompt}
                  className="max-h-full max-w-full rounded-lg object-contain shadow-lg"
                  data-testid="image-preview"
                />

                {/* Image Actions */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                    onClick={() => copyPrompt(selectedImage.prompt)}
                    data-testid="button-copy-prompt"
                  >
                    {copiedPrompt ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copiedPrompt ? t("chat.copied") : "Copy Prompt"}
                  </Button>
                  <Button variant="secondary" size="sm" className="gap-2" data-testid="button-download-image">
                    <Download className="h-4 w-4" />
                    {t("image.download")}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      setPrompt(selectedImage.prompt);
                    }}
                  >
                    <RefreshCw className="h-4 w-4" />
                    {t("image.regenerate")}
                  </Button>
                </div>

                {/* Image Info */}
                <div className="absolute left-4 top-4">
                  <Card className="bg-background/80 backdrop-blur-sm">
                    <CardContent className="p-3">
                      <p className="mb-2 max-w-[300px] text-sm">{selectedImage.prompt}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{selectedImage.model}</Badge>
                        <Badge variant="secondary">{selectedImage.size}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-1 items-center justify-center bg-card/30"
            >
              <div className="text-center">
                <ImageIcon className="mx-auto mb-4 h-16 w-16 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Generate or select an image to preview</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gallery */}
        <div className="border-t border-border bg-card/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-medium">{t("image.gallery")}</h2>
            <Badge variant="secondary">{images.length} images</Badge>
          </div>
          <ScrollArea className="h-[120px]">
            <div className="flex gap-3">
              {images.map((img) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`group relative shrink-0 cursor-pointer overflow-hidden rounded-lg ${
                    selectedImage?.id === img.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedImage(img)}
                  data-testid={`gallery-image-${img.id}`}
                >
                  <img
                    src={img.imageUrl}
                    alt={img.prompt}
                    className="h-[100px] w-[100px] object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteImage(img.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
