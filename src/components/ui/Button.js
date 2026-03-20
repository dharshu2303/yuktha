"use client";

export default function Button({
  children,
  variant = "primary",
  disabled = false,
  onClick,
  className = "",
  type = "button",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

  const variants = {
    primary:
      "bg-primary text-white rounded-btn px-7 py-3.5 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md",
    secondary:
      "bg-white text-text-primary border-[1.5px] border-border rounded-btn px-7 py-3.5 hover:border-text-secondary hover:scale-[1.02] active:scale-[0.98]",
    accent:
      "bg-accent text-white rounded-btn px-7 py-3.5 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md",
    ghost:
      "bg-transparent text-text-secondary hover:text-text-primary hover:bg-background-alt rounded-btn px-4 py-2",
    success:
      "bg-success text-white rounded-btn px-7 py-3.5 hover:scale-[1.02] active:scale-[0.98] shadow-sm",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
