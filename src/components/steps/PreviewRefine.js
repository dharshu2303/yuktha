"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "@/context/LanguageContext";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";

export default function PreviewRefine({
  previewContent,
  publishedContent,
  onPublish,
  onContentUpdate,
}) {
  const { t, language } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [currentPreview, setCurrentPreview] = useState(previewContent);
  const [currentPublished, setCurrentPublished] = useState(publishedContent);
  const chatEndRef = useRef(null);
  const iframeRef = useRef(null);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Update iframe
  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(currentPreview);
        doc.close();
      }
    }
  }, [currentPreview]);

  const handleSend = async () => {
    if (!inputText.trim() || isRefining) return;

    const userMessage = inputText.trim();
    setInputText("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsRefining(true);

    try {
      const response = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentContent: currentPreview,
          userMessage,
          language,
        }),
      });

      if (!response.ok) throw new Error("Refine failed");

      const data = await response.json();
      setCurrentPreview(data.updatedPreviewContent);
      setCurrentPublished(data.updatedPublishedContent);
      onContentUpdate?.(data.updatedPreviewContent, data.updatedPublishedContent);

      setMessages((prev) => [
        ...prev,
        { role: "ai", content: data.aiMessage || "✓" },
      ]);
    } catch (error) {
      console.error("Refine error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: t("errorTimeout") },
      ]);
    } finally {
      setIsRefining(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePublish = () => {
    onPublish(currentPublished, currentPreview);
  };

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-6xl mx-auto animate-slide-up">
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-heading text-text-primary">
            {t("step4Title")}
          </h2>
        </div>

        {/* Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Preview (3/5) */}
          <Card className="lg:col-span-3 overflow-hidden">
            <div className="p-3 border-b border-border">
              <span className="text-[11px] font-medium uppercase tracking-label text-text-secondary">
                {t("previewLabel")}
              </span>
            </div>
            <div className="bg-background-alt">
              <iframe
                ref={iframeRef}
                title="Website Preview"
                className="w-full border-0"
                style={{ height: "600px" }}
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </Card>

          {/* Chat (2/5) */}
          <Card className="lg:col-span-2 flex flex-col" style={{ height: "660px" }}>
            <div className="p-3 border-b border-border">
              <span className="text-[11px] font-medium uppercase tracking-label text-text-secondary">
                {t("refineLabel")}
              </span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <p className="text-sm text-text-secondary text-center mt-8 opacity-60">
                  {t("refinePlaceholder")}
                </p>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 text-sm ${
                      msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isRefining && (
                <div className="flex justify-start">
                  <div className="chat-bubble-ai px-4 py-3 flex items-center gap-2">
                    <Spinner size="sm" />
                    <span className="text-sm text-text-secondary">{t("refining")}</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t("refinePlaceholder")}
                  disabled={isRefining}
                  className="flex-1 bg-background-alt border border-border rounded-input px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none input-focus-glow transition-all duration-200"
                />
                <Button
                  variant="primary"
                  onClick={handleSend}
                  disabled={!inputText.trim() || isRefining}
                  className="px-4 py-2.5 text-sm"
                >
                  {t("sendButton")}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Publish Button */}
        <div className="flex justify-end mt-6">
          <Button variant="accent" onClick={handlePublish} className="text-base px-8 py-4">
            {t("publishButton")}
          </Button>
        </div>
      </div>
    </div>
  );
}
