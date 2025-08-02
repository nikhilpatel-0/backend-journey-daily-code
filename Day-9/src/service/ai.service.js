const { GoogleGenAI } = require("@google/genai");

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});
async function generateCaption(base64ImageFile) {
  const contents = [
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64ImageFile,
      },
    },
    { text: "Caption this image." },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
    config: {
      systemInstruction: `You are a creative and engaging social media content generator.
       Your job is to generate short, emotional,
       and relatable captions with emoji based on an input image or image description.
       The caption should be optimized for Instagram and must sound like it's written by a real human,
       not AI. Keep it between 5–15 words.
       Use a tone that matches the emotion or vibe of the image (e.g., motivational, romantic, funny, aesthetic).
       Do not use hashtags in the caption. The caption must be in simple, casual English or Hinglish,
       depending on the context. Always try to evoke a feeling or trigger engagement.
       Think like a modern-day Instagram creator
       you generate captions with hastag for Instagram posts.
       create captions in tapori language.
       caption should be in dark humor style.`,
    },
  });
  return response.text;
}

module.exports = generateCaption;
