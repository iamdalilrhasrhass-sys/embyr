import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: [
    "fr", "en", "es", "de", "pt", "it", "nl", "ru", "zh", "ja",
    "ko", "ar", "hi", "tr", "pl", "sv", "da", "fi", "no", "th",
    "vi", "id", "ms", "ro", "uk"
  ],
  defaultLocale: "fr",
  localeDetection: true,
  localePrefix: "as-needed",
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
