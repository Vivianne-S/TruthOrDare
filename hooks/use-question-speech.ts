/**
 * Text-to-speech hook for reading questions aloud via expo-speech.
 * Auto-speaks when text changes (if enabled); exposes speak() for manual replay.
 */
import { useEffect } from "react";
import * as Speech from "expo-speech";

type UseQuestionSpeechOptions = {
  text?: string | null;
  enabled: boolean;
  language?: string;
  pitch?: number;
  rate?: number;
};

export function useQuestionSpeech({
  text,
  enabled,
  language = "en-US",
  pitch = 1.0,
  rate = 1.0,
}: UseQuestionSpeechOptions) {
  useEffect(() => {
    if (!text || !enabled) {
      Speech.stop();
      return;
    }

    Speech.stop();
    Speech.speak(text, {
      language,
      pitch,
      rate,
    });

    return () => {
      Speech.stop();
    };
  }, [text, enabled, language, pitch, rate]);

  const speak = () => {
    if (!text || !enabled) return;

    Speech.stop();
    Speech.speak(text, {
      language,
      pitch,
      rate,
    });
  };

  const stop = () => {
    Speech.stop();
  };

  return { speak, stop };
}

