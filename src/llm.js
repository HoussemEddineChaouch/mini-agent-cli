const { GoogleGenAI } = require("@google/genai");
require("dotenv").config({ quiet: true });

async function askLLM(messages) {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
    return "GEMINI_API_KEY is not configured. Copy .env.example to .env and add your API key from https://aistudio.google.com/app/apikey";
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
