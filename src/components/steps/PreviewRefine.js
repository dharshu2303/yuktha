"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "@/context/LanguageContext";
import useVoiceRecognition from "@/hooks/useVoiceRecognition";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";

export default function PreviewRefine({
  previewContent,
  publishedContent,
  previewData,
  publishedData,
  onPublish,
  onContentUpdate,
}) {
  const { t, language, speechLocale } = useTranslation();
  const { isListening, transcript, startListening, stopListening, isSupported, setTranscript } = useVoiceRecognition(speechLocale);
  
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [selectedComponentText, setSelectedComponentText] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [currentPreview, setCurrentPreview] = useState(previewContent);
  const [currentPublished, setCurrentPublished] = useState(publishedContent);
  const [currentPreviewData, setCurrentPreviewData] = useState(previewData);
  const [currentPublishedData, setCurrentPublishedData] = useState(publishedData);
  const [editMode, setEditMode] = useState(false);
  const chatEndRef = useRef(null);
  const iframeRef = useRef(null);

  // Sync voice transcript to input text
  useEffect(() => {
    if (isListening && transcript !== undefined) {
      setInputText(transcript);
    }
  }, [transcript, isListening]);

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      setTranscript("");
      setInputText("");
      startListening();
    }
  };

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Update iframe — inject edit mode script only when edit mode is ON
  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(currentPreview);
        doc.close();
        
        if (editMode) {
          // Inject script AFTER doc.close() using appendChild for reliable multi-edit support
          const script = doc.createElement('script');
          script.textContent = `
            (function() {
              let lastOutline = null;
              document.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Prevent selection of watermark, copyright, or non-editable elements
                if (e.target.closest('[data-no-edit="true"]')) return;
                
                const text = e.target.innerText || e.target.textContent;
                if (text && text.trim().length > 0 && text.trim().length < 200) {
                  if (lastOutline) {
                    lastOutline.style.outline = '';
                    lastOutline.style.boxShadow = '';
                  }
                  e.target.style.outline = '2px solid #6C63FF';
                  e.target.style.boxShadow = '0 0 0 4px rgba(108, 99, 255, 0.2)';
                  e.target.style.borderRadius = '4px';
                  lastOutline = e.target;
                  
                  window.parent.postMessage({ type: 'ELEMENT_CLICKED', text: text.trim() }, '*');
                }
              });
            })();
          `;
          doc.body.appendChild(script);
        }
        // In browse mode: no script injected → links, CTA, navbar all work normally
      }
    }
  }, [currentPreview, editMode]);

  // Listen for iframe clicks (edit mode only)
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'ELEMENT_CLICKED') {
        setSelectedComponentText(event.data.text);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() || isRefining) return;

    if (isListening) stopListening();

    const baseMessage = inputText.trim();
    const finalUserMessage = selectedComponentText 
      ? `Regarding the section containing "${selectedComponentText}": ${baseMessage}`
      : baseMessage;

    setInputText("");
    setTranscript("");
    
    setMessages((prev) => [...prev, { role: "user", content: baseMessage }]);
    setIsRefining(true);

    try {
      const response = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          previewData: currentPreviewData,
          publishedData: currentPublishedData,
          userMessage: finalUserMessage,
          language,
        }),
      });

      if (!response.ok) throw new Error("Refine failed");

      const data = await response.json();
      
      // Live update — immediately set new preview content to trigger iframe re-render
      setCurrentPreview(data.updatedPreviewContent);
      setCurrentPublished(data.updatedPublishedContent);
      setCurrentPreviewData(data.updatedPreviewData);
      setCurrentPublishedData(data.updatedPublishedData);
      
      // Propagate updates to parent for publish
      onContentUpdate?.(
        data.updatedPreviewContent, 
        data.updatedPublishedContent,
        data.updatedPreviewData,
        data.updatedPublishedData
      );

      setMessages((prev) => [
        ...prev,
        { role: "ai", content: data.aiMessage || "✓" },
      ]);
      
      // Clear selected component after successful edit
      setSelectedComponentText("");
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
          <Card className="lg:col-span-3 overflow-hidden relative">
            <div className="p-3 border-b border-border flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-label text-text-secondary">
                {t("previewLabel")}
              </span>
              {/* Edit Mode Toggle */}
              <button
                onClick={() => {
                  setEditMode(!editMode);
                  if (editMode) setSelectedComponentText("");
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  editMode
                    ? "bg-accent text-white shadow-md"
                    : "bg-background-alt text-text-secondary hover:bg-accent/10 hover:text-accent border border-border"
                }`}
                title={editMode ? t("switchToBrowse") : t("switchToEdit")}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                {editMode ? t("editingBtn") : t("editBtn")}
              </button>
            </div>
            <div className="bg-background-alt relative">
              {/* Edit mode indicator overlay */}
              {editMode && (
                <div className="absolute top-2 left-2 right-2 z-10 bg-accent/90 text-white text-xs text-center py-1.5 px-3 rounded-lg font-medium shadow-md backdrop-blur-sm">
                  {t("clickToEdit")}
                </div>
              )}
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

            {/* Selected Component Chip */}
            {selectedComponentText && (
              <div className="px-3 pb-2 border-t border-border pt-2 bg-background-alt flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden text-sm text-accent bg-accent/10 px-3 py-1.5 rounded-full max-w-full">
                  <span className="truncate font-medium flex-1">
                    Context: &quot;{selectedComponentText}&quot;
                  </span>
                  <button 
                    onClick={() => setSelectedComponentText("")}
                    className="flex-shrink-0 hover:bg-black/10 rounded-full p-0.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Chat Input */}
            <div className="p-3 border-t border-border">
              <div className="flex gap-2 items-center">
                {isSupported && (
                  <button
                    onClick={handleVoiceToggle}
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isListening
                        ? "bg-accent text-white mic-pulse"
                        : "bg-background-alt text-text-secondary hover:bg-accent/10 hover:text-accent"
                    }`}
                    title={isListening ? t("listening") : t("tapToSpeak")}
                  >
                     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z" />
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                      </svg>
                  </button>
                )}
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    if (isListening) setTranscript(e.target.value);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={isListening ? t("listening") : t("refinePlaceholder")}
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
