export interface ReciprocalInput {
  orientation: number;
  intention: number;
  affinity: number;
}

export interface ReciprocalStrand {
  leftPath: string;
  rightPath: string;
  opacity: number;
}

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function reciprocalStrength(outbound: number, inbound: number): number {
  return clamp01(outbound) * clamp01(inbound);
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

export function buildReciprocalStrands(input: ReciprocalInput): ReciprocalStrand[] {
  const orientation = clamp01(input.orientation);
  const intention = clamp01(input.intention);
  const affinity = clamp01(input.affinity);
  const convergence = (orientation + intention + affinity) / 3;
  const centerY = 260;
  const strandCount = 12;

  return Array.from({ length: strandCount }, (_, index) => {
    const normalized = index / (strandCount - 1);
    const offset = (normalized - 0.5) * (250 - convergence * 70);
    const startY = centerY + offset;
    const endY = centerY - offset * (0.54 + affinity * 0.18);
    const leftControlY = startY - offset * (0.2 + orientation * 0.4);
    const rightControlY = endY + offset * (0.2 + intention * 0.4);
    const opacity = round(0.12 + (1 - Math.abs(normalized - 0.5) * 1.72) * 0.62 + convergence * 0.16);

    return {
      leftPath: `M 42 ${round(startY)} C 190 ${round(leftControlY)}, 322 ${round(centerY + offset * 0.16)}, 500 ${centerY}`,
      rightPath: `M 500 ${centerY} C 678 ${round(centerY - offset * 0.16)}, 810 ${round(rightControlY)}, 958 ${round(endY)}`,
      opacity: clamp01(opacity),
    };
  });
}

export function compassPetalPath(index: number, rotation: number): string {
  const angle = rotation + (index * Math.PI) / 2;
  const center = 320;
  const innerRadius = 8;
  const outerRadius = 196;
  const sideRadius = 118;
  const spread = 0.72;
  const startX = center + Math.cos(angle) * innerRadius;
  const startY = center + Math.sin(angle) * innerRadius;
  const tipX = center + Math.cos(angle) * outerRadius;
  const tipY = center + Math.sin(angle) * outerRadius;
  const leftControlX = center + Math.cos(angle - spread) * sideRadius;
  const leftControlY = center + Math.sin(angle - spread) * sideRadius;
  const rightControlX = center + Math.cos(angle + spread) * sideRadius;
  const rightControlY = center + Math.sin(angle + spread) * sideRadius;

  return [
    `M ${round(startX)} ${round(startY)}`,
    `C ${round(leftControlX)} ${round(leftControlY)}, ${round(tipX)} ${round(tipY)}, ${round(tipX)} ${round(tipY)}`,
    `C ${round(tipX)} ${round(tipY)}, ${round(rightControlX)} ${round(rightControlY)}, ${round(startX)} ${round(startY)}`,
    "Z",
  ].join(" ");
}
