export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  isSong?: boolean;
}
export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  isRecording: boolean;
  error: string | null;
}

export interface ColorTokens {
  bg: string;
  navbar: string;
  navBorder: string;
  navText: string;
  menuIcon: string;
  menuIconHoverText: string;
  menuIconHoverBg: string;
  inputBg: string;
  inputBorder: string;
  inputFocusBorder: string;
  inputFocusShadow: string;
  placeholder: string;
  inputText: string;
  footerText: string;
  scrollThumb: string;
  emptyIconBg: string;
  emptyIconBorder: string;
  emptyTitle: string;
  emptySubtitle: string;
  recordingBg: string;
  recordingBorder: string;
  transcribingBg: string;
  transcribingBorder: string;
  alertBg: string;
  alertText: string;
  alertBorder: string;
  alertIcon: string;
}
