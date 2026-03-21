"use client";

import { useTranslation, LANGUAGES } from "@/context/LanguageContext";
import Card from "@/components/ui/Card";

export default function LanguageSelection({ onNext }) {
  const { language, setLanguage } = useTranslation();

  const handleSelect = (code) => {
    setLanguage(code);
    // Small delay for visual feedback before transitioning
    setTimeout(() => onNext(), 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg p-8 md:p-12 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img src="/logo.png" className="w-16 h-16 object-contain drop-shadow-sm" alt="Yuktha Logo" />
          </div>
          <h1 className="text-3xl font-bold tracking-heading text-text-primary">
            Choose Your Language
          </h1>
          <p className="mt-2 text-text-secondary text-sm">
            உங்கள் மொழியைத் தேர்ந்தெடுங்கள்
          </p>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`flex flex-col items-center justify-center p-4 rounded-card border-2 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] ${
                language === lang.code
                  ? "border-accent bg-accent/5 shadow-md"
                  : "border-border bg-white hover:border-accent/30"
              }`}
              aria-label={`Select ${lang.english}`}
            >
              <span className="text-2xl mb-1">{lang.emoji}</span>
              <span className="text-lg font-semibold text-text-primary leading-tight">
                {lang.name}
              </span>
              <span className="text-[11px] uppercase tracking-label text-text-secondary mt-1 font-medium">
                {lang.english}
              </span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
