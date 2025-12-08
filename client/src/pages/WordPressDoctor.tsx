import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Shield,
  Zap,
  Code2,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  FileArchive,
  Download,
  RefreshCw,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";

interface AnalysisResult {
  name: string;
  type: "theme" | "plugin";
  version: string;
  security: { score: number; issues: Issue[] };
  performance: { score: number; issues: Issue[] };
  codeQuality: { score: number; issues: Issue[] };
}

interface Issue {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  file?: string;
  line?: number;
  code?: string;
  fix?: string;
}

// Mock analysis result for demo
const mockResult: AnalysisResult = {
  name: "MyCustomTheme",
  type: "theme",
  version: "1.2.0",
  security: {
    score: 72,
    issues: [
      {
        id: "1",
        severity: "critical",
        title: "SQL Injection Vulnerability",
        description: "Direct use of $wpdb->query() without prepared statements",
        file: "includes/database.php",
        line: 45,
        code: "$wpdb->query(\"SELECT * FROM users WHERE id = \" . $_GET['id']);",
        fix: "$wpdb->prepare(\"SELECT * FROM users WHERE id = %d\", intval($_GET['id']));",
      },
      {
        id: "2",
        severity: "high",
        title: "XSS Vulnerability",
        description: "Unescaped output of user input",
        file: "templates/single.php",
        line: 23,
        code: "echo $_GET['search'];",
        fix: "echo esc_html($_GET['search']);",
      },
    ],
  },
  performance: {
    score: 85,
    issues: [
      {
        id: "3",
        severity: "medium",
        title: "Large Image Files",
        description: "Images over 500KB detected that should be optimized",
        file: "assets/images/hero.jpg",
      },
      {
        id: "4",
        severity: "low",
        title: "Unminified CSS",
        description: "CSS files are not minified for production",
        file: "assets/css/style.css",
      },
    ],
  },
  codeQuality: {
    score: 68,
    issues: [
      {
        id: "5",
        severity: "medium",
        title: "Deprecated Function Usage",
        description: "Using deprecated WordPress function",
        file: "functions.php",
        line: 156,
        code: "query_posts($args);",
        fix: "$query = new WP_Query($args);",
      },
    ],
  },
};

export default function WordPressDoctor() {
  const { t, isRTL } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.name.endsWith(".zip")) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.name.endsWith(".zip")) {
      setFile(selectedFile);
    }
  };

  const startAnalysis = async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    // Simulate analysis (will be replaced with real API)
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setResult(mockResult);
    setIsAnalyzing(false);
  };

  const resetAnalysis = () => {
    setFile(null);
    setResult(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical": return AlertTriangle;
      case "high": return AlertCircle;
      default: return AlertCircle;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-5xl space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-bold">{t("nav.wpDoctor")}</h1>
          <p className="text-muted-foreground">{t("feature.wpDoctor.desc")}</p>
        </div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Upload Zone */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div
                    className={`relative flex min-h-[300px] flex-col items-center justify-center gap-6 border-2 border-dashed p-8 transition-colors ${
                      isDragging
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    data-testid="dropzone-wp-upload"
                  >
                    {file ? (
                      <>
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                          <FileArchive className="h-10 w-10 text-primary" />
                        </div>
                        <div className="text-center">
                          <p className="font-semibold">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            onClick={startAnalysis}
                            disabled={isAnalyzing}
                            data-testid="button-start-analysis"
                          >
                            {isAnalyzing ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t("wp.analyzing")}
                              </>
                            ) : (
                              <>
                                <Shield className="mr-2 h-4 w-4" />
                                Start Analysis
                              </>
                            )}
                          </Button>
                          <Button variant="outline" onClick={resetAnalysis}>
                            <X className="mr-2 h-4 w-4" />
                            {t("common.cancel")}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                          <Upload className="h-10 w-10 text-primary" />
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold">{t("wp.upload")}</p>
                          <p className="text-sm text-muted-foreground">{t("wp.uploadDesc")}</p>
                        </div>
                        <input
                          type="file"
                          accept=".zip"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="file-upload"
                          data-testid="input-wp-file"
                        />
                        <label htmlFor="file-upload">
                          <Button asChild>
                            <span>
                              <Upload className="mr-2 h-4 w-4" />
                              {t("wp.upload")}
                            </span>
                          </Button>
                        </label>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Summary Header */}
              <Card>
                <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
                      <FileArchive className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{result.name}</h2>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline">{result.type}</Badge>
                        <span>v{result.version}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={resetAnalysis}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      New Analysis
                    </Button>
                    <Button data-testid="button-download-report">
                      <Download className="mr-2 h-4 w-4" />
                      {t("wp.downloadReport")}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Score Cards */}
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { key: "security", icon: Shield, label: t("wp.security"), data: result.security },
                  { key: "performance", icon: Zap, label: t("wp.performance"), data: result.performance },
                  { key: "codeQuality", icon: Code2, label: t("wp.codeQuality"), data: result.codeQuality },
                ].map(({ key, icon: Icon, label, data }) => (
                  <Card key={key} data-testid={`card-score-${key}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <span className="font-medium">{label}</span>
                        </div>
                        <span className={`text-2xl font-bold ${getScoreColor(data.score)}`}>
                          {data.score}%
                        </span>
                      </div>
                      <Progress value={data.score} className="mt-4 h-2" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        {data.issues.length} {t("wp.issues").toLowerCase()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Issues List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    {t("wp.issues")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <Accordion type="multiple" className="space-y-2">
                      {[...result.security.issues, ...result.performance.issues, ...result.codeQuality.issues].map(
                        (issue) => {
                          const SeverityIcon = getSeverityIcon(issue.severity);
                          return (
                            <AccordionItem
                              key={issue.id}
                              value={issue.id}
                              className="rounded-lg border px-4"
                              data-testid={`issue-${issue.id}`}
                            >
                              <AccordionTrigger className="py-4 hover:no-underline">
                                <div className="flex items-center gap-3">
                                  <Badge className={`${getSeverityColor(issue.severity)} text-white`}>
                                    <SeverityIcon className="mr-1 h-3 w-3" />
                                    {t(`wp.${issue.severity}`)}
                                  </Badge>
                                  <span className="text-left font-medium">{issue.title}</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pb-4">
                                <div className="space-y-3">
                                  <p className="text-sm text-muted-foreground">{issue.description}</p>
                                  
                                  {issue.file && (
                                    <div className="text-sm">
                                      <span className="font-medium">File: </span>
                                      <code className="rounded bg-muted px-2 py-0.5">{issue.file}</code>
                                      {issue.line && (
                                        <span className="text-muted-foreground"> (Line {issue.line})</span>
                                      )}
                                    </div>
                                  )}
                                  
                                  {issue.code && (
                                    <div className="space-y-1">
                                      <p className="text-sm font-medium text-destructive">Problematic code:</p>
                                      <pre className="overflow-x-auto rounded-lg bg-card p-3 text-sm">
                                        <code>{issue.code}</code>
                                      </pre>
                                    </div>
                                  )}
                                  
                                  {issue.fix && (
                                    <div className="space-y-1">
                                      <p className="text-sm font-medium text-green-500">Suggested fix:</p>
                                      <pre className="overflow-x-auto rounded-lg bg-card p-3 text-sm">
                                        <code>{issue.fix}</code>
                                      </pre>
                                    </div>
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          );
                        }
                      )}
                    </Accordion>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
