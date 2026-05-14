"use client";

export default function LogoutButton() {
  return (
    <button
      onClick={async () => {
        document.cookie = "token=; Path=/; Max-Age=0";
        window.location.href = "/";
      }}
      className="text-[10px] uppercase tracking-widest text-white/40 hover:text-[var(--color-premium-rose)] transition-colors cursor-pointer"
    >
      Quitter
    </button>
  );
}
