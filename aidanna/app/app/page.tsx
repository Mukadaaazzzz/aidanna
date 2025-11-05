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
  SegmentedControl,
  SimpleGrid,
  Divider,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconBook,
  IconUsers,
  IconFileText,
  IconPlayerPlay,
  IconLogout,
  IconSettings,
  IconLoader2,
  IconFlask,
  IconBriefcase,
  IconCpu,
} from "@tabler/icons-react";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

type StoryMode = "narrative" | "dialogue" | "case-study" | "interactive";

const API_BASE = "https://aidanna-backend.vercel.app/api";

const DEFAULT_MODES: Record<
  StoryMode,
  { icon: any; label: string; color: string }
> = {
  narrative: {
    icon: IconBook,
    label: "Narrative",
    color: "grape",
  },
  dialogue: {
    icon: IconUsers,
    label: "Dialogue",
    color: "cyan",
  },
  "case-study": {
    icon: IconFileText,
    label: "Case Study",
    color: "teal",
  },
  interactive: {
    icon: IconPlayerPlay,
    label: "Interactive",
    color: "orange",
  },
};

const LEARNING_PROMPTS = [
  {
    icon: IconFlask,
    text: "Explain photosynthesis through a story",
    category: "Science",
  },
  {
    icon: IconBriefcase,
    text: "Teach me about supply and demand",
    category: "Business",
  },
  {
    icon: IconCpu,
    text: "How does machine learning work?",
    category: "Technology",
  },
];

