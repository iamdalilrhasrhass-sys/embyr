import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
}

export default function Input({
  label,
  error,
  helperText,
  leftSlot,
  rightSlot,
  className = "",
  id,
  required,
  disabled,
  ...props
}: InputProps) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[var(--e21-muted)] font-sans text-sm font-medium"
        >
          {label}
          {required && (
            <span className="text-[var(--e21-coral)] ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div
        className={[
          "relative flex items-center min-h-[48px] rounded-[var(--eb-radius-sm,12px)]",
          "border transition-colors duration-200",
          error
            ? "border-[var(--e21-coral)]"
            : "border-[var(--e21-line)] focus-within:border-[var(--e21-ember)]",
          "bg-[rgba(242,237,228,0.03)]",
          disabled ? "opacity-40 cursor-not-allowed" : "",
        ].join(" ")}
      >
        {leftSlot && (
          <div className="pl-3 text-[var(--e21-faint)] flex-shrink-0">
            {leftSlot}
          </div>
        )}

        <input
          id={inputId}
          className={[
            "w-full bg-transparent px-4 py-3 text-[var(--e21-bone)] font-sans text-base",
            "placeholder:text-[var(--e21-faint)]",
            "focus:outline-none",
            "disabled:cursor-not-allowed",
            leftSlot ? "pl-2" : "",
            rightSlot ? "pr-2" : "",
            className,
          ].join(" ")}
          required={required}
          disabled={disabled}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
                ? `${inputId}-helper`
                : undefined
          }
          {...props}
        />

        {rightSlot && (
          <div className="pr-3 text-[var(--e21-faint)] flex-shrink-0">
            {rightSlot}
          </div>
        )}
      </div>

      {error && (
        <p
          id={`${inputId}-error`}
          className="text-[var(--e21-coral)] font-sans text-xs"
          role="alert"
        >
          {error}
        </p>
      )}

      {!error && helperText && (
        <p
          id={`${inputId}-helper`}
          className="text-[var(--e21-faint)] font-sans text-xs"
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
