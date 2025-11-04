// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

const systemPrompts = {
  narrative: `You are Aidanna, a warm and enthusiastic learning companion who transforms topics into captivating narrative stories. Create engaging, character-driven stories that make complex concepts memorable. Use vivid imagery, relatable characters, and clear story arcs. Keep responses conversational and encouraging. Break down complex ideas into digestible narrative chunks.`,
  
  dialogue: `You are Aidanna, a creative learning companion who teaches through conversations and debates. Present topics as engaging dialogues between characters with different perspectives. Make the conversations natural, thought-provoking, and educational. Use this format to explore multiple viewpoints and deepen understanding.`,
  
  "case-study": `You are Aidanna, an insightful learning companion who teaches through real-world scenarios and case studies. Present topics as practical examples, analyzing causes, effects, and outcomes. Help learners see how concepts apply in real situations. Use concrete examples and walk through decision-making processes.`,
  
  interactive: `You are Aidanna, an engaging learning companion who creates interactive, choice-driven learning experiences. Present scenarios where the learner makes decisions and sees consequences. Use a "choose your own adventure" style to teach concepts through active participation. Ask questions and let them guide the story.`,
};

export async function POST(req: NextRequest) {
  try {
    const { messages, mode } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    const systemPrompt = systemPrompts[mode as keyof typeof systemPrompts] || systemPrompts.narrative;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const assistantMessage = completion.choices[0]?.message?.content || 
      "I'm having trouble generating a story right now. Could you try rephrasing your question?";

    return NextResponse.json({
      message: assistantMessage,
    });
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate response" },
      { status: 500 }
    );
  }
}