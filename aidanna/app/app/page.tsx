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
  Plus,
  Zap,
  Loader2,
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

const API_BASE = "https://aidanna-backend.onrender.com";

const DEFAULT_MODES: Record<
  StoryMode,
  { icon: any; label: string; color?: string; gradient: string }
> = {
  narrative: { 
    icon: BookOpen, 
    label: "Narrative", 
    color: "bg-purple-500",
    gradient: "from-purple-500 to-purple-600"
  },
  dialogue: { 
    icon: Users, 
    label: "Dialogue", 
    color: "bg-blue-500",
    gradient: "from-blue-500 to-cyan-600"
  },
  "case-study": { 
    icon: FileText, 
    label: "Case Study", 
    color: "bg-green-500",
    gradient: "from-green-500 to-emerald-600"
  },
  interactive: { 
    icon: Play, 
    label: "Interactive", 
    color: "bg-orange-500",
    gradient: "from-orange-500 to-red-500"
  },
};

export default function AppPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<StoryMode>("narrative");
  const [modes, setModes] = useState<Record<string, any> | null>(null);
  const [user, setUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const {
        data: { user: gotUser },
      } = await supabase.auth.getUser();
      if (!gotUser) {
        router.push("/signin");
        return;
      }
      setUser(gotUser);

      setMessages([
        {
          role: "assistant",
          content: `Hey ${gotUser.user_metadata?.name || "there"} 👋 — I'm Aidanna. Ready to learn through stories?`,
        },
      ]);

      try {
        const res = await fetch(`${API_BASE}/modes`);
        if (res.ok) {
          const json = await res.json();
          setModes(json);
        }
      } catch {
        setModes(null);
      }
    };
    init();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "typing..." },
    ]);

    try {
      const res = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMsg.content,
          mode: selectedMode,
        }),
      });

      const json = await res.json();
      const reply = json.response || json.message || "No reply received.";

      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", content: reply };
        return copy;
      });
    } catch (err) {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "⚠️ Something went wrong. Try again.",
        };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur-xl shadow-sm">
        
          <div className="flex items-center gap-3">
            <div className="relative">
              
            <div>
              
              <Badge 
                variant="secondary" 
                className="text-xs font-medium bg-white/80 backdrop-blur border-gray-200"
              >
                <div className={`w-2 h-2 rounded-full ${DEFAULT_MODES[selectedMode].color} mr-1`}></div>
                {DEFAULT_MODES[selectedMode].label} Mode
              </Badge>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="rounded-full h-10 w-10 p-0 border border-gray-200 bg-white/50 backdrop-blur"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-medium">
                    {user?.user_metadata?.name?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 backdrop-blur-xl bg-white/95 border-gray-200">
              <DropdownMenuLabel className="text-gray-900">
                {user?.user_metadata?.name || "User"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="text-red-600 focus:text-red-600 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-3 overflow-x-auto px-6 pb-4">
          {Object.keys(DEFAULT_MODES).map((m) => {
            const cfg = DEFAULT_MODES[m as StoryMode];
            const Icon = cfg.icon;
            const active = selectedMode === m;
            return (
              <Button
                key={m}
                onClick={() => setSelectedMode(m as StoryMode)}
                size="sm"
                variant={active ? "default" : "outline"}
                className={`
                  rounded-full px-4 py-2 font-medium transition-all duration-200
                  ${active 
                    ? `bg-gradient-to-r ${cfg.gradient} text-white shadow-lg shadow-${cfg.color}/25 border-transparent` 
                    : "bg-white/60 backdrop-blur border-gray-200 text-gray-700 hover:bg-white hover:shadow-md"
                  }
                `}
              >
                <Icon className="mr-2 h-4 w-4" /> 
                {cfg.label}
              </Button>
            );
          })}
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-3 ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role === "assistant" && (
                <div className="flex-shrink-0">
                  <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 shadow-inner">
                      <Sparkles className="h-4 w-4 text-white" />
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
              
              <div className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"} max-w-[85%]`}>
                <Card
                  className={`
                    px-5 py-4 rounded-3xl shadow-sm transition-all duration-200
                    ${m.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/25"
                      : "bg-white/80 backdrop-blur border border-gray-100 shadow-gray-100"
                    }
                  `}
                >
                  <p className="whitespace-pre-wrap text-[15px] leading-relaxed font-medium">
                    {m.content}
                  </p>
                </Card>
                {m.role === "user" && (
                  <div className="mt-2 flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-bold">
                        {user?.user_metadata?.name?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-500 font-medium">
                      {user?.user_metadata?.name || "You"}
                    </span>
                  </div>
                )}
              </div>

              {m.role === "user" && (
                <div className="flex-shrink-0">
                  <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-medium">
                      {user?.user_metadata?.name?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 text-gray-600 text-sm items-center pl-12">
              <div className="flex gap-1">
                <div className="h-2 w-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="h-2 w-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="h-2 w-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="font-medium">Crafting your story...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="sticky bottom-0 bg-gradient-to-t from-white via-white to-white/80 backdrop-blur-2xl border-t border-gray-100 px-4 py-4">
        <div className="max-w-4xl mx-auto flex gap-3 items-end">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your question or story idea..."
              className="min-h-[56px] max-h-32 flex-1 resize-none rounded-2xl bg-white/80 backdrop-blur border-2 border-gray-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 px-4 py-3 text-[15px] font-medium shadow-sm transition-all duration-200"
              style={{ 
                color: 'rgb(30, 41, 59)',
                fontSize: '15px',
                fontWeight: '500',
                lineHeight: '1.5'
              }}
            />
            <div className="absolute bottom-2 right-3 text-xs text-gray-400 font-medium">
              {input.length}/500
            </div>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || loading}
            size="icon"
            className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25 transition-all duration-200 disabled:opacity-50 disabled:shadow-none"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5 text-white" />
            ) : (
              <Send className="h-5 w-5 text-white" />
            )}
          </Button>
        </div>
        <div className="max-w-4xl mx-auto mt-3 text-center">
          <p className="text-xs text-gray-500 font-medium">
            Press <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-200 text-gray-600">Enter</kbd> to send • <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-200 text-gray-600">Shift + Enter</kbd> for new line
          </p>
        </div>
      </footer>
    </div>
  );
}