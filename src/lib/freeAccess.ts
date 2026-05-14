export const FREE_ACCESS_START = 0;
export const FREE_ACCESS_END = 7;

function getParisHour(date = new Date()): number {
  return parseInt(
    new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', hour: 'numeric', hour12: false }).format(date),
    10
  );
}

export function isFreeNightAccess(): boolean {
  const hour = getParisHour();
  return hour >= FREE_ACCESS_START && hour < FREE_ACCESS_END;
}

export function isFreeWindow(date = new Date()): boolean {
  const d = new Date(date.toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
  const hour = d.getHours();
  const day = d.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  
  // Vendredi soir (sam 00h-07h) et samedi soir (dim 00h-07h) : PAS gratuit
  const isWeekendFreeBlock = (day === 6 || day === 0) && hour >= FREE_ACCESS_START && hour < FREE_ACCESS_END;
  if (isWeekendFreeBlock) return false;
  
  return hour >= FREE_ACCESS_START && hour < FREE_ACCESS_END;
}

export function getAccessMode(date = new Date()) {
  const isFree = isFreeWindow(date);
  return {
    isFree,
    reason: isFree ? "FREE_WINDOW" as const : "PAID_HOURS" as const,
    label: isFree ? "🌙 Gratuit jusqu'à 07h00" as string | null : null as string | null,
  };
}

// Time until next free window starts
export function getTimeUntilFreeAccess(): string {
  const parisHour = getParisHour();
  if (parisHour >= FREE_ACCESS_START && parisHour < FREE_ACCESS_END) return "Actif";
  const nowParis = new Date().toLocaleString('en-US', { timeZone: 'Europe/Paris' });
  const target = new Date(nowParis);
  target.setHours(24, 0, 0, 0);
  const diffMs = target.getTime() - new Date(nowParis).getTime();
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffMins = Math.round((diffMs % 3600000) / 60000);
  return `${diffHrs}h ${diffMins}m`;
}
