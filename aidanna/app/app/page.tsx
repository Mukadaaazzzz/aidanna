"use client";
import React, { useState, useRef, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Send, 
  BookOpen, 
  Users, 
  FileText, 
  Play, 
  Sparkles,
  LogOut,
  User,
  Upload,
  Loader2,
  Menu,
  Plus,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

type StoryMode = "narrative" | "dialogue" | "case-study" | "interactive";

const modeConfig = {
  narrative: {
    icon: BookOpen,
    label: "Narrative",
    color: "bg-purple-500",
    hoverColor: "hover:bg-purple-600",
    badge: "purple",
  },
  dialogue: {
    icon: Users,
    label: "Dialogue",
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-600",
    badge: "blue",
  },
  "case-study": {
    icon: FileText,
    label: "Case Study",
    color: "bg-green-500",
    hoverColor: "hover:bg-green-600",
    badge: "green",
  },
  interactive: {
    icon: Play,
    label: "Interactive",
    color: "bg-orange-500",
    hoverColor: "hover:bg-orange-600",
    badge: "orange",
  },
};

export default function AppPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<StoryMode>("narrative");
  const [user, setUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/signin");
      } else {
        setUser(user);
        setMessages([
          {
            role: "assistant",
            content: `Hey ${user.user_metadata?.name || "there"}! 👋 I'm Aidanna, your learning companion. What would you like to explore today?`,
          },
        ]);
      }
    };
    getUser();
  }, [supabase, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          mode: selectedMode,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Oops! Something went wrong. Let's try that again? 🤔",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedTopics = [
    { text: "Explain photosynthesis as an adventure", icon: "🌱" },
    { text: "Teach me about the French Revolution", icon: "🏰" },
    { text: "How does blockchain work?", icon: "⛓️" },
    { text: "What is quantum physics?", icon: "⚛️" },
  ];

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentMode = modeConfig[selectedMode];

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Modern Header */}
      <header className="border-b bg-card/50 backdrop-blur-xl supports-[backdrop-filter]:bg-card/80">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="Aidanna"
                  width={36}
                  height={36}
                  className="rounded-xl"
                />
                <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold">Aidanna</h1>
                <Badge variant="secondary" className="text-xs">
                  <Zap className="mr-1 h-3 w-3" />
                  {currentMode.label} Mode
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Plus className="mr-2 h-4 w-4" />
              New Chat
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm">
                      {user?.user_metadata?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.user_metadata?.name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="border-t px-4 py-3 sm:px-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {(Object.keys(modeConfig) as StoryMode[]).map((mode) => {
              const config = modeConfig[mode];
              const Icon = config.icon;
              const isActive = selectedMode === mode;
              return (
                <Button
                  key={mode}
                  onClick={() => setSelectedMode(mode)}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className={`whitespace-nowrap ${isActive ? `${config.color} ${config.hoverColor}` : ""}`}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {config.label}
                </Button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500">
                    <Sparkles className="h-4 w-4 text-white" />
                  </AvatarFallback>
                </Avatar>
              )}
              <Card
                className={`max-w-[85%] px-4 py-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </p>
              </Card>
              {message.role === "user" && (
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs">
                    {user?.user_metadata?.name?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500">
                  <Sparkles className="h-4 w-4 text-white" />
                </AvatarFallback>
              </Avatar>
              <Card className="bg-muted px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    Crafting your story...
                  </span>
                </div>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />

          {/* Suggested Topics */}
          {messages.length <= 1 && (
            <div className="pt-4">
              <p className="mb-4 text-sm font-medium text-muted-foreground">
                Try these topics to get started:
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {suggestedTopics.map((topic, index) => (
                  <Card
                    key={index}
                    onClick={() => setInput(topic.text)}
                    className="cursor-pointer p-4 transition-all hover:border-primary hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{topic.icon}</span>
                      <p className="text-sm leading-relaxed">{topic.text}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <div className="border-t bg-card/50 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl p-4">
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="shrink-0">
              <Upload className="h-4 w-4" />
            </Button>
            <div className="relative flex-1">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="What do you want to learn today?"
                className="min-h-[52px] max-h-32 resize-none pr-12"
                rows={1}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || loading}
                size="icon"
                className="absolute bottom-2 right-2 h-8 w-8"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Aidanna learns with you. Press{" "}
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
              Enter
            </kbd>{" "}
            to send ✨
          </p>
        </div>
      </div>
    </div>
  );
}