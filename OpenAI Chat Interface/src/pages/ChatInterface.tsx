import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";

import ApiKeyModal from "../components/ApiKeyModal";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { buildColorTokens } from "../theme/colorTokens";
import ErrorSnackbar from "../common/ErrorSnackbar";
import MessageList from "../components/MessageList";
import InputArea from "../components/InputArea";

import { useChatSend } from "../hooks/useChatSend";
import { useVoiceRecorder } from "../hooks/useVoiceRecorder";
import { makeStyles } from "../hooks/makeStyles";

import {
  loadMessages,
  loadApiKey,
  loadSelectedModel,
  saveMessages,
  saveApiKey,
  saveSelectedModel,
  clearMessages,
} from "../utils/storageHelper";
import { cancelAllReminders } from "../services/reminderService";
import type { Message } from "../types/types";

const useStyles = makeStyles((theme) => ({
  root: { display: "flex", flexDirection: "column", height: "100vh" },
  body: { display: "flex", flex: 1, overflow: "hidden" },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    position: "relative",
  },
}));

const ChatInterface: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const c = buildColorTokens(isDark);

  // State
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState(loadApiKey);
  const [showApiInput, setShowApiInput] = useState(!loadApiKey());
  const [selectedModel, setSelectedModel] = useState(loadSelectedModel);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isSpeechSupported = !!navigator?.mediaDevices?.getUserMedia;

  // Persist messages
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  // Handlers
  const handleSaveApiKey = (trimmed: string) => {
    saveApiKey(trimmed);
    setApiKey(trimmed);
    setShowApiInput(false);
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    saveSelectedModel(model);
  };

  const handleClearChat = () => {
    clearMessages();
    setMessages([]);
    setError(null);
    cancelAllReminders();
  };

  // Hooks
  const { handleSend } = useChatSend({
    apiKey,
    selectedModel,
    messages,
    onNeedApiKey: () => setShowApiInput(true),
    setMessages,
    setIsLoading,
    setError,
    setInputText,
  });

  const {
    isRecording,
    isTranscribing,
    speechError,
    clearSpeechError,
    handleVoiceToggle,
  } = useVoiceRecorder({
    apiKey,
    onNeedApiKey: () => setShowApiInput(true),
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputText);
    }
  };

  const canSend = !!inputText.trim() && !isLoading;

  // Render
  return (
    <div className={classes.root} style={{ backgroundColor: c.bg }}>
      <Navbar
        c={c}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        apiKey={apiKey}
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
        onModelError={setError}
      />

      <div className={classes.body}>
        <Sidebar
          sidebarOpen={sidebarOpen}
          apiKey={apiKey}
          onNewChat={handleClearChat}
          onClearHistory={handleClearChat}
          onOpenApiKey={() => setShowApiInput(true)}
        />

        <div className={classes.main} style={{ backgroundColor: c.bg }}>
          {showApiInput && (
            <ApiKeyModal
              currentApiKey={apiKey}
              onSave={handleSaveApiKey}
              onClose={() => setShowApiInput(false)}
            />
          )}

          <MessageList
            messages={messages}
            isLoading={isLoading}
            selectedModel={selectedModel}
            isSpeechSupported={isSpeechSupported}
          />

          <InputArea
            inputText={inputText}
            onChangeInput={setInputText}
            onSend={() => handleSend(inputText)}
            onVoiceToggle={() =>
              handleVoiceToggle((text) => setInputText(text))
            }
            onKeyDown={handleKeyDown}
            isLoading={isLoading}
            isRecording={isRecording}
            isTranscribing={isTranscribing}
            canSend={canSend}
            isSpeechSupported={isSpeechSupported}
            navBorder={c.navBorder}
            bg={c.bg}
          />
        </div>
      </div>

      <ErrorSnackbar message={error} onDismiss={() => setError(null)} />
      <ErrorSnackbar message={speechError} onDismiss={clearSpeechError} />
    </div>
  );
};

export default ChatInterface;