export default function AppPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<StoryMode>("narrative");
  const [user, setUser] = useState<any>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // --- Layout constants to ensure first-sight fit on desktop ---
  const HEADER_HEIGHT = isMobile ? 64 : 72;
  const MODEBAR_HEIGHT = messages.length > 0 ? (isMobile ? 52 : 56) : 0;
  const COMPOSER_HEIGHT = isMobile ? 76 : 88;

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
      setIsLoadingUser(false);
    };

    init();
    return () => {
      isMounted = false;
    };
  }, [router, supabase.auth]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
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
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error || `Request failed with status ${res.status}`
        );
      }

      const json = await res.json();
      const reply = json.response || "No reply received.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ I’m having trouble connecting right now. Please try again shortly.",
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
    await supabase.auth.signOut();
    router.push("/");
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fafafa",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header (clean, minimal; no mode selector here) */}
      <Paper
        shadow="xs"
        p={isMobile ? "sm" : "md"}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          borderBottom: "1px solid #e9ecef",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          height: HEADER_HEIGHT,
        }}
      >
        <Container size="lg" h="100%">
          <Group justify="space-between" align="center" h="100%" wrap="nowrap">
            <Group gap="sm" wrap="nowrap">
              <Image
                src="/logo.png"
                alt="Aidanna Logo"
                width={isMobile ? 28 : 34}
                height={isMobile ? 28 : 34}
                style={{ borderRadius: 8 }}
              />
              <Text fw={700} size={isMobile ? "lg" : "xl"}>
                Aidanna
              </Text>
            </Group>

            <Menu shadow="md" width={220}>
              <Menu.Target>
                <ActionIcon variant="subtle" size="lg" radius="md">
                  <Avatar
                    size={isMobile ? "sm" : "md"}
                    radius="md"
                    variant="gradient"
                    gradient={{ from: "grape", to: "violet", deg: 45 }}
                  >
                    {user?.user_metadata?.name?.[0]?.toUpperCase() || "U"}
                  </Avatar>
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                {user && (
                  <>
                    <Menu.Label>
                      {user?.user_metadata?.name || "User"}
                    </Menu.Label>
                    <Menu.Divider />
                  </>
                )}
                <Menu.Item
                  leftSection={
                    <IconSettings style={{ width: rem(14), height: rem(14) }} />
                  }
                >
                  Settings
                </Menu.Item>
                <Menu.Item
                  color="red"
                  leftSection={
                    <IconLogout style={{ width: rem(14), height: rem(14) }} />
                  }
                  onClick={handleSignOut}
                >
                  Sign out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Container>
      </Paper>

      {/* Mode Bar (visible once user is in chat; not in header) */}
      {messages.length > 0 && (
        <Paper
          p={isMobile ? 8 : 10}
          withBorder
          style={{
            position: "sticky",
            top: HEADER_HEIGHT,
            zIndex: 90,
            background: "#fff",
            height: MODEBAR_HEIGHT,
          }}
        >
          <Container size="md">
            <Group justify="space-between" wrap="nowrap">
              <Text size="sm" c="dimmed">
                Choose a learning mode
              </Text>
              <SegmentedControl
                value={selectedMode}
                onChange={(value) => setSelectedMode(value as StoryMode)}
                data={Object.entries(DEFAULT_MODES).map(([key, mode]) => ({
                  value: key,
                  label: mode.label,
                }))}
                size="xs"
                radius="xl"
              />
            </Group>
          </Container>
        </Paper>
      )}

      {/* Main area: fits within the viewport height without forcing desktop scroll */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          // Reserve space so content isn't hidden behind the fixed composer
          paddingBottom: COMPOSER_HEIGHT + 16,
        }}
      >
        <Container size="md" py={isMobile ? "md" : "lg"}>
          {messages.length === 0 ? (
            // Welcome Screen (compact and above-the-fold on desktop)
            <Stack
              align="center"
              gap={isMobile ? "md" : "lg"}
              mt={isMobile ? 24 : 32}
              px={isMobile ? "md" : 0}
            >
              {!isLoadingUser && user && (
                <Text size={isMobile ? "md" : "lg"} fw={500} c="dimmed">
                  Hi {user?.user_metadata?.name}
                </Text>
              )}
              <Text
                size={isMobile ? 26 : 32}
                fw={700}
                ta="center"
                style={{ lineHeight: 1.15 }}
              >
                What will you learn today?
              </Text>

              <Box w="100%">
                <Text size="sm" c="dimmed" ta="center" mb="xs">
                  Pick a mode to get started
                </Text>
                <Group gap="xs" justify="center" wrap="wrap">
                  {Object.entries(DEFAULT_MODES).map(([key, mode]) => {
                    const Icon = mode.icon;
                    const isActive = selectedMode === key;
                    return (
                      <Button
                        key={key}
                        size="sm"
                        variant={isActive ? "filled" : "light"}
                        color={mode.color}
                        leftSection={<Icon size={16} />}
                        onClick={() => setSelectedMode(key as StoryMode)}
                        radius="xl"
                      >
                        {mode.label}
                      </Button>
                    );
                  })}
                </Group>
              </Box>

              <Divider w="100%" variant="dashed" />

              <Text size="sm" c="dimmed" ta="center">
                Try one of these to begin:
              </Text>

              {/* Prompt Cards */}
              <Box w="100%">
                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm">
                  {LEARNING_PROMPTS.map((prompt, idx) => (
                    <Card
                      key={idx}
                      shadow="xs"
                      padding="lg"
                      radius="md"
                      withBorder
                      style={{
                        cursor: "pointer",
                        transition: "transform .15s ease, box-shadow .15s ease",
                      }}
                      onClick={() => handlePromptClick(prompt.text)}
                      className="hover-card"
                    >
                      <Stack gap="xs" align="flex-start">
                        <prompt.icon size={20} color="#868e96" />
                        <Text size="sm" c="dimmed" style={{ lineHeight: 1.5 }}>
                          {prompt.text}
                        </Text>
                      </Stack>
                    </Card>
                  ))}
                </SimpleGrid>
              </Box>
            </Stack>
          ) : (
            // Chat Messages Pane (viewport-fit)
            <div
              style={{
                height: `calc(100vh - ${HEADER_HEIGHT + MODEBAR_HEIGHT + COMPOSER_HEIGHT + (isMobile ? 24 : 32)}px)`,
                overflowY: "auto",
                paddingRight: 2,
              }}
            >
              <Stack gap={isMobile ? "sm" : "md"} mt="sm">
                {messages.map((m, i) => (
                  <Group
                    key={i}
                    align="flex-start"
                    gap="md"
                    justify={m.role === "user" ? "flex-end" : "flex-start"}
                    wrap="nowrap"
                  >
                    {m.role === "assistant" && (
                      <Avatar
                        size={isMobile ? "sm" : "md"}
                        radius="md"
                        style={{ flexShrink: 0 }}
                      >
                        <Image
                          src="/logo.png"
                          alt="Aidanna"
                          width={isMobile ? 24 : 28}
                          height={isMobile ? 24 : 28}
                          style={{ borderRadius: 6 }}
                        />
                      </Avatar>
                    )}

                    <Paper
                      shadow="xs"
                      p={isMobile ? "xs" : "md"}
                      radius="lg"
                      withBorder
                      style={{
                        maxWidth: isMobile ? "78%" : "72%",
                        background:
                          m.role === "user" ? "var(--mantine-color-dark-7)" : "#ffffff",
                        color: m.role === "user" ? "#ffffff" : "inherit",
                        borderColor:
                          m.role === "user" ? "transparent" : "var(--mantine-color-gray-3)",
                      }}
                    >
                      <Text
                        size={isMobile ? "sm" : "sm"}
                        style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}
                      >
                        {m.content}
                      </Text>
                    </Paper>

                    {m.role === "user" && (
                      <Avatar
                        size={isMobile ? "sm" : "md"}
                        radius="md"
                        variant="gradient"
                        gradient={{ from: "grape", to: "violet", deg: 45 }}
                        style={{ flexShrink: 0 }}
                      >
                        {user?.user_metadata?.name?.[0]?.toUpperCase() || "U"}
                      </Avatar>
                    )}
                  </Group>
                ))}

                {loading && (
                  <Group align="flex-start" gap="md" wrap="nowrap">
                    <Avatar
                      size={isMobile ? "sm" : "md"}
                      radius="md"
                      style={{ flexShrink: 0 }}
                    >
                      <Image
                        src="/logo.png"
                        alt="Aidanna"
                        width={isMobile ? 24 : 28}
                        height={isMobile ? 24 : 28}
                        style={{ borderRadius: 6 }}
                      />
                    </Avatar>
                    <Paper shadow="xs" p={isMobile ? "xs" : "md"} radius="lg" withBorder>
                      <Group gap="xs">
                        <IconLoader2 size={isMobile ? 14 : 16} className="animate-spin" />
                        <Text size={isMobile ? "sm" : "sm"} c="dimmed">
                          Crafting your story...
                        </Text>
                      </Group>
                    </Paper>
                  </Group>
                )}
                <div ref={messagesEndRef} />
              </Stack>
            </div>
          )}
        </Container>
      </div>

      {/* Composer (fixed) */}
      <Paper
        shadow="xl"
        p={isMobile ? "sm" : "md"}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          borderTop: "1px solid #e9ecef",
          background: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(10px)",
          height: COMPOSER_HEIGHT,
        }}
      >
        <Container size="md" h="100%">
          <Group align="flex-end" gap={isMobile ? "xs" : "md"} wrap="nowrap">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your question…"
              radius="xl"
              size={isMobile ? "sm" : "md"}
              minRows={1}
              maxRows={4}
              autosize
              style={{ flex: 1 }}
              styles={{
                input: {
                  border: "2px solid #eceff1",
                  transition: "border-color 0.2s, box-shadow .2s",
                  fontSize: isMobile ? "14px" : "15px",
                  background: "#fff",
                  "&:focus": {
                    borderColor: "var(--mantine-color-grape-5)",
                    boxShadow: "0 0 0 3px rgba(131, 76, 255, 0.12)",
                  },
                },
              }}
            />
            <Button
              size={isMobile ? "sm" : "md"}
              radius="xl"
              variant="filled"
              color="grape"
              onClick={handleSendMessage}
              disabled={!input.trim() || loading}
              style={{ flexShrink: 0, fontWeight: 700 }}
            >
              {loading ? "…" : "Ask"}
            </Button>
          </Group>
        </Container>
      </Paper>

      {/* Minimal global styles for polish */}
      <style jsx global>{`
        .hover-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
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
        @media (max-width: 768px) {
          .hover-card:active {
            transform: scale(0.98);
          }
        }
      `}</style>
    </div>
  );
}
