"use client";
import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Container,
  Paper,
  Button,
  Group,
  Stack,
  Text,
  Badge,
  Card,
  SimpleGrid,
  Loader,
  ThemeIcon,
  List,
  Divider,
  Alert,
  Box,
  Center,
} from "@mantine/core";
import { IconCheck, IconSparkles, IconShieldLock, IconAlertCircle } from "@tabler/icons-react";

const API_BASE = "https://aidanna-backend.vercel.app/api";

export default function UpgradePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const { data: { user: gotUser } } = await supabase.auth.getUser();
      if (!gotUser) {
        router.push("/signin");
        return;
      }
      setUser(gotUser);
      setLoading(false);
    };
    init();
  }, [router, supabase.auth]);

  const handleUpgrade = async (planType: string) => {
    if (!user) return;
    setErrorMsg(null);
    setProcessingPlan(planType);

    try {
      const response = await fetch(`${API_BASE}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          planType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initialize payment");
      }

      // Redirect to Paystack payment page
      window.location.href = data.authorization_url;
    } catch (error: any) {
      setErrorMsg(error.message || "Payment failed. Please try again.");
      setProcessingPlan(null);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader size="lg" />
      </div>
    );
  }

  const Feature = ({ children }: { children: React.ReactNode }) => (
    <Group gap="xs" align="center" wrap="nowrap">
      <ThemeIcon radius="xl" size={22} variant="light" color="teal">
        <IconCheck size={16} />
      </ThemeIcon>
      <Text size="sm">{children}</Text>
    </Group>
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #faf5ff 0%, #fff 100%)" }}>
      {/* Header */}
      <Paper shadow="sm" p="md" style={{ borderBottom: "1px solid #e5e7eb", background: "#fff" }}>
        <Container size="lg">
          <Group justify="space-between">
            {/* brand → go home per your nav rule */}
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                textDecoration: "none",
                color: "#1f2937",
              }}
            >
              <Image src="/logo.png" alt="Aidanna" width={32} height={32} style={{ borderRadius: 8 }} />
              <Text fw={800} size="lg">Aidanna</Text>
            </Link>

            <Group gap="xs">
              <Button variant="subtle" component={Link} href="/app">
                Back to App
              </Button>
            
            </Group>
          </Group>
        </Container>
      </Paper>

      {/* Hero */}
      <Container size="lg" pt="xl" pb="md">
        <Stack align="center" gap="sm" mb="xl">
          <Badge
            size="lg"
            variant="light"
            color="grape"
            styles={{ root: { padding: "0.5rem 1rem" } }}
            leftSection={<IconSparkles size={16} />}
          >
            Upgrade to Pro
          </Badge>
          <Text size="2xl" fw={900} ta="center" style={{ maxWidth: 800, lineHeight: 1.2 }}>
            Unlock unlimited learning, speed, and premium features
          </Text>
          <Text size="md" c="dimmed" ta="center" style={{ maxWidth: 700 }}>
            No more daily caps. Learn anything, anytime — in English, Hausa, Igbo, or Yoruba.
          </Text>
        </Stack>

        {errorMsg && (
          <Alert icon={<IconAlertCircle size={18} />} color="red" variant="light" mb="md">
            {errorMsg}
          </Alert>
        )}
      </Container>

      {/* Pricing */}
      <Container size="lg" pb="xl">
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" style={{ maxWidth: 980, margin: "0 auto" }}>
          {/* Monthly */}
          <Card
            withBorder
            padding="xl"
            radius="xl"
            shadow="sm"
            style={{
              background: "#fff",
              transition: "transform .15s ease, box-shadow .15s ease, border-color .2s",
              borderColor: "#eceff1",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <Stack gap="lg">
              <Stack gap={4}>
               <Text
  size="xs"
  c="dimmed"
  fw={700}
  tt="uppercase"
  style={{ letterSpacing: 0.6 }}
>
  Monthly
</Text>

                <Group align="baseline" gap={6} mt={4}>
                  <Text size="3xl" fw={900}>₦2,500</Text>
                  <Text size="sm" c="dimmed">/ month</Text>
                </Group>
              </Stack>

              <Stack gap={8}>
                <Feature>Unlimited stories daily</Feature>
                <Feature>Priority generation speed</Feature>
                <Feature>All 4 languages</Feature>
                <Feature>Save & export stories</Feature>
                <Feature>Cancel anytime</Feature>
              </Stack>

              <Button
                fullWidth
                size="md"
                variant="light"
                color="grape"
                onClick={() => handleUpgrade("pro_monthly")}
                loading={processingPlan === "pro_monthly"}
                disabled={!!processingPlan}
                styles={{ root: { fontWeight: 700 } }}
              >
                Get Monthly
              </Button>
            </Stack>
          </Card>

          {/* Yearly (featured) */}
          <Card
            padding="xl"
            radius="xl"
            shadow="lg"
            style={{
              position: "relative",
              background: "#0f0a1f",
              color: "#fff",
              border: "1px solid rgba(255,255,255,.12)",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <Box
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(1200px 400px at -10% -10%, rgba(147,51,234,.35), transparent 50%), radial-gradient(1200px 400px at 110% 110%, rgba(236,72,153,.35), transparent 50%)",
                pointerEvents: "none",
              }}
            />
            <Badge
              size="sm"
              variant="filled"
              color="yellow"
              style={{ position: "absolute", top: 16, right: 16, zIndex: 2 }}
            >
              Best value • Save ₦5,000
            </Badge>

            <Stack gap="lg" style={{ position: "relative", zIndex: 1 }}>
              <Stack gap={4}>
                <Text size="xs" fw={700} tt="uppercase" style={{ opacity: 0.9 }}>
                  Yearly
                </Text>
                <Group align="baseline" gap={6} mt={4}>
                  <Text size="3xl" fw={900}>₦25,000</Text>
                  <Text size="sm" style={{ opacity: 0.8 }}>/ year</Text>
                </Group>
                <Text size="xs" mt={2} style={{ opacity: 0.8 }}>
                  Equivalent to ₦2,083 / month
                </Text>
              </Stack>

              <List
                spacing="xs"
                center
                size="sm"
                icon={
                  <ThemeIcon color="grape" size={20} radius="xl" variant="light">
                    <IconCheck size={14} />
                  </ThemeIcon>
                }
              >
                <List.Item>Everything in Monthly</List.Item>
                <List.Item>Save ₦5,000 per year</List.Item>
                <List.Item>Lock in current price</List.Item>
                <List.Item>Priority support</List.Item>
                <List.Item>Early access to new features</List.Item>
              </List>

              <Button
                fullWidth
                size="md"
                variant="white"
                color="dark"
                onClick={() => handleUpgrade("pro_yearly")}
                loading={processingPlan === "pro_yearly"}
                disabled={!!processingPlan}
                styles={{ root: { fontWeight: 800 } }}
              >
                Get Yearly — Best Value
              </Button>
            </Stack>
          </Card>
        </SimpleGrid>

        {/* Trust strip */}
        <Container size="sm" mt="xl">
          <Card withBorder radius="lg" p="md" style={{ background: "#fff", borderColor: "#eceff1" }}>
            <Group justify="center" gap="sm">
              <ThemeIcon size={28} radius="xl" variant="light" color="grape">
                <IconShieldLock size={18} />
              </ThemeIcon>
              <Text size="sm" c="dimmed" ta="center">
                Secure checkout via Paystack. We never store your card details.
              </Text>
            </Group>
          </Card>
        </Container>

        {/* FAQ */}
        <Container size="md" mt="xl">
          <Divider my="lg" />
          <Stack gap="md" style={{ maxWidth: 820, margin: "0 auto" }}>
            <Center>
              <Text size="xl" fw={800}>Common Questions</Text>
            </Center>

            <Card padding="lg" radius="md" withBorder style={{ background: "#fff" }}>
              <Text size="sm" fw={600} mb="xs">What payment methods do you accept?</Text>
              <Text size="sm" c="dimmed">
                We accept Nigerian cards (Visa, Mastercard, Verve) and bank transfers via Paystack. Your payment is 100% secure.
              </Text>
            </Card>

            <Card padding="lg" radius="md" withBorder style={{ background: "#fff" }}>
              <Text size="sm" fw={600} mb="xs">Can I cancel anytime?</Text>
              <Text size="sm" c="dimmed">
                Yes. Cancel from settings at any time; you’ll keep Pro access until the end of your billing period.
              </Text>
            </Card>

            <Card padding="lg" radius="md" withBorder style={{ background: "#fff" }}>
              <Text size="sm" fw={600} mb="xs">What happens after I upgrade?</Text>
              <Text size="sm" c="dimmed">
                Right after payment, your account is upgraded to Pro. Unlimited stories, faster responses, and premium features unlock instantly.
              </Text>
            </Card>

            <Card padding="lg" radius="md" withBorder style={{ background: "#fff" }}>
              <Text size="sm" fw={600} mb="xs">Is my payment secure?</Text>
              <Text size="sm" c="dimmed">
                Absolutely. We use Paystack, Nigeria’s trusted payment platform. We never store your card details.
              </Text>
            </Card>
          </Stack>
        </Container>
      </Container>

      {/* Sticky mobile CTA (visible when plans might scroll off-screen) */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(6px)",
          borderTop: "1px solid #eaeaea",
          padding: "0.5rem",
          display: "none",
        }}
      >
        <Container size="sm">
          <Button
            fullWidth
            size="md"
            color="grape"
            onClick={() => handleUpgrade("pro_yearly")}
            loading={processingPlan === "pro_yearly"}
            disabled={!!processingPlan}
            styles={{ root: { fontWeight: 800 } }}
          >
            Upgrade to Pro — Yearly (Best Value)
          </Button>
        </Container>
      </div>

      <style jsx global>{`
        /* subtle, tasteful animations */
        .mantine-Card-root {
          will-change: transform, box-shadow;
        }
        @media (max-width: 640px) {
          /* show sticky CTA on mobile only */
          div[style*="position: sticky"] {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
