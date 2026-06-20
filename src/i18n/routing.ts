import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: [
    "fr", "en", "es", "de", "pt", "it", "nl", "ru", "zh", "ja",
    "ko", "ar", "hi", "tr", "pl", "sv", "da", "fi", "no", "th",
    "vi", "id", "ms", "ro"
  ],
  defaultLocale: "en",
  localeDetection: false,
  localePrefix: "as-needed",
  alternateLinks: false,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
