import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async redirects() {
    return [
      { source: "/connexion", destination: "/fr/auth/login", permanent: true },
      { source: "/inscription", destination: "/fr/auth/register", permanent: true },
      { source: "/profil", destination: "/fr/dashboard/profile", permanent: true },
      { source: "/login", destination: "/fr/auth/login", permanent: true },
      { source: "/register", destination: "/fr/auth/register", permanent: true },
      { source: "/pricing", destination: "/fr/premium", permanent: true },
      { source: "/members", destination: "/fr/membres", permanent: true },
      { source: "/profiles", destination: "/fr/membres", permanent: true },
      { source: "/decouvrir", destination: "/fr/membres", permanent: true },
      { source: "/members/:path*", destination: "/fr/membres/:path*", permanent: true },
      { source: "/profiles/:path*", destination: "/fr/membres/:path*", permanent: true },
      { source: "/fr/conditions", destination: "/fr/terms", permanent: true },
      { source: "/fr/verification-age", destination: "/fr/age-verification", permanent: true },
      { source: "/fr/a-propos", destination: "/fr/about", permanent: true },
      // SEO canonicals — long-form aliases to short canonical URLs
      { source: "/en/uk/free-dating-app", destination: "/uk", permanent: true },
      { source: "/en/us/free-dating-app", destination: "/us", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
