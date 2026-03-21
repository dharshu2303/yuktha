"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslation } from "@/context/LanguageContext";

export default function AIGeneration({ cardImage, voiceText, onComplete, onError }) {
  const { t, language } = useTranslation();
  const [messageIndex, setMessageIndex] = useState(0);
  const [statusText, setStatusText] = useState("");
  const hasStarted = useRef(false);

  const messages = [t("loadingMsg1"), t("loadingMsg2"), t("loadingMsg3")];

  // Rotate messages every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [messages.length]);

  // Make API call with smart retry
  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const MAX_RETRIES = 3;

    const generate = async () => {
      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
          const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cardImageBase64: cardImage,
              voiceText: voiceText || "",
              language: language,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            onComplete(data);
            return;
          }

          // Handle rate limiting
          if (response.status === 429) {
            const waitTime = Math.min(30 + attempt * 30, 90);
            setStatusText(
              `Rate limited. Retrying in ${waitTime}s... (${attempt + 1}/${MAX_RETRIES})`
            );
            await new Promise((r) => setTimeout(r, waitTime * 1000));
            continue;
          }

          // Other errors
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `API error: ${response.status}`
          );
        } catch (error) {
          if (attempt === MAX_RETRIES - 1) {
            onError(error);
            return;
          }
          // Wait before retry on network errors
          setStatusText(`Retrying... (${attempt + 2}/${MAX_RETRIES})`);
          await new Promise((r) => setTimeout(r, 5000));
        }
      }
    };

    generate();
  }, [cardImage, voiceText, language, onComplete, onError]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center animate-fade-in">
        {/* Animated Logo */}
        <div className="inline-flex items-center justify-center mb-8 logo-pulse shadow-lg rounded-3xl overflow-hidden bg-white/50 p-2">
          <img src="/logo.png" alt="Yuktha Logo" className="w-16 h-16 object-contain" />
        </div>

        {/* Rotating Message */}
        <div className="h-8 flex items-center justify-center">
          <p
            key={messageIndex}
            className="text-lg text-text-secondary animate-fade-in"
          >
            {messages[messageIndex]}
          </p>
        </div>

        {/* Status Text (rate limit info) */}
        {statusText && (
          <p className="text-sm text-amber-600 mt-2 animate-fade-in">
            {statusText}
          </p>
        )}

        {/* Spinner */}
        <div className="mt-8 flex justify-center">
          <div className="spinner-ring" />
        </div>
      </div>
    </div>
  );
}
