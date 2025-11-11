"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Container, Stack, Text, Loader, Button } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";

const API_BASE = "https://aidanna-backend.vercel.app/api";

export default function PaymentCallback() {
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get("reference");

      if (!reference) {
        setStatus("failed");
        setMessage("No payment reference found");
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/payment?reference=${reference}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setStatus("success");
          setMessage("Your Pro subscription is now active!");
          
          // Redirect to app after 3 seconds
          setTimeout(() => {
            router.push("/app");
          }, 3000);
        } else {
          setStatus("failed");
          setMessage(data.error || "Payment verification failed");
        }
      } catch (error: any) {
        setStatus("failed");
        setMessage("Failed to verify payment. Please contact support.");
        console.error("Payment verification error:", error);
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #faf5ff 0%, #fff 100%)"
    }}>
      <Container size="sm">
        <Stack align="center" gap="lg" style={{
          background: "#fff",
          padding: "3rem 2rem",
          borderRadius: "1rem",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
        }}>
          {status === "loading" && (
            <>
              <Loader size="xl" color="grape" />
              <Text size="lg" fw={600}>Verifying your payment...</Text>
              <Text size="sm" c="dimmed" ta="center">
                Please wait while we confirm your subscription
              </Text>
            </>
          )}

          {status === "success" && (
            <>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <IconCheck size={48} color="#fff" strokeWidth={3} />
              </div>
              <Text size="2xl" fw={900} ta="center">
                Payment Successful!
              </Text>
              <Text size="lg" c="dimmed" ta="center">
                {message}
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                Redirecting you to the app...
              </Text>
              <Button
                component={Link}
                href="/app"
                size="lg"
                variant="gradient"
                gradient={{ from: "grape", to: "violet" }}
              >
                Go to App Now
              </Button>
            </>
          )}

          {status === "failed" && (
            <>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <IconX size={48} color="#fff" strokeWidth={3} />
              </div>
              <Text size="2xl" fw={900} ta="center">
                Payment Failed
              </Text>
              <Text size="lg" c="dimmed" ta="center">
                {message}
              </Text>
              <Stack gap="sm" w="100%">
                <Button
                  component={Link}
                  href="/upgrade"
                  size="lg"
                  variant="gradient"
                  gradient={{ from: "grape", to: "violet" }}
                  fullWidth
                >
                  Try Again
                </Button>
                <Button
                  component={Link}
                  href="/app"
                  size="lg"
                  variant="light"
                  fullWidth
                >
                  Back to App
                </Button>
              </Stack>
            </>
          )}
        </Stack>
      </Container>
    </div>
  );
}