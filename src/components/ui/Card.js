"use client";

export default function Card({ children, className = "", hover = false, ...props }) {
  return (
    <div
      className={`bg-white border border-border rounded-card shadow-card ${
        hover ? "hover:shadow-card-hover transition-shadow duration-200" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
