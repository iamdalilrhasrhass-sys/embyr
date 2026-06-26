export interface UniverseTilt {
  x: number;
  y: number;
}

const MAX_TILT = 12;
const DELTA_TO_DEGREES = 0.1;

export function tiltFromPointerDelta(deltaX: number, deltaY: number): UniverseTilt {
  return {
    x: clamp(deltaX * DELTA_TO_DEGREES, MAX_TILT),
    y: clamp(deltaY * -DELTA_TO_DEGREES, MAX_TILT),
  };
}

export function resetUniverseTilt(): UniverseTilt {
  return { x: 0, y: 0 };
}

function clamp(value: number, max: number): number {
  return Math.max(-max, Math.min(max, value));
}

