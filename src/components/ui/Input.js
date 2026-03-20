"use client";

import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { className = "", label, error, ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-[11px] font-medium uppercase tracking-label text-text-secondary mb-1.5">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full bg-white border-[1.5px] border-border rounded-input px-4 py-3 text-text-primary placeholder:text-text-secondary/50 transition-all duration-200 input-focus-glow focus:outline-none ${
          error ? "border-red-400" : ""
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default Input;
