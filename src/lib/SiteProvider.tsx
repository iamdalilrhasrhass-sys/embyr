"use client";
import { createContext, useContext, ReactNode } from "react";

export type SiteName = "femynia" | "embyr";

interface SiteContextValue {
  site: SiteName;
  siteId: number;
  partnerSites: Array<{ id: number; slug: string; name: string; domain: string }>;
}

const SiteContext = createContext<SiteContextValue>({
  site: "embyr",
  siteId: 2,
  partnerSites: [],
});

export function useSite() {
  return useContext(SiteContext);
}

export function SiteProvider({
  site,
  siteId,
  partnerSites,
  children,
}: {
  site: SiteName;
  siteId: number;
  partnerSites: SiteContextValue["partnerSites"];
  children: ReactNode;
}) {
  return (
    <SiteContext.Provider value={{ site, siteId, partnerSites }}>
      {children}
    </SiteContext.Provider>
  );
}
