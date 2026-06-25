"use client";

import type { ReactNode } from "react";

interface TabItem {
  id: string;
  label: string;
  icon: ReactNode;
  href?: string;
}

interface MobileTabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange?: (tabId: string) => void;
}

export default function MobileTabBar({
  tabs,
  activeTab,
  onTabChange,
}: MobileTabBarProps) {
  return (
    <nav
      className={[
        "fixed bottom-0 left-0 right-0 z-40",
        "border-t border-[var(--e21-line)]",
        "bg-[var(--e21-void,#09060c)]/95 backdrop-blur-xl",
        "pb-[env(safe-area-inset-bottom,0px)]",
        "flex items-stretch justify-around",
        "h-[calc(56px+env(safe-area-inset-bottom,0px))]",
      ].join(" ")}
      role="navigation"
      aria-label="Navigation principale"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange?.(tab.id)}
            className={[
              "flex flex-col items-center justify-center gap-0.5",
              "flex-1 min-h-[44px] min-w-[44px]",
              "font-sans text-[11px] font-medium tracking-wide",
              "transition-colors duration-200",
              "focus-visible:outline-2 focus-visible:outline-[var(--e21-focus,#ffd2b8)] focus-visible:outline-offset-[-2px]",
              "touch-manipulation select-none",
              isActive
                ? "text-[var(--e21-ember,#c56f4e)]"
                : "text-[var(--e21-faint)]",
            ].join(" ")}
            aria-current={isActive ? "page" : undefined}
            aria-label={tab.label}
          >
            <span className="text-xl leading-none">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
