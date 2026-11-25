const MODELS_URL = import.meta.env.VITE_LITELLM_MODELS_URL;

export interface LLMModel {
  id: string;
  object: string;
  created?: number;
  owned_by?: string;
}

export const fetchModels = async (apiKey: string): Promise<LLMModel[]> => {
  const response = await fetch(MODELS_URL, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const code = errorData.error?.code ?? response.status;

    // Map known error types/codes to safe, user-friendly messages.
    let safeMessage: string;
    if (
      response?.status === 401 ||
      response?.status === 403 ||
      errorData?.error?.type === "token_not_found_in_db" ||
      errorData?.error?.type === "authentication_error"
    ) {
      safeMessage = "Auth error: Please check your API key.";
    } else if (response?.status === 429) {
      safeMessage = "Rate limit exceeded. Please try again later.";
    } else if (response?.status >= 500) {
      safeMessage = "Server error. Please try again later.";
    } else {
      safeMessage = `Failed to fetch models (${code}).`;
    }

    throw new Error(safeMessage);
  }

  const data = await response.json();
  // OpenAI-compatible /v1/models returns { object: "list", data: [...] }
  const models: LLMModel[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : [];

  return models.sort((a, b) => a.id.localeCompare(b.id));
};