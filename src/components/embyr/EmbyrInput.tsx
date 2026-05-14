"use client";
export default function EmbyrInput({
  label, error, ...props
}: {
  label?: string; error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      {label && <label className="block text-xs font-medium text-[var(--eb-text-secondary)] mb-1.5">{label}</label>}
      <input
        className={`w-full rounded-[var(--eb-radius-input)] bg-[var(--eb-bg-elev-1)] border px-4 py-3.5 text-sm text-[var(--eb-text-primary)] placeholder:text-[var(--eb-text-muted)] focus:outline-none focus:border-[var(--eb-accent)] transition-colors ${error ? "border-[var(--eb-danger)]" : "border-[var(--eb-border-soft)]"}`}
        style={{ fontSize: "16px" }}
        {...props}
      />
      {error && <p className="text-xs text-[var(--eb-danger)] mt-1">{error}</p>}
    </div>
  );
}
