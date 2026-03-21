"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "@/context/LanguageContext";
import StepProgress from "@/components/ui/StepProgress";
import ErrorCard from "@/components/ui/ErrorCard";
import LanguageSelection from "@/components/steps/LanguageSelection";
import CardCapture from "@/components/steps/CardCapture";
import AIGeneration from "@/components/steps/AIGeneration";
import PreviewRefine from "@/components/steps/PreviewRefine";
import PublishShare from "@/components/steps/PublishShare";

export default function Home() {
  const { t, language } = useTranslation();

  // App state machine
  const [currentStep, setCurrentStep] = useState(0); // Starts at 0 for splash screen
  const [cardData, setCardData] = useState({ cardImage: null, voiceText: "" });
  const [generatedContent, setGeneratedContent] = useState(null);
  const [publishedUrl, setPublishedUrl] = useState("");
  const [localUrl, setLocalUrl] = useState("");
  const [error, setError] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Splash screen transition (Step 0 → 1)
  useEffect(() => {
    if (currentStep === 0) {
      const timer = setTimeout(() => {
        setCurrentStep(1);
      }, 1900);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // Step 1 → 2
  const handleLanguageSelected = useCallback(() => {
    setCurrentStep(2);
  }, []);

  // Step 2 → 3
  const handleCardCaptured = useCallback((data) => {
    setCardData(data);
    setCurrentStep(3);
    setError(null);
  }, []);

  // Step 3 → 4: Generation complete
  const handleGenerationComplete = useCallback((data) => {
    setGeneratedContent(data);
    setCurrentStep(4);
  }, []);

  // Step 3 error
  const handleGenerationError = useCallback((err) => {
    setError(err.message || "Generation failed");
    setCurrentStep(2); // Go back to card capture
  }, []);

  // Update content during refinement
  const handleContentUpdate = useCallback((preview, published, previewData, publishedData) => {
    setGeneratedContent((prev) => ({
      ...prev,
      previewContent: preview,
      publishedContent: published,
      previewData: previewData,
      publishedData: publishedData,
    }));
  }, []);

  // Step 4 → 5: Publish
  const handlePublish = useCallback(
    async (publishedContent, previewContent) => {
      setIsPublishing(true);
      try {
        const response = await fetch("/api/publish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            htmlContent: publishedContent,
            previewContent: previewContent,
            metaTags: generatedContent?.metaTags || {},
          }),
        });

        if (!response.ok) throw new Error("Publishing failed");

        const data = await response.json();
        setPublishedUrl(data.url);
        setLocalUrl(data.localUrl || "");
        setCurrentStep(5);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsPublishing(false);
      }
    },
    [generatedContent]
  );

  // Reset everything
  const handleCreateAnother = useCallback(() => {
    setCurrentStep(1);
    setCardData({ cardImage: null, voiceText: "" });
    setGeneratedContent(null);
    setPublishedUrl("");
    setLocalUrl("");
    setError(null);
  }, []);

  return (
    <>
      {/* Step Progress (visible from step 2 onwards) */}
      {currentStep > 1 && currentStep < 5 && (
        <div className="fixed top-0 left-0 w-full z-50">
          <StepProgress currentStep={currentStep} totalSteps={5} />
        </div>
      )}

      {/* Error Banner */}
      {error && currentStep !== 3 && (
        <div className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto">
          <ErrorCard
            message={language ? t("errorTimeout") : error}
            actionLabel={language ? t("tryAgain") : "Try Again"}
            onAction={() => setError(null)}
          />
        </div>
      )}

      {/* Step Components */}
      {currentStep === 0 && (
        <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
          <img src="/logo.png" alt="Yuktha Logo" className="w-56 h-auto drop-shadow-2xl splash-logo" />
        </div>
      )}

      {currentStep === 1 && (
        <LanguageSelection onNext={handleLanguageSelected} />
      )}

      {currentStep === 2 && (
        <CardCapture onNext={handleCardCaptured} />
      )}

      {currentStep === 3 && (
        <AIGeneration
          cardImage={cardData.cardImage}
          voiceText={cardData.voiceText}
          onComplete={handleGenerationComplete}
          onError={handleGenerationError}
        />
      )}

      {currentStep === 4 && generatedContent && (
        <PreviewRefine
          previewContent={generatedContent.previewContent}
          publishedContent={generatedContent.publishedContent}
          previewData={generatedContent.previewData}
          publishedData={generatedContent.publishedData}
          onPublish={handlePublish}
          onContentUpdate={handleContentUpdate}
        />
      )}

      {currentStep === 5 && (
        <PublishShare
          publishedUrl={publishedUrl}
          localUrl={localUrl}
          onCreateAnother={handleCreateAnother}
        />
      )}

      {/* Publishing overlay */}
      {isPublishing && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="spinner-ring mx-auto mb-4" />
            <p className="text-text-secondary text-sm">{t("publishing")}</p>
          </div>
        </div>
      )}
    </>
  );
}
