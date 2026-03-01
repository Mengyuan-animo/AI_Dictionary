export type Language = {
  code: string;
  name: string;
  ttsCode: string;
};

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', ttsCode: 'en-US' },
  { code: 'zh', name: 'Mandarin Chinese', ttsCode: 'zh-CN' },
  { code: 'es', name: 'Spanish', ttsCode: 'es-ES' },
  { code: 'fr', name: 'French', ttsCode: 'fr-FR' },
  { code: 'ar', name: 'Arabic', ttsCode: 'ar-SA' },
  { code: 'ru', name: 'Russian', ttsCode: 'ru-RU' },
  { code: 'pt', name: 'Portuguese', ttsCode: 'pt-BR' },
  { code: 'ur', name: 'Urdu', ttsCode: 'ur-PK' },
  { code: 'ja', name: 'Japanese', ttsCode: 'ja-JP' },
  { code: 'ko', name: 'Korean', ttsCode: 'ko-KR' },
];

export interface DictionaryResult {
  id: string;
  query: string;
  targetLang: string;
  nativeLang: string;
  word: string;
  explanation: string;
  examples: {
    target: string;
    native: string;
  }[];
  usage: string;
  imageUrl?: string;
  imagePrompt: string;
  createdAt: number;
}

export interface StoryResult {
  storyTarget: string;
  storyNative: string;
}
