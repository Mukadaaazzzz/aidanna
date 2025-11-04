// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const systemPrompts = {
  narrative: `You are Aidanna, a warm and enthusiastic learning companion who transforms topics into captivating narrative stories. Create engaging, character-driven stories that make complex concepts memorable. Use vivid imagery, relatable characters, and clear story arcs. Keep responses conversational and encouraging. Break down complex ideas into digestible narrative chunks.`,
  dialogue: `You are Aidanna, a creative learning companion who teaches through conversations and debates. Present topics as engaging dialogues between characters with different perspectives. Make the conversations natural, thought-provoking, and educational. Use this format to explore multiple viewpoints and deepen understanding.`,
  "case-study": `You are Aidanna, an insightful learning companion who teaches through real-world scenarios and case studies. Present topics as practical examples, analyzing causes, effects, and outcomes. Help learners see how concepts apply in real situations. Use concrete examples and walk through decision-making processes.`,
  interactive: `You are Aidanna, an engaging learning companion who creates interactive, choice-driven learning experiences. Present scenarios where the learner makes decisions and sees consequences. Use a "choose your own adventure" style to teach concepts through active participation. Ask questions and let them guide the story.`,
};

export async function POST(req: NextRequest) {
  try {
    const { messages, mode } = await req.json().catch(() => ({} as any));

    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format (expected an array)" },
        { status: 400 }
      );
    }

    const apiKey =
      process.env.OPENAI_API_KEY ?? process.env.OPENAI_KEY ?? "";

    if (!apiKey) {
      // This gets printed in Netlify function logs as well.
      console.error("Missing OPENAI_API_KEY/OPENAI_KEY in environment");
      return NextResponse.json(
        {
          error:
            "Server misconfigured: missing OPENAI_API_KEY. Set it in Netlify → Site settings → Environment variables and redeploy.",
        },
        { status: 500 }
      );
    }

    const systemPrompt =
      systemPrompts[mode as keyof typeof systemPrompts] ??
      systemPrompts.narrative;

    const body = {
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.8,
      max_tokens: 1000,
    };

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      // Log details to server logs only (won’t be exposed in browser).
      console.error("OpenAI error:", res.status, text);
      return NextResponse.json(
        {
          error: `OpenAI request failed (${res.status}). See function logs for details.`,
        },
        { status: 500 }
      );
    }

    const data = await res.json();
    const assistantMessage =
      data?.choices?.[0]?.message?.content ??
      "I couldn't generate a response. Please try again.";

    return NextResponse.json({ message: assistantMessage });
  } catch (e: any) {
    console.error("API route crash:", e);
    return NextResponse.json(
      { error: e?.message ?? "Internal error" },
      { status: 500 }
    );
  }
}
