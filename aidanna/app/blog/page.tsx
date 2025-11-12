"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "../components/Footer";

export default function BlogPost() {
  return (
    <><div style={{ minHeight: "100vh", background: "#fafafa" }}>
          {/* Header */}
          <header style={{
              background: "#fff",
              borderBottom: "1px solid #e5e7eb",
              padding: "1rem 0",
              position: "sticky",
              top: 0,
              zIndex: 100,
          }}>
              <div style={{
                  maxWidth: "1200px",
                  margin: "0 auto",
                  padding: "0 1.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
              }}>
                  <Link href="/" style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      textDecoration: "none",
                      color: "#1f2937",
                  }}>
                      <Image src="/logo.png" alt="Aidanna" width={32} height={32} style={{ borderRadius: 8 }} />
                      <span style={{ fontSize: "1.25rem", fontWeight: 700 }}>Aidanna</span>
                  </Link>

                  <nav style={{ display: "flex", gap: "2rem" }}>
                      <Link href="/" style={{ color: "#6b7280", textDecoration: "none", fontWeight: 500 }}>Home</Link>
                      <Link href="/app" style={{ color: "#6b7280", textDecoration: "none", fontWeight: 500 }}>Try Now</Link>
                  </nav>
              </div>
          </header>

          {/* Blog Content */}
          <article style={{
              maxWidth: "800px",
              margin: "0 auto",
              padding: "3rem 1.5rem",
          }}>
              {/* Meta */}
              <div style={{ marginBottom: "2rem", textAlign: "center" }}>
                  <span style={{
                      display: "inline-block",
                      padding: "0.375rem 1rem",
                      borderRadius: "9999px",
                      background: "#faf5ff",
                      color: "#9333ea",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      marginBottom: "1rem",
                  }}>
                      Education
                  </span>
                  <h1 style={{
                      fontSize: "2.5rem",
                      fontWeight: 900,
                      lineHeight: 1.2,
                      marginBottom: "1rem",
                      color: "#1f2937",
                  }}>
                      Why Stories Make Learning 10x More Effective
                  </h1>
                  <p style={{ color: "#6b7280", fontSize: "1.125rem" }}>
                      By Aidanna Team · November 10, 2025 · 8 min read
                  </p>
              </div>

              {/* Cover Image */}
              <div style={{
                  width: "100%",
                  height: "400px",
                  borderRadius: "1rem",
                  background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
                  marginBottom: "3rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "3rem",
              }}>
                  📚
              </div>

              {/* Article Body */}
              <div style={{
                  fontSize: "1.125rem",
                  lineHeight: 1.8,
                  color: "#374151",
              }}>
                  <p style={{ marginBottom: "1.5rem" }}>
                      Have you ever wondered why you can vividly remember a story your grandmother told you 20 years ago, but struggle to recall what you studied last week? The answer lies in how our brains are fundamentally wired.
                  </p>

                  <p style={{ marginBottom: "1.5rem" }}>
                      Research shows that information wrapped in narrative is <strong>22 times more memorable</strong> than facts alone. This isn't just a coincidence—it's neuroscience.
                  </p>

                  <h2 style={{
                      fontSize: "1.875rem",
                      fontWeight: 700,
                      marginTop: "2.5rem",
                      marginBottom: "1rem",
                      color: "#1f2937",
                  }}>
                      The Science Behind Story-Based Learning
                  </h2>

                  <p style={{ marginBottom: "1.5rem" }}>
                      When you read dry facts, only two areas of your brain activate: the language processing centers. But when you read a story, everything lights up. Your motor cortex activates when characters move. Your sensory cortex fires when they experience touch, taste, or smell. Your emotional centers engage with their struggles and victories.
                  </p>

                  <p style={{ marginBottom: "1.5rem" }}>
                      Dr. Paul Zak, a neuroeconomist at Claremont Graduate University, discovered that character-driven stories cause the brain to release <strong>oxytocin</strong>—the "empathy chemical" that makes us care about others and remember their experiences as if they were our own.
                  </p>

                  <blockquote style={{
                      borderLeft: "4px solid #9333ea",
                      paddingLeft: "1.5rem",
                      margin: "2rem 0",
                      fontStyle: "italic",
                      color: "#6b7280",
                      fontSize: "1.25rem",
                  }}>
                      "Stories are the most powerful delivery tool for information, more powerful and memorable than any other way of packaging it."
                  </blockquote>

                  <h2 style={{
                      fontSize: "1.875rem",
                      fontWeight: 700,
                      marginTop: "2.5rem",
                      marginBottom: "1rem",
                      color: "#1f2937",
                  }}>
                      Why Traditional Learning Falls Short
                  </h2>

                  <p style={{ marginBottom: "1.5rem" }}>
                      Traditional education often presents information as isolated facts and figures. When you read "Photosynthesis is the process by which plants convert light energy into chemical energy," your brain treats it as abstract data to be memorized.
                  </p>

                  <p style={{ marginBottom: "1.5rem" }}>
                      But what if instead, you followed Maya, a young leaf on an oak tree, as she wakes up hungry at dawn? You experience her stretching toward the sun, feeling the warmth on her surface, opening her tiny pores called stomata to breathe in carbon dioxide. You're there as she transforms light into glucose, creating food not just for herself but for the entire tree.
                  </p>

                  <p style={{ marginBottom: "1.5rem" }}>
                      Which version will you remember next week? Next month? Next year?
                  </p>

                  <h2 style={{
                      fontSize: "1.875rem",
                      fontWeight: 700,
                      marginTop: "2.5rem",
                      marginBottom: "1rem",
                      color: "#1f2937",
                  }}>
                      The Four Elements of Memorable Stories
                  </h2>

                  <p style={{ marginBottom: "1rem" }}>
                      Effective educational stories share four key elements:
                  </p>

                  <ol style={{
                      marginLeft: "2rem",
                      marginBottom: "1.5rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                  }}>
                      <li>
                          <strong>Relatable Characters:</strong> Whether it's a water droplet, a historical figure, or an AI algorithm personified, characters give us an emotional anchor.
                      </li>
                      <li>
                          <strong>Conflict and Resolution:</strong> Every good story has tension. This keeps your brain engaged and predicting what happens next.
                      </li>
                      <li>
                          <strong>Sensory Details:</strong> The smell of fresh bread, the sound of thunder, the feeling of cold water—sensory information creates vivid mental images.
                      </li>
                      <li>
                          <strong>Emotional Journey:</strong> We remember how stories make us feel long after we forget the facts.
                      </li>
                  </ol>

                  <h2 style={{
                      fontSize: "1.875rem",
                      fontWeight: 700,
                      marginTop: "2.5rem",
                      marginBottom: "1rem",
                      color: "#1f2937",
                  }}>
                      Real-World Impact
                  </h2>

                  <p style={{ marginBottom: "1.5rem" }}>
                      A Stanford study found that students who learned through story-based methods scored <strong>65% higher</strong> on retention tests compared to those who used traditional textbook learning. More impressively, they could apply their knowledge to new situations—true understanding, not just memorization.
                  </p>

                  <p style={{ marginBottom: "1.5rem" }}>
                      Medical schools now use narrative medicine, teaching complex diseases through patient stories. Business schools use case studies—essentially stories of real companies facing real challenges. Even military training increasingly relies on scenario-based learning.
                  </p>

                  <h2 style={{
                      fontSize: "1.875rem",
                      fontWeight: 700,
                      marginTop: "2.5rem",
                      marginBottom: "1rem",
                      color: "#1f2937",
                  }}>
                      The Future of Learning
                  </h2>

                  <p style={{ marginBottom: "1.5rem" }}>
                      With AI technology, we can now create personalized stories tailored to your interests, learning style, and pace. Want to learn quantum physics through a detective story? Economics through a fantasy adventure? The future of education is here, and it speaks in the ancient language of stories.
                  </p>

                  <p style={{ marginBottom: "1.5rem" }}>
                      At Aidanna, we believe that every concept, no matter how complex, can become an unforgettable story. Because when learning feels like storytelling, it stops feeling like work—and that's when true mastery begins.
                  </p>

                  <div style={{
                      marginTop: "3rem",
                      padding: "2rem",
                      borderRadius: "1rem",
                      background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
                      textAlign: "center",
                  }}>
                      <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
                          Ready to experience story-based learning?
                      </h3>
                      <p style={{ marginBottom: "1.5rem", color: "#6b7280" }}>
                          Transform any topic into an engaging story that you'll actually remember.
                      </p>
                      <Link
                          href="/app"
                          style={{
                              display: "inline-block",
                              padding: "0.875rem 2rem",
                              borderRadius: "9999px",
                              background: "#9333ea",
                              color: "#fff",
                              fontWeight: 700,
                              textDecoration: "none",
                              transition: "transform 0.2s",
                          }}
                          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                      >
                          Try Aidanna Free
                      </Link>
                  </div>
              </div>

              {/* Share Section */}


          </article>
      </div><Footer /></>
  );
}