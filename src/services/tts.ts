export const speak = (text: string, langCode: string) => {
  if (!window.speechSynthesis) {
    console.warn('Speech Synthesis API not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langCode;
  utterance.rate = 0.9; // Slightly slower for language learning
  
  // Try to find a natural sounding voice for the language
  const voices = window.speechSynthesis.getVoices();
  const langVoices = voices.filter(v => v.lang.startsWith(langCode.split('-')[0]));
  
  // Prefer Google or premium voices if available
  const preferredVoice = langVoices.find(v => v.name.includes('Google') || v.name.includes('Premium')) || langVoices[0];
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  window.speechSynthesis.speak(utterance);
};

// Ensure voices are loaded
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    // Voices loaded
  };
}
