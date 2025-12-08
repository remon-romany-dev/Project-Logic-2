import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  File,
  Folder,
  FolderOpen,
  Plus,
  Save,
  Sparkles,
  ChevronRight,
  ChevronDown,
  FileCode,
  FileJson,
  FileCog,
  Settings,
  Play,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useLanguage } from "@/contexts/LanguageContext";

interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  content?: string;
  language?: string;
}

// Mock file tree
const mockFileTree: FileNode[] = [
  {
    id: "1",
    name: "my-theme",
    type: "folder",
    children: [
      { id: "2", name: "style.css", type: "file", language: "css", content: "/* Theme styles */\n\nbody {\n  font-family: 'Open Sans', sans-serif;\n  line-height: 1.6;\n  color: #333;\n}" },
      { id: "3", name: "functions.php", type: "file", language: "php", content: "<?php\n/**\n * Theme Functions\n */\n\nfunction my_theme_setup() {\n    add_theme_support('title-tag');\n    add_theme_support('post-thumbnails');\n}\nadd_action('after_setup_theme', 'my_theme_setup');" },
      {
        id: "4",
        name: "templates",
        type: "folder",
        children: [
          { id: "5", name: "header.php", type: "file", language: "php", content: '<?php\n/**\n * Header Template\n */\n?>\n<!DOCTYPE html>\n<html <?php language_attributes(); ?>>\n<head>\n    <meta charset="<?php bloginfo(\'charset\'); ?>">\n    <?php wp_head(); ?>\n</head>\n<body <?php body_class(); ?>>' },
          { id: "6", name: "footer.php", type: "file", language: "php", content: "<?php\n/**\n * Footer Template\n */\n?>\n    <?php wp_footer(); ?>\n</body>\n</html>" },
        ],
      },
      { id: "7", name: "package.json", type: "file", language: "json", content: '{\n  "name": "my-theme",\n  "version": "1.0.0",\n  "scripts": {\n    "build": "webpack --mode production"\n  }\n}' },
    ],
  },
];

const getFileIcon = (name: string) => {
  if (name.endsWith(".php")) return FileCode;
  if (name.endsWith(".json")) return FileJson;
  if (name.endsWith(".css") || name.endsWith(".scss")) return FileCog;
  return File;
};

interface FileTreeItemProps {
  node: FileNode;
  depth: number;
  openFolders: Set<string>;
  selectedFile: string | null;
  onToggleFolder: (id: string) => void;
  onSelectFile: (node: FileNode) => void;
}

