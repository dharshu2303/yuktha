"use client";

import Button from "./Button";

export default function ErrorCard({ message, actionLabel, onAction, className = "" }) {
  return (
    <div
      className={`bg-white border border-border rounded-card shadow-card p-6 flex items-start gap-4 border-l-4 border-l-red-400 animate-fade-in ${className}`}
      role="alert"
    >
      {/* Error icon */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
        <svg
          className="w-5 h-5 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-text-primary text-sm leading-relaxed">{message}</p>
        {actionLabel && onAction && (
          <Button
            variant="secondary"
            onClick={onAction}
            className="mt-3 text-sm px-4 py-2"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
