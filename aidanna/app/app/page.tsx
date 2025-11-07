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
  Loader,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconBook,
  IconUsers,
  IconLogout,
  IconSettings,
  IconLoader2,
  IconFlask,
  IconBriefcase,
  IconCpu,
  IconMicrophone,
  IconPlayerStop,
  IconVolume,
} from "@tabler/icons-react";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
  audio?: string;
  messageId?: string;
};

type StoryMode = "narrative" | "dialogue";

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

const VOICE_OPTIONS = [
  { id: 'alloy', name: 'Alloy', description: 'Balanced and clear' },
  { id: 'echo', name: 'Echo', description: 'Warm and resonant' },
  { id: 'fable', name: 'Fable', description: 'Storytelling tone' },
  { id: 'onyx', name: 'Onyx', description: 'Deep and authoritative' },
  { id: 'nova', name: 'Nova', description: 'Bright and cheerful' },
  { id: 'shimmer', name: 'Shimmer', description: 'Soft and calming' },
];

const sanitizeText = (s: string) => s.replace(/\*/g, "");

export default function AppPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<StoryMode>("narrative");
  const [user, setUser] = useState<any>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState('alloy');
  const [voiceMode, setVoiceMode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const HEADER_HEIGHT = isMobile ? 64 : 72;
  const MODEBAR_HEIGHT = messages.length > 0 ? (isMobile ? 52 : 56) : 0;
  const VOICE_TOGGLE_HEIGHT = 48; // Always show voice toggle
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

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser. Please use Chrome.');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    let finalTranscript = '';
    
    recognition.onstart = () => {
      console.log('Speech recognition started');
      setIsListening(true);
      setInput('Listening...');
    };
    
    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      setInput(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      if (event.error === 'no-speech') {
        setInput('');
        console.log('No speech detected. Please try again.');
      }
      
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
      
      if (!finalTranscript) {
        setInput('');
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Fixed playAudio function
  const playAudio = (audioBase64: string, messageId: string) => {
    console.log('playAudio called for message:', messageId);
    console.log('Audio data length:', audioBase64?.length);
    
    // If currently playing this message, stop it
    if (isPlaying === messageId) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(null);
      return;
    }

    try {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      setIsPlaying(messageId);

      // Convert base64 to blob
      const binaryString = atob(audioBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      console.log('Created audio URL:', audioUrl);

      // Create or reuse audio element
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      audioRef.current.src = audioUrl;
      
      audioRef.current.onended = () => {
        console.log('Audio playback finished');
        setIsPlaying(null);
        URL.revokeObjectURL(audioUrl);
      };

      audioRef.current.onerror = (error) => {
        console.error('Audio playback error:', error);
        setIsPlaying(null);
        URL.revokeObjectURL(audioUrl);
        alert('Failed to play audio. Please try again.');
      };

      // Play the audio
      audioRef.current.play().then(() => {
        console.log('Audio playing successfully');
      }).catch((error) => {
        console.error('Play failed:', error);
        setIsPlaying(null);
        URL.revokeObjectURL(audioUrl);
        alert('Failed to play audio: ' + error.message);
      });

    } catch (error) {
      console.error('Audio setup failed:', error);
      setIsPlaying(null);
      alert('Failed to setup audio: ' + (error as Error).message);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { 
      role: "user", 
      content: input.trim(),
      messageId: Date.now().toString() + '-user'
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      console.log('Sending request with voice mode:', voiceMode, 'voice:', selectedVoice);
      
      const res = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMsg.content,
          mode: selectedMode,
          voiceResponse: voiceMode,
          voice: selectedVoice,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error || `Request failed with status ${res.status}`
        );
      }

      const json = await res.json();
      console.log('Backend response:', json);
      console.log('Has audio:', !!json.audio);
      console.log('Audio length:', json.audio?.length);

      const messageId = Date.now().toString() + '-assistant';
      const assistantMsg: Message = { 
        role: "assistant", 
        content: json.response || "No reply received.",
        audio: json.audio,
        messageId: messageId
      };

      console.log('Setting assistant message with audio:', !!assistantMsg.audio);
      setMessages((prev) => [...prev, assistantMsg]);
      
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ I'm having trouble connecting right now. Please try again shortly.",
          messageId: Date.now().toString() + '-error'
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
      {/* Header */}
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
            <Group
              gap="sm"
              wrap="nowrap"
              onClick={() => router.push("/")}
              style={{ cursor: "pointer" }}
            >
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

      {/* Mode Bar */}
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

      {/* Voice Mode Toggle - ALWAYS VISIBLE */}
      <Paper
        p={isMobile ? 8 : 10}
        withBorder
        style={{
          position: "sticky",
          top: HEADER_HEIGHT + MODEBAR_HEIGHT,
          zIndex: 85,
          background: "#fff",
          borderTop: "1px solid #e9ecef",
          height: VOICE_TOGGLE_HEIGHT,
        }}
      >
        <Container size="md">
          <Group justify="space-between" align="center">
            <Text size="sm" c="dimmed">
              Voice mode
            </Text>
            <Group gap="xs">
              <Button
                size="xs"
                variant={voiceMode ? "filled" : "outline"}
                color="blue"
                onClick={() => setVoiceMode(!voiceMode)}
              >
                {voiceMode ? "🔊 Voice On" : "🔇 Voice Off"}
              </Button>
              {voiceMode && (
                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <Button size="xs" variant="light">
                      {VOICE_OPTIONS.find(v => v.id === selectedVoice)?.name}
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    {VOICE_OPTIONS.map((voice) => (
                      <Menu.Item
                        key={voice.id}
                        onClick={() => setSelectedVoice(voice.id)}
                      >
                        <Stack gap={2}>
                          <Text size="sm">{voice.name}</Text>
                          <Text size="xs" c="dimmed">
                            {voice.description}
                          </Text>
                        </Stack>
                      </Menu.Item>
                    ))}
                  </Menu.Dropdown>
                </Menu>
              )}
            </Group>
          </Group>
        </Container>
      </Paper>

      {/* Main area */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          paddingBottom: COMPOSER_HEIGHT + 16,
        }}
      >
        <Container size="md" py={isMobile ? "md" : "lg"}>
          {messages.length === 0 ? (
            // Welcome Screen
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
                size="xl"
                fw={700}
                ta="center"
                style={{ lineHeight: 1.15, fontSize: isMobile ? 26 : 32 }}
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
                        transition:
                          "transform .15s ease, box-shadow .15s ease",
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
            // Chat Messages
            <div
              style={{
                height: `calc(100vh - ${HEADER_HEIGHT + MODEBAR_HEIGHT + VOICE_TOGGLE_HEIGHT + COMPOSER_HEIGHT + (isMobile ? 64 : 80)}px)`,
                overflowY: "auto",
                paddingRight: 2,
              }}
            >
              <Stack gap={isMobile ? "sm" : "md"} mt="sm">
                {messages.map((m, i) => (
                  <Group
                    key={m.messageId || i}
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
                          m.role === "user"
                            ? "var(--mantine-color-dark-7)"
                            : "#ffffff",
                        color: m.role === "user" ? "#ffffff" : "inherit",
                        borderColor:
                          m.role === "user"
                            ? "transparent"
                            : "var(--mantine-color-gray-3)",
                      }}
                    >
                      <Text
                        size="sm"
                        style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}
                      >
                        {sanitizeText(m.content)}
                      </Text>
                      
                      {/* Audio Play Button */}
                      {m.role === "assistant" && m.audio && (
                        <Group mt="sm">
                          <Button
                            variant="light"
                            color="blue"
                            size="xs"
                            onClick={() => playAudio(m.audio!, m.messageId!)}
                            leftSection={
                              isPlaying === m.messageId ? 
                                <IconPlayerStop size={14} /> : 
                                <IconVolume size={14} />
                            }
                          >
                            {isPlaying === m.messageId ? "Stop" : "Listen"}
                          </Button>
                        </Group>
                      )}
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
                        <Text size="sm" c="dimmed">
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

      {/* Composer */}
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
            <ActionIcon
              size={isMobile ? "md" : "lg"}
              variant={isListening ? "filled" : "light"}
              color={isListening ? "red" : "blue"}
              onClick={isListening ? stopListening : startListening}
              radius="xl"
            >
              {isListening ? <IconPlayerStop size={16} /> : <IconMicrophone size={16} />}
            </ActionIcon>

            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              onKeyDown={handleKeyPress}
              placeholder={isListening ? "Listening..." : "Type your question or speak..."}
              radius="xl"
              size={isMobile ? "sm" : "md"}
              minRows={1}
              maxRows={4}
              autosize
              style={{ flex: 1 }}
              disabled={isListening}
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
                  "&:disabled": {
                    backgroundColor: "#f8f9fa",
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
              disabled={!input.trim() || loading || isListening}
              style={{ flexShrink: 0, fontWeight: 700 }}
            >
              {loading ? <IconLoader2 size={16} className="animate-spin" /> : "Ask"}
            </Button>
          </Group>
        </Container>
      </Paper>

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