import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Copy,
  Check,
  Bot,
  User,
  Sparkles,
  ChevronDown,
  Plus,
  Loader2,
  Trash2,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const aiModels = [
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", provider: "Google", isFree: true, color: "bg-blue-500" },
  { id: "claude-sonnet-4-20250514", name: "Claude Sonnet 4", provider: "Anthropic", isFree: true, color: "bg-purple-500" },
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", isFree: false, cost: "$0.002/req", color: "bg-green-500" },
  { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B", provider: "Groq", isFree: true, color: "bg-orange-500" },
];

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  title: string;
  model: string;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
}

export default function Chat() {
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(aiModels[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversations = [], isLoading: conversationsLoading } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
  });

  const { data: currentConversation, refetch: refetchConversation } = useQuery<Conversation>({
    queryKey: ["/api/conversations", currentConversationId],
    enabled: !!currentConversationId,
  });

  useEffect(() => {
    if (currentConversation?.messages) {
      setMessages(currentConversation.messages);
    }
  }, [currentConversation]);

  const createConversationMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/conversations", { title: "New Chat", model: selectedModel.id });
      return res.json() as Promise<Conversation>;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      setCurrentConversationId(data.id);
      setMessages([]);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create conversation",
        variant: "destructive",
      });
    },
  });

  const deleteConversationMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/conversations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      if (currentConversationId) {
        setCurrentConversationId(null);
        setMessages([]);
      }
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ conversationId, message, modelId }: { conversationId: string; message: string; modelId: string }) => {
      const res = await apiRequest("POST", "/api/chat", { conversationId, message, modelId });
      return res.json();
    },
    onSuccess: (data: any) => {
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
      if (data.switchedProvider) {
        toast({
          title: "Provider Switched",
          description: `Quota exhausted. Switched to ${data.switchedProvider}`,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewChat = async () => {
    createConversationMutation.mutate();
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    let conversationId: string = currentConversationId || "";

    if (!conversationId) {
      const newConv = await createConversationMutation.mutateAsync();
      conversationId = newConv.id;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      await sendMessageMutation.mutateAsync({
        conversationId,
        message: input.trim(),
        modelId: selectedModel.id,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith("```")) {
        const match = part.match(/```(\w+)?\n?([\s\S]*?)```/);
        if (match) {
          const language = match[1] || "code";
          const code = match[2].trim();
          return (
            <div key={index} className="group relative my-4">
              <div className="flex items-center justify-between rounded-t-lg bg-muted px-4 py-2">
                <Badge variant="outline" className="text-xs">{language}</Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => copyToClipboard(code, `code-${index}`)}
                  data-testid={`button-copy-code-${index}`}
                >
                  {copiedId === `code-${index}` ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
              <pre className="overflow-x-auto rounded-b-lg bg-card p-4 font-mono text-sm">
                <code>{code}</code>
              </pre>
            </div>
          );
        }
      }
      
      return (
        <div key={index} className="whitespace-pre-wrap">
          {part.split("\n").map((line, lineIndex) => {
            if (line.startsWith("## ")) {
              return (
                <h2 key={lineIndex} className="mt-4 mb-2 text-lg font-semibold">
                  {line.replace("## ", "")}
                </h2>
              );
            }
            if (line.startsWith("# ")) {
              return (
                <h1 key={lineIndex} className="mt-4 mb-2 text-xl font-bold">
                  {line.replace("# ", "")}
                </h1>
              );
            }
            return <span key={lineIndex}>{line}{lineIndex < part.split("\n").length - 1 ? "\n" : ""}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="flex h-full">
      {/* Conversations Sidebar */}
      <div className="hidden w-64 flex-col border-r border-border bg-card/30 md:flex">
        <div className="p-3">
          <Button
            onClick={handleNewChat}
            variant="outline"
            className="w-full justify-start gap-2"
            disabled={createConversationMutation.isPending}
            data-testid="button-new-chat"
          >
            <Plus className="h-4 w-4" />
            {t("chat.newChat")}
          </Button>
        </div>
        
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1 py-2">
            {conversationsLoading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : conversations.length === 0 ? (
              <p className="p-4 text-center text-sm text-muted-foreground">
                No conversations yet
              </p>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover-elevate cursor-pointer ${
                    currentConversationId === conv.id ? "bg-accent" : ""
                  }`}
                  onClick={() => handleSelectConversation(conv.id)}
                  data-testid={`conversation-${conv.id}`}
                >
                  <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="flex-1 truncate">{conv.title}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="invisible h-6 w-6 group-hover:visible"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversationMutation.mutate(conv.id);
                    }}
                    data-testid={`button-delete-${conv.id}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-3 md:hidden">
            <Button variant="ghost" size="sm" className="gap-2" onClick={handleNewChat}>
              <Plus className="h-4 w-4" />
              {t("chat.newChat")}
            </Button>
          </div>

          {/* Model Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 ml-auto" data-testid="button-model-selector">
                <div className={`h-2 w-2 rounded-full ${selectedModel.color}`} />
                {selectedModel.name}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {aiModels.map((model) => (
                <DropdownMenuItem
                  key={model.id}
                  onClick={() => setSelectedModel(model)}
                  className="flex items-center justify-between gap-4"
                  data-testid={`model-option-${model.id}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${model.color}`} />
                    <span>{model.name}</span>
                  </div>
                  {model.isFree ? (
                    <Badge variant="secondary" className="text-xs">Free</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">{model.cost}</Badge>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-blue-500">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{t("chat.welcomeTitle")}</h3>
                <p className="max-w-md text-muted-foreground">
                  {t("chat.welcomeMessage")}
                </p>
              </div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex gap-3 ${message.role === "user" ? (isRTL ? "flex-row" : "flex-row-reverse") : ""}`}
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    message.role === "user" ? "bg-primary" : "bg-gradient-to-br from-primary/80 to-blue-500"
                  }`}>
                    {message.role === "user" ? (
                      <User className="h-4 w-4 text-primary-foreground" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>

                  <div className={`flex-1 ${message.role === "user" ? (isRTL ? "text-left" : "text-right") : ""}`}>
                    {message.role === "assistant" && message.model && (
                      <div className="mb-1 flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          <Sparkles className="mr-1 h-3 w-3" />
                          {aiModels.find(m => m.id === message.model)?.name || message.model}
                        </Badge>
                      </div>
                    )}
                    <Card className={`inline-block max-w-full p-4 ${
                      message.role === "user" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-card/80 backdrop-blur-sm"
                    }`}>
                      <div className={message.role === "user" ? "" : "prose prose-sm dark:prose-invert max-w-none"}>
                        {message.role === "user" ? message.content : renderContent(message.content)}
                      </div>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-blue-500">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <Card className="inline-flex items-center gap-2 bg-card/80 p-4 backdrop-blur-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">{t("chat.thinking")}</span>
                </Card>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-border bg-background/80 p-4 backdrop-blur-md">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-end gap-2">
              <div className="relative flex-1">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t("chat.placeholder")}
                  className="min-h-[52px] max-h-[200px] resize-none pr-12"
                  rows={1}
                  data-testid="input-chat-message"
                />
              </div>
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="h-[52px] w-[52px]"
                data-testid="button-send-message"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className={`h-5 w-5 ${isRTL ? "rotate-180" : ""}`} />
                )}
              </Button>
            </div>
            
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {selectedModel.isFree ? (
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                    Using free tier
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-yellow-500" />
                    Cost: {selectedModel.cost}
                  </span>
                )}
              </span>
              <span>Press Enter to send, Shift+Enter for new line</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
