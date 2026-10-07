import {
  AiChatWidget,
  SUPPORTED_LANGUAGES,
  LanguageOption,
} from "./dossier/AiChatWidget";
import { sanitizeChatText } from "../utils/naturalSpeech";

export { sanitizeChatText, SUPPORTED_LANGUAGES, AiChatWidget };
export type { LanguageOption };

/**
 * ChatPanel component alias for AiChatWidget with sanitized text formatting
 * and enhanced natural Web Speech synthesis.
 */
export const ChatPanel = AiChatWidget;
export default ChatPanel;
