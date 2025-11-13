"use client";
import React, { useState, useRef, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Container,
  Paper,
  Textarea,
  Button,
  Avatar,
  Group,
  Stack,
  Text,
  Card,
  ActionIcon,
  Menu,
  rem,
  Box,
  SimpleGrid,
  Divider,
  Loader,
  ScrollArea,
  Drawer,
  Burger,
  Tooltip,
  Badge,
} from "@mantine/core";
import { useMediaQuery, useDisclosure } from "@mantine/hooks";
import {
  IconBook,
  IconUsers,
  IconLogout,
  IconSettings,
  IconLoader2,
  IconFlask,
  IconBriefcase,
  IconCpu,
  IconPlus,
  IconMessage,
  IconTrash,
  IconCrown,
  IconSparkles,
  IconPaperclip,
  IconCopy,
  IconFileText,
  IconX,
} from "@tabler/icons-react";

type Message = {
  role: "user" | "assistant";
  content: string;
  messageId: string;
};

type Conversation = {
  id: string;
  title: string;
  mode: string;
  created_at: string;
};

type StoryMode = "narrative" | "dialogue";

type UserProfile = {
  subscription_tier: "free" | "pro";
  subscription_status?: string;
};

// Get Supabase URL from environment or use your project URL
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://sblbfcrqdkussamkkhrk.supabase.co";
const API_BASE = `${SUPABASE_URL}/functions/v1`;

const DEFAULT_MODES: Record<
  StoryMode,
  { icon: any; label: string; color: string }
> = {
  narrative: { icon: IconBook, label: "Narrative", color: "grape" },
  dialogue: { icon: IconUsers, label: "Dialogue", color: "cyan" },
};

const LEARNING_PROMPTS = [
  { icon: IconFlask, text: "Explain photosynthesis through a story", category: "Science" },
  { icon: IconBriefcase, text: "Teach me about supply and demand", category: "Business" },
  { icon: IconCpu, text: "How does machine learning work?", category: "Technology" },
];

const sanitizeText = (s: string) => s.replace(/\*/g, "");

