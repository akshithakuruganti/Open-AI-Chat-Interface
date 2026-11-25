export async function synthesizeSpeech(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new Error("Web Speech API not supported in this browser"));
      return;
    }

    const cleanText = (() => {
      const lines = text.split("\n");
      const songLines = lines.filter((line) => line.trim().startsWith("♪"));
      let songText = songLines.join("\n");
      if (!songText) songText = text;
      return songText
        .replace(/\[.*?\]/g, "")
        .replace(/[♪♫]/g, "")
        .replace(/\*+/g, "")
        .replace(/#+\s/g, "")
        .replace(
          /\((?:Verse|Chorus|Bridge|Intro|Outro|Pre-Chorus|Post-Chorus)\s*\d*\)/gi,
          "",
        )
        .trim();
    })();

    window.speechSynthesis.cancel();

    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.88;
      utterance.pitch = 1.1;
      utterance.volume = 1;

      const voices = window.speechSynthesis.getVoices();
      const preferred =
        voices.find(
          (v) =>
            v.lang.startsWith("en") && v.name.toLowerCase().includes("female"),
        ) ||
        voices.find((v) => v.lang.startsWith("en")) ||
        voices[0];
      if (preferred) utterance.voice = preferred;

      utterance.onend = () => resolve();
      utterance.onerror = (e) => reject(new Error("Speech error: " + e.error));

      window.speechSynthesis.speak(utterance);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      speak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        speak();
      };
    }
  });
}