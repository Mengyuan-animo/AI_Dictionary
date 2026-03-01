import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import { DictionaryResult, StoryResult } from '../types';

const getAi = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is missing');
  return new GoogleGenAI({ apiKey });
};

export const lookupWord = async (
  query: string,
  targetLang: string,
  nativeLang: string
): Promise<Omit<DictionaryResult, 'id' | 'createdAt' | 'imageUrl'>> => {
  const ai = getAi();
  const prompt = `
You are a fun, energetic, and highly knowledgeable language tutor.
The user wants to learn the following word/phrase/sentence: "${query}"
Target Language: ${targetLang}
Native Language: ${nativeLang}

IMPORTANT: The user's input might contain spelling errors. Please automatically correct any spelling mistakes in the target language before providing the explanation.

Provide a comprehensive but engaging explanation.
Return a JSON object with the following structure:
{
  "word": "The exact word/phrase/sentence translated to or corrected in the target language.",
  "explanation": "A natural language explanation of the meaning in the native language.",
  "examples": [
    {
      "target": "Example sentence 1 in the target language",
      "native": "Translation of example 1 in the native language"
    },
    {
      "target": "Example sentence 2 in the target language",
      "native": "Translation of example 2 in the native language"
    }
  ],
  "usage": "A casual, fun, friend-like usage explanation in the native language. Cover cultural context, scenarios, tone, related/confusing words and differences. Avoid textbook style, be concise and direct.",
  "imagePrompt": "A detailed prompt in English to generate an image that visually represents this concept. Keep it safe, illustrative, and vibrant."
}
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          explanation: { type: Type.STRING },
          examples: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                target: { type: Type.STRING },
                native: { type: Type.STRING },
              },
              required: ['target', 'native'],
            },
          },
          usage: { type: Type.STRING },
          imagePrompt: { type: Type.STRING },
        },
        required: ['word', 'explanation', 'examples', 'usage', 'imagePrompt'],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error('Failed to generate explanation');
  return JSON.parse(text);
};

export const generateImage = async (prompt: string): Promise<string> => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `Create a vibrant, fun, and illustrative image for a language learning app based on this concept: ${prompt}` }],
    },
    config: {
      imageConfig: {
        aspectRatio: '1:1',
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error('Failed to generate image');
};

export const generateStory = async (
  words: string[],
  targetLang: string,
  nativeLang: string
): Promise<StoryResult> => {
  const ai = getAi();
  const prompt = `
Write a short, engaging, and creative story that uses all of the following words/phrases:
${words.join(', ')}

Target Language: ${targetLang}
Native Language: ${nativeLang}

The story should be fun and memorable to help the user remember the vocabulary.
Return a JSON object with the following structure:
{
  "storyTarget": "The story written in the target language",
  "storyNative": "The translation of the story in the native language"
}
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          storyTarget: { type: Type.STRING },
          storyNative: { type: Type.STRING },
        },
        required: ['storyTarget', 'storyNative'],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error('Failed to generate story');
  return JSON.parse(text);
};

export const createChatSession = (word: string, targetLang: string, nativeLang: string) => {
  const ai = getAi();
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      systemInstruction: `You are a friendly language tutor helping a student learn the word/phrase "${word}" in ${targetLang}. The student's native language is ${nativeLang}. Answer their questions about this word, its usage, grammar, or related concepts. Keep your answers concise, fun, and encouraging. Reply in ${nativeLang} mostly, but use ${targetLang} for examples.`,
    },
  });
};
