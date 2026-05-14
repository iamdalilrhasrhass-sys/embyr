import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: "/root/embyr",
  async redirects() {
    return [
      { source: "/connexion", destination: "/auth/login", permanent: true },
      { source: "/inscription", destination: "/auth/register", permanent: true },
      { source: "/profil", destination: "/dashboard/profile", permanent: true },
      { source: "/members", destination: "/membres", permanent: true },
      { source: "/profiles", destination: "/membres", permanent: true },
      { source: "/login", destination: "/auth/login", permanent: true },
      { source: "/register", destination: "/auth/register", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
        ],
      },
    ];
  },
};

export default nextConfig;
