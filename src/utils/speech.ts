// Speech synthesis helper for audio table read
export class SpeechService {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;

  public static speak(text: string, onEnd?: () => void, onError?: () => void) {
    if (!this.synth) return;

    this.stop();

    // Clean text from bracketed stage directions like [Texto] or [Pausa]
    const cleanText = text.replace(/\[.*?\]/g, '').replace(/VALENTINA.*?:/g, 'Dice Valentina:').replace(/DON CARLOS.*?:/g, 'Dice Don Carlos:');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-CO'; // Colombian Spanish preferred
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick Spanish voice if available
    const voices = this.synth.getVoices();
    const esVoice = voices.find(v => v.lang.startsWith('es-') || v.lang === 'es');
    if (esVoice) {
      utterance.voice = esVoice;
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.currentUtterance = null;
      if (onError) onError();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public static stop() {
    if (!this.synth) return;
    this.synth.cancel();
    this.currentUtterance = null;
  }

  public static isSpeaking(): boolean {
    return !!this.synth && this.synth.speaking;
  }
}
