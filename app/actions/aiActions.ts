"use server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

export interface MessagePayload {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  success: boolean;
  text: string;
  suggestions: string[];
  error?: string;
}

const SYSTEM_INSTRUCTION = `You are Nebula, a sophisticated Personal Intelligence AI.
Your personality is calm, clear, insightful, elegant, and deeply knowledgeable.
Your responses should be well-structured, modern, concise, and helpful.
Use clean markdown formatting when helpful (bullet points, bold highlights, short paragraphs).
At the very end of your response, on a new line, always provide 3 short, relevant follow-up suggestion chips separated by pipe characters in the format:
[SUGGESTIONS]: Suggestion 1 | Suggestion 2 | Suggestion 3
Make sure the suggestions are brief (2-4 words) and directly relevant to continuing the conversation.`;

export async function generateChatAction(
  history: MessagePayload[],
  userPrompt: string
): Promise<ChatResponse> {
  try {
    // Format conversation history for Gemini
    const contents = history.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Add current user prompt
    contents.push({
      role: "user",
      parts: [{ text: userPrompt }],
    });

    let rawOutput = "";

    // Primary: try gemini-2.5-flash with generateContent
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });
      rawOutput = response.text || "";
    } catch (modelErr) {
      console.warn("Falling back to gemini-3.5-flash interaction:", modelErr);
      // Fallback: try interactions API
      const interaction = await ai.interactions.create({
        model: "gemini-3.5-flash",
        input: `${SYSTEM_INSTRUCTION}\n\nUser request: ${userPrompt}`,
      });
      rawOutput = interaction.output_text || "";
    }

    if (!rawOutput) {
      throw new Error("No response received from Nebula intelligence core.");
    }

    // Extract suggestions if present
    let cleanText = rawOutput;
    let suggestions = ["Morning routine", "Focus techniques", "Daily goals"];

    const suggestionMatch = rawOutput.match(/\[SUGGESTIONS\]:\s*(.+)$/m);
    if (suggestionMatch && suggestionMatch[1]) {
      const parsed = suggestionMatch[1]
        .split("|")
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && s.length < 30);
      if (parsed.length >= 2) {
        suggestions = parsed.slice(0, 3);
      }
      cleanText = rawOutput.replace(/\[SUGGESTIONS\]:\s*.+$/m, "").trim();
    }

    return {
      success: true,
      text: cleanText,
      suggestions: suggestions,
    };
  } catch (err: unknown) {
    console.error("Nebula AI generation error:", err);
    const message = err instanceof Error ? err.message : "Unknown error occurred";
    return {
      success: false,
      text: "I experienced a brief disruption connecting to the neural core. Let's try again in a moment.",
      suggestions: ["Retry question", "Check system status", "Plan morning routine"],
      error: message,
    };
  }
}