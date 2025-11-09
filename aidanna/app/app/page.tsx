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
  IconMenu2,
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

const API_BASE = "https://aidanna-backend.vercel.app/api";

const DEFAULT_MODES: Record<StoryMode, { icon: any; label: string; color: string }> = {
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
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [conversationId, setConversationId] = useState<string>("new");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [usage, setUsage] = useState({ used: 0, remaining: 10, total: 10 });
  const [usageLoaded, setUsageLoaded] = useState(false);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const HEADER_HEIGHT = 60;
  const COMPOSER_HEIGHT = 80;
  const SIDEBAR_WIDTH = 260;

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const { data: { user: gotUser } } = await supabase.auth.getUser();
      if (!isMounted) return;

      if (!gotUser) {
        router.push("/signin");
        return;
      }
      setUser(gotUser);
      setIsLoadingUser(false);
      
      // Load conversations and usage
      await Promise.all([
        loadConversations(gotUser.id),
        loadCurrentUsage(gotUser.id)
      ]);

      // Restore last conversation from localStorage
      const lastConvId = localStorage.getItem('lastConversationId');
      if (lastConvId && lastConvId !== 'new') {
        loadConversationMessages(lastConvId, false);
      }
    };

    init();
    return () => { isMounted = false; };
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
      localStorage.setItem('lastConversationId', conversationId);
    }
  }, [conversationId]);

  const loadCurrentUsage = async (userId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Failed to load usage:', error);
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
      console.error('Failed to load usage:', err);
      setUsageLoaded(true);
    }
  };

  const loadConversations = async (userId: string) => {
    setLoadingConversations(true);
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setConversations(data || []);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoadingConversations(false);
    }
  };

  const loadConversationMessages = async (convId: string, closeDrawerAfter = true) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedMessages: Message[] = (data || []).map((msg: any) => ({
        role: msg.role,
        content: msg.content,
        messageId: msg.id,
      }));

      setMessages(formattedMessages);
      setConversationId(convId);
      
      const conv = conversations.find(c => c.id === convId);
      if (conv) setSelectedMode(conv.mode as StoryMode);
      
      if (isMobile && closeDrawerAfter) closeDrawer();
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setConversationId("new");
    localStorage.setItem('lastConversationId', 'new');
    if (isMobile) closeDrawer();
  };

  const handleDeleteConversation = async (convId: string) => {
    if (!confirm('Delete this conversation?')) return;

    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', convId);

      if (error) throw error;

      setConversations(prev => prev.filter(c => c.id !== convId));
      if (conversationId === convId) {
        handleNewChat();
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
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
      const res = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMsg.content,
          mode: selectedMode,
          userId: user.id,
          conversationId: conversationId,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `⚠️ ${json.error}`,
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
        throw new Error(json.error || "Request failed");
      }

      if (conversationId === "new" && json.conversation_id) {
        setConversationId(json.conversation_id);
        localStorage.setItem('lastConversationId', json.conversation_id);
        loadConversations(user.id);
      }

      if (json.usage) {
        setUsage({
          used: json.usage.requests_used,
          remaining: json.usage.requests_remaining,
          total: json.usage.daily_limit,
        });
      }

      const assistantMsg: Message = {
        role: "assistant",
        content: json.response || "No reply received.",
        messageId: Date.now().toString() + "-assistant",
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Something went wrong. Please try again.",
          messageId: Date.now().toString() + "-error",
        },
      ]);
      console.error("API Error:", err);
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
    localStorage.removeItem('lastConversationId');
    await supabase.auth.signOut();
    router.push("/");
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  if (isLoadingUser) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "linear-gradient(135deg, #faf5ff 0%, #fff 100%)"
      }}>
        <Stack align="center" gap="md">
          <Loader size="lg" color="grape" />
          <Text size="sm" c="dimmed">Loading Aidanna...</Text>
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
        >
          New Chat
        </Button>
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
                  background: conversationId === conv.id ? "#f3e8ff" : "transparent",
                  border: conversationId === conv.id ? "1px solid #9333ea" : "1px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                className="conv-item"
              >
                <Group justify="space-between" wrap="nowrap">
                  <Group gap="xs" style={{ flex: 1, minWidth: 0 }}>
                    <IconMessage size={14} color="#868e96" style={{ flexShrink: 0 }} />
                    <Text size="xs" truncate style={{ flex: 1 }}>
                      {conv.title}
                    </Text>
                  </Group>
                  <ActionIcon
                    size="xs"
                    variant="subtle"
                    color="red"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteConversation(conv.id);
                    }}
                  >
                    <IconTrash size={12} />
                  </ActionIcon>
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
            <Text size="xs" fw={500} truncate>
              {user?.user_metadata?.name || user?.email}
            </Text>
            {usageLoaded && (
              <Text size="xs" c="dimmed">
                {usage.remaining}/{usage.total} left today
              </Text>
            )}
          </div>
          <Menu shadow="md" width={180}>
            <Menu.Target>
              <ActionIcon variant="subtle" size="sm">
                <IconSettings size={14} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconSettings style={{ width: rem(12) }} />} style={{ fontSize: 13 }}>
                Settings
              </Menu.Item>
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
          <Group gap="xs">
            <Image src="/logo.png" alt="Aidanna" width={24} height={24} style={{ borderRadius: 6 }} />
            <Text fw={700}>Aidanna</Text>
          </Group>
        }
        styles={{
          content: { display: "flex", flexDirection: "column" },
          body: { flex: 1, display: "flex", flexDirection: "column", padding: 0 }
        }}
      >
        <SidebarContent />
      </Drawer>

      {/* Main Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh" }}>
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
            <Group justify="space-between" align="center" h="100%" wrap="nowrap">
              <Group gap="sm" wrap="nowrap">
                {isMobile && (
                  <Burger opened={drawerOpened} onClick={openDrawer} size="sm" />
                )}
                <Image src="/logo.png" alt="Aidanna" width={28} height={28} style={{ borderRadius: 6 }} />
                <Text fw={700} size="lg">Aidanna</Text>
              </Group>

              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon variant="subtle" size="lg">
                    <Avatar size="sm" radius="md" color="grape">
                      {user?.user_metadata?.name?.[0]?.toUpperCase() || "U"}
                    </Avatar>
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label style={{ fontSize: 12 }}>{user?.user_metadata?.name || user?.email}</Menu.Label>
                  {usageLoaded && (
                    <Menu.Label style={{ fontSize: 11 }} c="dimmed">{usage.remaining}/{usage.total} requests left</Menu.Label>
                  )}
                  <Menu.Divider />
                  <Menu.Item leftSection={<IconSettings style={{ width: rem(14) }} />}>
                    Settings
                  </Menu.Item>
                  <Menu.Item color="red" leftSection={<IconLogout style={{ width: rem(14) }} />} onClick={handleSignOut}>
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
              <Stack align="center" gap={isMobile ? "sm" : "md"} mt={isMobile ? 8 : 16}>
                <Text size={isMobile ? "sm" : "md"} c="dimmed">
                  Hi {user?.user_metadata?.name?.split(' ')[0] || 'there'}
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
                      >
                        {mode.label}
                      </Button>
                    );
                  })}
                </Group>

                <Divider w="100%" my={isMobile ? "xs" : "sm"} />

                <Stack gap={isMobile ? "xs" : "sm"} w="100%">
                  <Text size="xs" c="dimmed" ta="center">Try one of these:</Text>
                  <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={isMobile ? "xs" : "sm"}>
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
                      >
                        <Stack gap="xs">
                          <prompt.icon size={18} color="#868e96" />
                          <Text size="xs" c="dimmed" style={{ lineHeight: 1.4 }}>{prompt.text}</Text>
                        </Stack>
                      </Card>
                    ))}
                  </SimpleGrid>
                </Stack>
              </Stack>
            ) : (
              <Stack gap="md" mt="xs">
                {messages.map((m) => (
                  <Group key={m.messageId} align="flex-start" gap="sm" wrap="nowrap" justify={m.role === "user" ? "flex-end" : "flex-start"}>
                    {m.role === "assistant" && (
                      <Avatar size="sm" radius="md">
                        <Image src="/logo.png" alt="Aidanna" width={22} height={22} style={{ borderRadius: 6 }} />
                      </Avatar>
                    )}

                    <Paper
                      shadow="xs"
                      p={isMobile ? "xs" : "sm"}
                      radius="lg"
                      withBorder
                      style={{
                        maxWidth: isMobile ? "80%" : "75%",
                        background: m.role === "user" ? "#2d2d2d" : "#ffffff",
                        color: m.role === "user" ? "#ffffff" : "inherit",
                        borderColor: m.role === "user" ? "transparent" : "#e9ecef",
                      }}
                    >
                      <Text size="sm" style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                        {sanitizeText(m.content)}
                      </Text>
                    </Paper>

                    {m.role === "user" && (
                      <Avatar size="sm" radius="md" color="grape">
                        {user?.user_metadata?.name?.[0]?.toUpperCase() || "U"}
                      </Avatar>
                    )}
                  </Group>
                ))}

                {loading && (
                  <Group align="flex-start" gap="sm">
                    <Avatar size="sm" radius="md">
                      <Image src="/logo.png" alt="Aidanna" width={22} height={22} style={{ borderRadius: 6 }} />
                    </Avatar>
                    <Paper shadow="xs" p="sm" radius="lg" withBorder>
                      <Group gap="xs">
                        <IconLoader2 size={14} className="animate-spin" />
                        <Text size="xs" c="dimmed">Crafting your story...</Text>
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
            <Group align="flex-end" gap="xs" wrap="nowrap">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.currentTarget.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your question..."
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
              />
              <Button
                size="sm"
                radius="xl"
                variant="filled"
                color="grape"
                onClick={handleSendMessage}
                disabled={!input.trim() || loading}
                style={{ fontWeight: 700 }}
              >
                {loading ? <IconLoader2 size={16} className="animate-spin" /> : "Ask"}
              </Button>
            </Group>
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
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}