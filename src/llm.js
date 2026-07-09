const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function askLLM(messages) {
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
