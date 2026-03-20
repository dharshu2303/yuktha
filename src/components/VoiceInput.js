"use client";

import { useTranslation } from "@/context/LanguageContext";
import useVoiceRecognition from "@/hooks/useVoiceRecognition";

export default function VoiceInput({ onTranscriptChange }) {
  const { t, speechLocale, language } = useTranslation();
  const { isListening, transcript, startListening, stopListening, isSupported, setTranscript } =
    useVoiceRecognition(speechLocale);

  // Sync transcript to parent
  const handleToggle = () => {
    if (isListening) {
      stopListening();
      if (transcript && onTranscriptChange) {
        onTranscriptChange(transcript);
      }
    } else {
      startListening();
    }
  };

  const handleTextChange = (e) => {
    setTranscript(e.target.value);
    if (onTranscriptChange) {
      onTranscriptChange(e.target.value);
    }
  };

  // If speech not supported, show text-only input
  if (!isSupported) {
    return (
      <div className="mt-6">
        <label className="block text-[11px] font-medium uppercase tracking-label text-text-secondary mb-2">
          {t("voiceInputLabel")}
        </label>
        <textarea
          rows={3}
          value={transcript}
          onChange={handleTextChange}
          placeholder={t("voiceInputPlaceholder")}
          className="w-full bg-white border-[1.5px] border-border rounded-input px-4 py-3 text-text-primary placeholder:text-text-secondary/50 transition-all duration-200 input-focus-glow focus:outline-none resize-none"
        />
      </div>
    );
  }

  return (
    <div className="mt-6">
      <label className="block text-[11px] font-medium uppercase tracking-label text-text-secondary mb-2">
        {t("voiceInputLabel")}
      </label>

      <div className="flex items-start gap-3">
        {/* Mic Button */}
        <button
          onClick={handleToggle}
          className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
            isListening
              ? "bg-accent text-white mic-pulse"
              : "bg-background-alt text-text-secondary hover:bg-accent/10 hover:text-accent"
          }`}
          aria-label={isListening ? t("listening") : t("tapToSpeak")}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        </button>

        {/* Textarea */}
        <div className="flex-1">
          <textarea
            rows={3}
            value={transcript}
            onChange={handleTextChange}
            placeholder={isListening ? t("listening") : t("voiceInputPlaceholder")}
            className="w-full bg-white border-[1.5px] border-border rounded-input px-4 py-3 text-text-primary placeholder:text-text-secondary/50 transition-all duration-200 input-focus-glow focus:outline-none resize-none text-sm"
          />
          {isListening && (
            <p className="text-xs text-accent mt-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              {t("listening")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
