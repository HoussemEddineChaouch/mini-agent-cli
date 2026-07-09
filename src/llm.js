const { GoogleGenAI } = require("@google/genai");
require("dotenv").config({ quiet: true });

async function askLLM(messages) {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
    console.error("\x1b[31mError: GEMINI_API_KEY is not configured.\x1b[0m\n  Copy \x1b[33m.env.example\x1b[0m to \x1b[33m.env\x1b[0m and add your API key from \x1b[34mhttps://aistudio.google.com/app/apikey\x1b[0m");
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  try {
    const contents = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [
        {
          text: msg.content,
        },
      ],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    return response.text;
  } catch (error) {
    return "Something went wrong, please try again.";
  }
}

module.exports = { askLLM };
