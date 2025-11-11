// app/payment/callback/layout.tsx
import { Suspense } from "react";
import { Container, Stack, Text, Loader } from "@mantine/core";

export const dynamic = "force-dynamic"; // avoid static prerender crash on callbacks

export default function CallbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #faf5ff 0%, #fff 100%)",
          }}
        >
          <Container size="sm">
            <Stack align="center" gap="xs">
              <Loader size="lg" color="grape" />
              <Text size="sm" c="dimmed">
                Verifying your payment…
              </Text>
            </Stack>
          </Container>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
