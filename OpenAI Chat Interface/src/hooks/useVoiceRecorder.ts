import { useState, useRef } from "react";
import { transcribeAudio } from "../services/sttService";

interface UseVoiceRecorderOptions {
  apiKey: string;
  onNeedApiKey: () => void;
}

interface UseVoiceRecorderReturn {
  isRecording: boolean;
  isTranscribing: boolean;
  speechError: string | null;
  clearSpeechError: () => void;
  handleVoiceToggle: (onTranscribed: (text: string) => void) => Promise<void>;
}

export const useVoiceRecorder = ({
  apiKey,
  onNeedApiKey,
}: UseVoiceRecorderOptions): UseVoiceRecorderReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleVoiceToggle = async (
    onTranscribed: (text: string) => void,
  ): Promise<void> => {
    // Stop recording
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    setSpeechError(null);

    if (!apiKey) {
      onNeedApiKey();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const audioFile = new File([audioBlob], "recording.webm", {
          type: "audio/webm",
        });
        try {
          setIsTranscribing(true);
          const text = await transcribeAudio(audioFile, apiKey);
          onTranscribed(text);
        } catch (err) {
          setSpeechError(
            err instanceof Error ? err.message : "Transcription failed",
          );
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      setSpeechError("Microphone access denied");
    }
  };

  return {
    isRecording,
    isTranscribing,
    speechError,
    clearSpeechError: () => setSpeechError(null),
    handleVoiceToggle,
  };
};