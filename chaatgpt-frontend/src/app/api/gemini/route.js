import { NextResponse } from "next/server";

export async function POST(req) {
  const { messages } = await req.json();

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Using API key:", apiKey);

    const lastMessage = messages[messages.length - 1];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: lastMessage.content }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("Gemini raw response:", JSON.stringify(data, null, 2));

    // Handle multiple possible response structures
    let reply = "No response";

    if (
      data?.candidates &&
      data.candidates[0]?.content?.parts &&
      data.candidates[0].content.parts[0]?.text
    ) {
      reply = data.candidates[0].content.parts[0].text;
    } else if (data?.promptFeedback?.blockReason) {
      reply = `Blocked by safety filters: ${data.promptFeedback.blockReason}`;
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Gemini API error:", err);
    return NextResponse.json({ reply: "Error reaching Gemini API." });
  }
}
