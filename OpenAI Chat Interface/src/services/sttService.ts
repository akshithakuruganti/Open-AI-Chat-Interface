const STT_MODEL = "whisper-1";
const LITELLM_BASE_URL = import.meta.env.VITE_LITELLM_BASE_URL;

export async function transcribeAudio(
  audioFile: File,
  apiKey: string,
): Promise<string> {
  const formData = new FormData();
  formData.append("file", audioFile, audioFile.name);
  formData.append("model", STT_MODEL);
  formData.append("response_format", "verbose_json");

  const res = await fetch(LITELLM_BASE_URL + "/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error("Whisper STT " + res.status + ": " + errText);
  }

  const data = await res.json();

  return (data.text ?? "").trim();
}