function FileTreeItem({ node, depth, openFolders, selectedFile, onToggleFolder, onSelectFile }: FileTreeItemProps) {
  const isOpen = openFolders.has(node.id);
  const isSelected = selectedFile === node.id;
  const Icon = node.type === "folder" ? (isOpen ? FolderOpen : Folder) : getFileIcon(node.name);
  const ChevronIcon = isOpen ? ChevronDown : ChevronRight;

  return (
    <div>
      <div
        className={`flex cursor-pointer items-center gap-1 rounded-md px-2 py-1.5 text-sm hover-elevate ${
          isSelected ? "bg-accent" : ""
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => {
          if (node.type === "folder") {
            onToggleFolder(node.id);
          } else {
            onSelectFile(node);
          }
        }}
        data-testid={`file-tree-item-${node.id}`}
      >
        {node.type === "folder" && (
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
        <Icon className={`h-4 w-4 shrink-0 ${node.type === "folder" ? "text-blue-500" : "text-muted-foreground"}`} />
        <span className="truncate">{node.name}</span>
      </div>
      {node.type === "folder" && isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              openFolders={openFolders}
              selectedFile={selectedFile}
              onToggleFolder={onToggleFolder}
              onSelectFile={onSelectFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface OpenTab {
  id: string;
  name: string;
  content: string;
  language: string;
  isDirty: boolean;
}

export default function IDE() {
  const { t } = useLanguage();
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set(["1"]));
  const [openTabs, setOpenTabs] = useState<OpenTab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [showAiPanel, setShowAiPanel] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const toggleFolder = (id: string) => {
    setOpenFolders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectFile = (node: FileNode) => {
    if (node.type !== "file") return;

    // Check if already open
    const existingTab = openTabs.find((tab) => tab.id === node.id);
    if (existingTab) {
      setActiveTab(node.id);
      return;
    }

    // Open new tab
    const newTab: OpenTab = {
      id: node.id,
      name: node.name,
      content: node.content || "",
      language: node.language || "text",
      isDirty: false,
    };
    setOpenTabs((prev) => [...prev, newTab]);
    setActiveTab(node.id);
  };

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenTabs((prev) => prev.filter((tab) => tab.id !== id));
    if (activeTab === id) {
      const remaining = openTabs.filter((tab) => tab.id !== id);
      setActiveTab(remaining.length > 0 ? remaining[remaining.length - 1].id : null);
    }
  };

  const updateTabContent = (content: string) => {
    if (!activeTab) return;
    setOpenTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTab ? { ...tab, content, isDirty: true } : tab
      )
    );
  };

  const activeTabData = openTabs.find((tab) => tab.id === activeTab);

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-card/50 px-4 py-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            {t("ide.newFile")}
          </Button>
          <Button variant="ghost" size="sm" className="gap-2" data-testid="button-save-file">
            <Save className="h-4 w-4" />
            {t("ide.save")}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={showAiPanel ? "default" : "outline"}
            size="sm"
            className="gap-2"
            onClick={() => setShowAiPanel(!showAiPanel)}
            data-testid="button-toggle-ai-panel"
          >
            <Sparkles className="h-4 w-4" />
            {t("ide.askAi")}
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* File Tree */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={35}>
            <div className="flex h-full flex-col border-r border-border bg-card/30">
              <div className="flex items-center justify-between border-b border-border px-3 py-2">
                <span className="text-sm font-medium">{t("ide.files")}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="flex-1 p-2">
                {mockFileTree.map((node) => (
                  <FileTreeItem
                    key={node.id}
                    node={node}
                    depth={0}
                    openFolders={openFolders}
                    selectedFile={activeTab}
                    onToggleFolder={toggleFolder}
                    onSelectFile={selectFile}
                  />
                ))}
              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Editor Area */}
          <ResizablePanel defaultSize={showAiPanel ? 55 : 80}>
            <div className="flex h-full flex-col">
              {/* Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto border-b border-border bg-card/30 px-2">
                {openTabs.map((tab) => (
                  <div
                    key={tab.id}
                    className={`flex cursor-pointer items-center gap-2 border-b-2 px-3 py-2 text-sm ${
                      activeTab === tab.id
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                    data-testid={`tab-${tab.id}`}
                  >
                    {getFileIcon(tab.name)({ className: "h-4 w-4" })}
                    <span>{tab.name}</span>
                    {tab.isDirty && <span className="h-2 w-2 rounded-full bg-yellow-500" />}
                    <button
                      className="ml-1 rounded p-0.5 hover:bg-muted"
                      onClick={(e) => closeTab(tab.id, e)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Editor */}
              <div className="flex-1 overflow-hidden">
                {activeTabData ? (
                  <div className="relative h-full">
                    <Badge
                      variant="secondary"
                      className="absolute right-2 top-2 z-10 text-xs"
                    >
                      {activeTabData.language}
                    </Badge>
                    <Textarea
                      ref={editorRef}
                      value={activeTabData.content}
                      onChange={(e) => updateTabContent(e.target.value)}
                      className="h-full resize-none rounded-none border-0 font-mono text-sm focus-visible:ring-0"
                      spellCheck={false}
                      data-testid="textarea-editor"
                    />
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <FileCode className="mx-auto mb-4 h-12 w-12 opacity-50" />
                      <p>Select a file to start editing</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>

          {showAiPanel && (
            <>
              <ResizableHandle />

              {/* AI Panel */}
              <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
                <div className="flex h-full flex-col border-l border-border bg-card/30">
                  <div className="flex items-center justify-between border-b border-border px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">AI Assistant</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setShowAiPanel(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Ask AI to help you write, refactor, or debug code.
                      </p>
                      <div className="rounded-lg bg-card p-3">
                        <p className="text-sm">
                          <strong>Suggestions:</strong>
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                          <li className="cursor-pointer hover:text-foreground">
                            - Explain this code
                          </li>
                          <li className="cursor-pointer hover:text-foreground">
                            - Find bugs in this file
                          </li>
                          <li className="cursor-pointer hover:text-foreground">
                            - Optimize for performance
                          </li>
                          <li className="cursor-pointer hover:text-foreground">
                            - Add WordPress security checks
                          </li>
                        </ul>
                      </div>
                    </div>
                  </ScrollArea>
                  <div className="border-t border-border p-3">
                    <div className="flex gap-2">
                      <Textarea
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="Ask AI for help..."
                        className="min-h-[80px] resize-none text-sm"
                        data-testid="input-ai-prompt"
                      />
                    </div>
                    <Button className="mt-2 w-full gap-2" size="sm" data-testid="button-send-ai">
                      <Play className="h-4 w-4" />
                      Send to AI
                    </Button>
                  </div>
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
