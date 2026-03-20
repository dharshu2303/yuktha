"use client";

export default function Spinner({ size = "md", className = "" }) {
  const sizes = {
    sm: { cls: "w-5 h-5", border: "2px" },
    md: { cls: "w-10 h-10", border: "3px" },
    lg: { cls: "w-16 h-16", border: "4px" },
  };

  const s = sizes[size] || sizes.md;

  return (
    <div
      className={`rounded-full animate-spin ${s.cls} ${className}`}
      style={{
        borderWidth: s.border,
        borderStyle: "solid",
        borderColor: "#E2E8F0",
        borderTopColor: "#6C63FF",
      }}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
