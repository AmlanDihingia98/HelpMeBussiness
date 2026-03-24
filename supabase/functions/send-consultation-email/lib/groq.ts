import type { GroqMessage, GroqResponse } from "./types.ts";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";
const TEMPERATURE = 0.7;
const MAX_TOKENS = 500;

export async function generateAnalysis(
  messages: GroqMessage[],
  apiKey: string
): Promise<{ analysis: string; rawResponse: GroqResponse }> {
  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: TEMPERATURE,
      max_tokens: MAX_TOKENS,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Groq API error (${response.status}): ${errorText.substring(0, 200)}`
    );
  }

  const data: GroqResponse = await response.json();

  if (!data.choices || data.choices.length === 0) {
    throw new Error("Groq returned no choices");
  }

  return {
    analysis: data.choices[0].message.content,
    rawResponse: data,
  };
}