export default function AppPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<StoryMode>("narrative");
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    subscription_tier: "free",
  });
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [conversationId, setConversationId] = useState<string>("new");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [usage, setUsage] = useState({ used: 0, remaining: 10, total: 10 });
  const [usageLoaded, setUsageLoaded] = useState(false);
  const [drawerOpened, { open: openDrawer, close: closeDrawer, toggle: toggleDrawer }] =
    useDisclosure(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("english");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const HEADER_HEIGHT = 60;
  const COMPOSER_HEIGHT = 110;
  const SIDEBAR_WIDTH = 260;

  const LANGUAGES = [
    { value: "english", label: "English", flag: "🇬🇧" },
    { value: "hausa", label: "Hausa", flag: "🇳🇬" },
    { value: "igbo", label: "Igbo", flag: "🇳🇬" },
    { value: "yoruba", label: "Yoruba", flag: "🇳🇬" },
  ];

  const isPro = userProfile.subscription_tier === "pro";

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const {
        data: { user: gotUser },
      } = await supabase.auth.getUser();
      if (!isMounted) return;

      if (!gotUser) {
        router.push("/signin");
        return;
      }
      setUser(gotUser);

      // Load user profile with subscription tier
      await loadUserProfile(gotUser.id);

      setIsLoadingUser(false);

      // Load conversations and usage
      await Promise.all([
        loadConversations(gotUser.id),
        loadCurrentUsage(gotUser.id),
      ]);

      // Restore last conversation from localStorage
      const lastConvId = localStorage.getItem("lastConversationId");
      if (lastConvId && lastConvId !== "new") {
        loadConversationMessages(lastConvId, false);
      }
    };

    init();
    return () => {
      isMounted = false;
    };
  }, [router, supabase.auth]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [isMobile]);

  // Save current conversation to localStorage
  useEffect(() => {
    if (conversationId) {
      localStorage.setItem("lastConversationId", conversationId);
    }
  }, [conversationId]);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("subscription_tier, subscription_status")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Failed to load profile:", error);
        return;
      }

      if (data) {
        setUserProfile({
          subscription_tier: data.subscription_tier || "free",
          subscription_status: data.subscription_status,
        });
      }
    } catch (err) {
      console.error("Failed to load user profile:", err);
    }
  };

  const loadCurrentUsage = async (userId: string) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("user_usage")
        .select("*")
        .eq("user_id", userId)
        .eq("date", today)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Failed to load usage:", error);
        return;
      }

      if (data) {
        setUsage({
          used: data.request_count,
          remaining: 10 - data.request_count,
          total: 10,
        });
      }
      setUsageLoaded(true);
    } catch (err) {
      console.error("Failed to load usage:", err);
      setUsageLoaded(true);
    }
  };

  const loadConversations = async (userId: string) => {
    setLoadingConversations(true);
    try {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setConversations(data || []);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setLoadingConversations(false);
    }
  };

  const loadConversationMessages = async (
    convId: string,
    closeDrawerAfter = true
  ) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", convId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const formattedMessages: Message[] = (data || []).map((msg: any) => ({
        role: msg.role,
        content: msg.content,
        messageId: msg.id,
      }));

      setMessages(formattedMessages);
      setConversationId(convId);
      setAttachedFiles([]);

      const conv = conversations.find((c) => c.id === convId);
      if (conv) setSelectedMode(conv.mode as StoryMode);

      if (isMobile && closeDrawerAfter) closeDrawer();
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setConversationId("new");
    setAttachedFiles([]);
    localStorage.setItem("lastConversationId", "new");
    if (isMobile) closeDrawer();
  };

  const handleDeleteConversation = async (convId: string) => {
    if (!confirm("Delete this conversation?")) return;

    try {
      const { error } = await supabase
        .from("conversations")
        .delete()
        .eq("id", convId);

      if (error) throw error;

      setConversations((prev) => prev.filter((c) => c.id !== convId));
      if (conversationId === convId) {
        handleNewChat();
      }
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(sanitizeText(text));
      // You could integrate Mantine notifications here if desired
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading || !user) return;

    const userMsg: Message = {
      role: "user",
      content: input.trim(),
      messageId: Date.now().toString() + "-user",
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Get auth session for Supabase function calls
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No active session. Please sign in again.");
      }

      let filesPayload: any[] = [];

      if (isPro && attachedFiles.length > 0) {
        const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
        const allowedExt = ["pdf", "txt", "doc", "docx"];

        for (const file of attachedFiles) {
          const ext = file.name.split(".").pop()?.toLowerCase();
          if (!ext || !allowedExt.includes(ext)) {
            alert(
              `File "${file.name}" is not supported. Allowed: PDF, TXT, DOC, DOCX.`
            );
            setLoading(false);
            return;
          }
          if (file.size > MAX_FILE_SIZE_BYTES) {
            alert(
              `File "${file.name}" is larger than 10MB. Please upload a smaller file.`
            );
            setLoading(false);
            return;
          }
        }

        filesPayload = await Promise.all(
          attachedFiles.map(async (file) => ({
            name: file.name,
            type: file.type,
            size: file.size,
            text: await file.text(),
          }))
        );
      }

      const res = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          prompt: userMsg.content,
          mode: selectedMode,
          userId: user.id,
          conversationId: conversationId,
          language: selectedLanguage,
          files: isPro ? filesPayload : [],
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          // Daily limit reached - show upgrade message
          const upgradeMessage = json.upgrade_required
            ? `⚠️ ${json.error}\n\n[Upgrade to Premium] for unlimited requests and priority access!`
            : `⚠️ ${json.error}`;

          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: upgradeMessage,
              messageId: Date.now().toString() + "-limit",
            },
          ]);
          if (json.usage) {
            setUsage({
              used: json.usage.requests_used,
              remaining: json.usage.requests_remaining,
              total: json.usage.daily_limit,
            });
          }
          setLoading(false);
          return;
        }

        if (res.status === 503) {
          // Rate limit / server busy
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `⚠️ ${json.error}\n\nPlease wait a moment and try again.`,
              messageId: Date.now().toString() + "-busy",
            },
          ]);
          setLoading(false);
          return;
        }

        throw new Error(json.error || "Request failed");
      }

      if (conversationId === "new" && json.conversation_id) {
        setConversationId(json.conversation_id);
        localStorage.setItem("lastConversationId", json.conversation_id);
        loadConversations(user.id);
      }

      if (json.usage) {
        // Handle paid users (unlimited)
        if (json.usage.requests_remaining === -1) {
          setUsage({
            used: 0,
            remaining: -1,
            total: -1,
          });
        } else {
          setUsage({
            used: json.usage.requests_used,
            remaining: json.usage.requests_remaining,
            total: json.usage.daily_limit,
          });
        }
      }

      const assistantMsg: Message = {
        role: "assistant",
        content: json.response || "No reply received.",
        messageId: Date.now().toString() + "-assistant",
      };

      setMessages((prev) => [...prev, assistantMsg]);
      // Clear attachments after a successful send
      setAttachedFiles([]);
    } catch (err: any) {
      console.error("API Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ ${err.message || "Something went wrong. Please try again."}`,
          messageId: Date.now().toString() + "-error",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSignOut = async () => {
    localStorage.removeItem("lastConversationId");
    await supabase.auth.signOut();
    router.push("/");
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  const goHome = () => router.push("/");
  const goUpgrade = () => router.push("/upgrade");

  const onBrandKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goHome();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
    const allowedExt = ["pdf", "txt", "doc", "docx"];
    const files = Array.from(event.target.files);
    const valid: File[] = [];

    for (const file of files) {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!ext || !allowedExt.includes(ext)) {
        alert(
          `File "${file.name}" is not supported. Allowed: PDF, TXT, DOC, DOCX.`
        );
        continue;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        alert(
          `File "${file.name}" is larger than 10MB. Please upload a smaller file.`
        );
        continue;
      }
      valid.push(file);
    }

    if (valid.length > 0) {
      setAttachedFiles((prev) => [...prev, ...valid]);
    }

    // Reset input so the same file can be selected again later if needed
    event.target.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const inputPlaceholder = isPro
    ? "Ask anything, or attach files (PDF/TXT/DOC) for deeper analysis..."
    : "Ask a question or request a story. Upgrade to Pro to attach files.";

  if (isLoadingUser) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #faf5ff 0%, #fff 100%)",
        }}
      >
        <Stack align="center" gap="md">
          <Loader size="lg" color="grape" />
          <Text size="sm" c="dimmed">
            Loading Aidanna...
          </Text>
        </Stack>
      </div>
    );
  }

  const SidebarContent = () => (
    <>
      <Box p="sm">
        <Button
          fullWidth
          leftSection={<IconPlus size={16} />}
          variant="gradient"
          gradient={{ from: "grape", to: "violet", deg: 45 }}
          onClick={handleNewChat}
          size="sm"
          aria-label="Start a new chat"
        >
          New Chat
        </Button>

        {/* Language Selector */}
        <Box mt="sm">
          <Text size="xs" c="dimmed" mb={4}>
            Language
          </Text>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "0.5rem",
              border: "1px solid #e5e7eb",
              fontSize: "0.875rem",
              cursor: "pointer",
              background: "#fff",
            }}
            aria-label="Choose language"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.flag} {lang.label}
              </option>
            ))}
          </select>
        </Box>
      </Box>

      <Divider />

      <ScrollArea style={{ flex: 1 }} p="xs">
        {loadingConversations ? (
          <Group justify="center" p="md">
            <Loader size="sm" />
          </Group>
        ) : conversations.length === 0 ? (
          <Text size="xs" c="dimmed" ta="center" p="md">
            No conversations yet
          </Text>
        ) : (
          <Stack gap={4}>
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => loadConversationMessages(conv.id)}
                style={{
                  padding: "8px 10px",
                  borderRadius: 6,
                  background:
                    conversationId === conv.id ? "#f3e8ff" : "transparent",
                  border:
                    conversationId === conv.id
                      ? "1px solid #9333ea"
                      : "1px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                className="conv-item"
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && loadConversationMessages(conv.id)
                }
              >
                <Group justify="space-between" wrap="nowrap">
                  <Group gap="xs" style={{ flex: 1, minWidth: 0 }}>
                    <IconMessage
                      size={14}
                      color="#868e96"
                      style={{ flexShrink: 0 }}
                    />
                    <Text size="xs" truncate style={{ flex: 1 }}>
                      {conv.title}
                    </Text>
                  </Group>
                  <Tooltip label="Delete conversation" withArrow>
                    <ActionIcon
                      size="xs"
                      variant="subtle"
                      color="red"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConversation(conv.id);
                      }}
                      aria-label="Delete conversation"
                    >
                      <IconTrash size={12} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </div>
            ))}
          </Stack>
        )}
      </ScrollArea>

      <Divider />

      <Box p="sm">
        <Group gap="xs" wrap="nowrap">
          <Avatar size="sm" radius="md" color="grape">
            {user?.user_metadata?.name?.[0]?.toUpperCase() || "U"}
          </Avatar>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Group gap={4} wrap="nowrap">
              <Text
                size="xs"
                fw={500}
                truncate
                title={user?.user_metadata?.name || user?.email}
              >
                {user?.user_metadata?.name || user?.email}
              </Text>
              {isPro && (
                <Badge
                  size="xs"
                  variant="gradient"
                  gradient={{ from: "yellow", to: "orange", deg: 45 }}
                  leftSection={<IconCrown size={10} />}
                  style={{ paddingLeft: 4 }}
                >
                  PRO
                </Badge>
              )}
            </Group>
            {usageLoaded && (
              <Text size="xs" c="dimmed">
                {isPro ? (
                  <Group gap={4}>
                    <IconSparkles size={12} />
                    <span>Unlimited</span>
                  </Group>
                ) : (
                  `${usage.remaining}/${usage.total} left today`
                )}
              </Text>
            )}
          </div>

          {/* SETTINGS MENU (Sidebar) */}
          <Menu shadow="md" width={180}>
            <Menu.Target>
              <ActionIcon variant="subtle" size="sm" aria-label="Settings">
                <IconSettings size={14} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              {!isPro && (
                <Menu.Item
                  leftSection={<IconCrown style={{ width: rem(12) }} />}
                  onClick={goUpgrade}
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#ca8a04",
                  }}
                >
                  Upgrade to Pro
                </Menu.Item>
              )}
              <Menu.Item
                color="red"
                leftSection={<IconLogout style={{ width: rem(12) }} />}
                onClick={handleSignOut}
                style={{ fontSize: 13 }}
              >
                Sign out
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Box>
    </>
  );

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar - Desktop Only */}
      {!isMobile && sidebarOpen && (
        <Paper
          style={{
            width: SIDEBAR_WIDTH,
            height: "100vh",
            borderRight: "1px solid #e9ecef",
            display: "flex",
            flexDirection: "column",
            background: "#fafafa",
          }}
        >
          <SidebarContent />
        </Paper>
      )}

      {/* Mobile Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size={280}
        padding="md"
        title={
          <Group
            gap="xs"
            onClick={() => {
              closeDrawer();
              goHome();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                closeDrawer();
                goHome();
              }
            }}
            style={{ cursor: "pointer" }}
            role="button"
            tabIndex={0}
            aria-label="Go to home"
          >
            <Image
              src="/logo.png"
              alt="Aidanna"
              width={24}
              height={24}
              style={{ borderRadius: 6 }}
            />
            <Text fw={700}>Aidanna</Text>
          </Group>
        }
        styles={{
          content: { display: "flex", flexDirection: "column" },
          body: { flex: 1, display: "flex", flexDirection: "column", padding: 0 },
        }}
      >
        <SidebarContent />
      </Drawer>

      {/* Main Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        {/* Header */}
        <Paper
          shadow="xs"
          p="sm"
          style={{
            borderBottom: "1px solid #e9ecef",
            background: "#fff",
            height: HEADER_HEIGHT,
          }}
        >
          <Container size="lg" h="100%">
            <Group
              justify="space-between"
              align="center"
              h="100%"
              wrap="nowrap"
            >
              <Group gap="sm" wrap="nowrap">
                {isMobile && (
                  <Burger
                    opened={drawerOpened}
                    onClick={toggleDrawer}
                    size="sm"
                    aria-label={drawerOpened ? "Close menu" : "Open menu"}
                  />
                )}

                <Image
                  src="/logo.png"
                  alt="Aidanna"
                  width={28}
                  height={28}
                  onClick={goHome}
                  onKeyDown={onBrandKeyDown}
                  style={{ borderRadius: 6, cursor: "pointer" }}
                  aria-label="Go to home"
                />
                <Group gap={8}>
                  <Text
                    fw={700}
                    size="lg"
                    onClick={goHome}
                    onKeyDown={onBrandKeyDown}
                    role="button"
                    tabIndex={0}
                    title="Go to Home"
                    style={{ cursor: "pointer" }}
                  >
                    Aidanna
                  </Text>
                  {isPro && (
                    <Badge
                      size="sm"
                      variant="gradient"
                      gradient={{ from: "yellow", to: "orange", deg: 45 }}
                      leftSection={<IconCrown size={12} />}
                    >
                      PRO
                    </Badge>
                  )}
                </Group>
              </Group>

              {/* Avatar Menu */}
              <Menu shadow="md" width={220}>
                <Menu.Target>
                  <ActionIcon
                    variant="subtle"
                    size="lg"
                    aria-label="Account menu"
                  >
                    <Avatar size="sm" radius="md" color="grape">
                      {user?.user_metadata?.name?.[0]?.toUpperCase() || "U"}
                    </Avatar>
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label style={{ fontSize: 12 }}>
                    <Group gap={6}>
                      <span>
                        {user?.user_metadata?.name || user?.email}
                      </span>
                      {isPro && (
                        <Badge
                          size="xs"
                          variant="gradient"
                          gradient={{ from: "yellow", to: "orange", deg: 45 }}
                          leftSection={<IconCrown size={10} />}
                        >
                          PRO
                        </Badge>
                      )}
                    </Group>
                  </Menu.Label>
                  {usageLoaded && (
                    <Menu.Label style={{ fontSize: 11 }} c="dimmed">
                      {isPro ? (
                        <Group gap={4}>
                          <IconSparkles size={12} />
                          <span>Unlimited requests</span>
                        </Group>
                      ) : (
                        `${usage.remaining}/${usage.total} requests left`
                      )}
                    </Menu.Label>
                  )}
                  <Menu.Divider />
                  <Menu.Label style={{ fontSize: 11 }}>Language</Menu.Label>
                  {LANGUAGES.map((lang) => (
                    <Menu.Item
                      key={lang.value}
                      onClick={() => setSelectedLanguage(lang.value)}
                      style={{
                        fontSize: 12,
                        background:
                          selectedLanguage === lang.value
                            ? "#f3e8ff"
                            : "transparent",
                      }}
                    >
                      {lang.flag} {lang.label}
                    </Menu.Item>
                  ))}
                  <Menu.Divider />

                  {!isPro && (
                    <Menu.Item
                      leftSection={<IconCrown style={{ width: rem(14) }} />}
                      onClick={goUpgrade}
                      style={{ color: "#ca8a04", fontWeight: 600 }}
                    >
                      Upgrade to Pro
                    </Menu.Item>
                  )}

                  <Menu.Item
                    color="red"
                    leftSection={<IconLogout style={{ width: rem(14) }} />}
                    onClick={handleSignOut}
                  >
                    Sign out
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Container>
        </Paper>

        {/* Messages Area */}
        <div style={{ flex: 1, overflowY: "auto", background: "#fafafa" }}>
          <Container size="md" py={isMobile ? "xs" : "sm"}>
            {messages.length === 0 ? (
              <Stack
                align="center"
                gap={isMobile ? "sm" : "md"}
                mt={isMobile ? 8 : 16}
              >
                <Text size={isMobile ? "sm" : "md"} c="dimmed">
                  Hi {user?.user_metadata?.name?.split(" ")[0] || "there"}
                  {isPro && " ✨"}
                </Text>
                <Text size={isMobile ? "xl" : "2xl"} fw={700} ta="center">
                  What will you learn today?
                </Text>

                <Group gap="xs" justify="center">
                  {Object.entries(DEFAULT_MODES).map(([key, mode]) => {
                    const Icon = mode.icon;
                    const isActive = selectedMode === key;
                    return (
                      <Button
                        key={key}
                        size="xs"
                        variant={isActive ? "filled" : "light"}
                        color={mode.color}
                        leftSection={<Icon size={14} />}
                        onClick={() => setSelectedMode(key as StoryMode)}
                        radius="xl"
                        aria-pressed={isActive}
                        aria-label={`Select ${mode.label} mode`}
                      >
                        {mode.label}
                      </Button>
                    );
                  })}
                </Group>

                <Divider w="100%" my={isMobile ? "xs" : "sm"} />

                <Stack gap={isMobile ? "xs" : "sm"} w="100%">
                  <Text size="xs" c="dimmed" ta="center">
                    Try one of these:
                  </Text>
                  <SimpleGrid
                    cols={{ base: 1, sm: 3 }}
                    spacing={isMobile ? "xs" : "sm"}
                  >
                    {LEARNING_PROMPTS.map((prompt, idx) => (
                      <Card
                        key={idx}
                        shadow="xs"
                        padding={isMobile ? "sm" : "md"}
                        radius="md"
                        withBorder
                        style={{ cursor: "pointer" }}
                        onClick={() => handlePromptClick(prompt.text)}
                        className="hover-card"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handlePromptClick(prompt.text)
                        }
                        aria-label={`Use prompt: ${prompt.text}`}
                        title={prompt.text}
                      >
                        <Stack gap="xs">
                          <prompt.icon size={18} color="#868e96" />
                          <Text
                            size="xs"
                            c="dimmed"
                            style={{ lineHeight: 1.4 }}
                          >
                            {prompt.text}
                          </Text>
                        </Stack>
                      </Card>
                    ))}
                  </SimpleGrid>
                </Stack>
              </Stack>
            ) : (
              <Stack gap="md" mt="xs">
                {messages.map((m) => {
                  const isUser = m.role === "user";
                  return (
                    <Group
                      key={m.messageId}
                      align="flex-start"
                      gap="sm"
                      wrap="nowrap"
                      justify={isUser ? "flex-end" : "flex-start"}
                    >
                      {!isUser && (
                        <Avatar size="sm" radius="md">
                          <Image
                            src="/logo.png"
                            alt="Aidanna"
                            width={22}
                            height={22}
                            style={{ borderRadius: 6 }}
                          />
                        </Avatar>
                      )}

                      <Paper
                        shadow="xs"
                        p={isMobile ? "xs" : "sm"}
                        radius="lg"
                        withBorder
                        style={{
                          maxWidth: isMobile ? "80%" : "75%",
                          background: isUser
                            ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                            : "#ffffff",
                          color: isUser ? "#ffffff" : "inherit",
                          borderColor: isUser ? "transparent" : "#e9ecef",
                          position: "relative",
                        }}
                      >
                        {/* Copy button for assistant messages */}
                        {m.role === "assistant" && (
                          <ActionIcon
                            size="xs"
                            variant="subtle"
                            style={{
                              position: "absolute",
                              top: 6,
                              right: 6,
                            }}
                            aria-label="Copy message"
                            onClick={() => handleCopy(m.content)}
                          >
                            <IconCopy size={14} />
                          </ActionIcon>
                        )}

                        <Text
                          size="sm"
                          style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}
                        >
                          {sanitizeText(m.content)
                            .split(/(\[.+?\]\(.+?\)\))/g)
                            .map((part, i) => {
                              // Handle markdown links like [Upgrade to Premium](/upgrade)
                              const linkMatch =
                                part.match(/^\[(.+?)\]\((.+?)\)$/);
                              if (linkMatch) {
                                return (
                                  <a
                                    key={i}
                                    href={linkMatch[2]}
                                    style={{
                                      color: isUser ? "#fff" : "#9333ea",
                                      textDecoration: "underline",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {linkMatch[1]}
                                  </a>
                                );
                              }
                              return <span key={i}>{part}</span>;
                            })}
                        </Text>
                      </Paper>

                      {isUser && (
                        <Avatar size="sm" radius="md" color="grape">
                          {user?.user_metadata?.name?.[0]?.toUpperCase() || "U"}
                        </Avatar>
                      )}
                    </Group>
                  );
                })}

                {loading && (
                  <Group align="flex-start" gap="sm">
                    <Avatar size="sm" radius="md">
                      <Image
                        src="/logo.png"
                        alt="Aidanna"
                        width={22}
                        height={22}
                        style={{ borderRadius: 6 }}
                      />
                    </Avatar>
                    <Paper shadow="xs" p="sm" radius="lg" withBorder>
                      <Group gap="xs">
                        <IconLoader2 size={14} className="animate-spin" />
                        <Text size="xs" c="dimmed">
                          Thinking...
                        </Text>
                      </Group>
                    </Paper>
                  </Group>
                )}
                <div ref={messagesEndRef} />
              </Stack>
            )}
          </Container>
        </div>

        {/* Composer */}
        <Paper
          shadow="lg"
          p="sm"
          style={{
            borderTop: "1px solid #e9ecef",
            background: "#fff",
            height: COMPOSER_HEIGHT,
          }}
        >
          <Container size="md" h="100%">
            {/* Attached files (Pro only) */}
            {isPro && attachedFiles.length > 0 && (
              <Group gap="xs" mb="xs" align="center" wrap="wrap">
                {attachedFiles.map((file, index) => (
                  <Badge
                    key={`${file.name}-${index}`}
                    variant="outline"
                    radius="xl"
                    rightSection={
                      <ActionIcon
                        size="xs"
                        variant="subtle"
                        onClick={() => handleRemoveFile(index)}
                        aria-label={`Remove ${file.name}`}
                      >
                        <IconX size={10} />
                      </ActionIcon>
                    }
                    leftSection={<IconFileText size={12} />}
                  >
                    <Text size="xs" truncate maw={160}>
                      {file.name}
                    </Text>
                  </Badge>
                ))}
              </Group>
            )}

            <Group align="flex-end" gap="xs" wrap="nowrap">
              {/* Paperclip / File upload (Pro only) */}
              <Tooltip
                label={
                  isPro
                    ? "Attach files (PDF, TXT, DOC, DOCX, up to 10MB each)"
                    : "Attach files with Aidanna Pro"
                }
                withArrow
              >
                <ActionIcon
                  variant="subtle"
                  radius="xl"
                  size="lg"
                  onClick={() =>
                    isPro ? fileInputRef.current?.click() : goUpgrade()
                  }
                  aria-label="Attach files"
                  disabled={loading}
                >
                  <IconPaperclip size={18} />
                </ActionIcon>
              </Tooltip>

              <input
                type="file"
                multiple
                ref={fileInputRef}
                style={{ display: "none" }}
                accept=".pdf,.txt,.doc,.docx"
                onChange={handleFileChange}
              />

              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.currentTarget.value)}
                onKeyDown={handleKeyPress}
                placeholder={inputPlaceholder}
                radius="xl"
                size="sm"
                minRows={1}
                maxRows={3}
                autosize
                style={{ flex: 1 }}
                styles={{
                  input: {
                    border: "2px solid #eceff1",
                    fontSize: "14px",
                  },
                }}
                aria-label="Message input"
              />
              <Button
                size="sm"
                radius="xl"
                variant="gradient"
                gradient={{ from: "grape", to: "violet", deg: 45 }}
                onClick={handleSendMessage}
                disabled={!input.trim() || loading}
                style={{ fontWeight: 700 }}
                aria-label="Send message"
              >
                {loading ? (
                  <IconLoader2 size={16} className="animate-spin" />
                ) : (
                  "Send"
                )}
              </Button>
            </Group>
            {/* Disclaimer */}
            <Text size="xs" c="dimmed" ta="center" mt={6}>
              Aidanna can make mistakes. Please double-check responses.
            </Text>
          </Container>
        </Paper>
      </div>

      <style jsx global>{`
        .hover-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        .conv-item:hover {
          background: #f8f9fa !important;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        /* Focus ring for clickable brand elements */
        [role="button"]:focus {
          outline: 3px solid #c4b5fd;
          outline-offset: 2px;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
