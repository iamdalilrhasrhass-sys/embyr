// ── Compass physics — pure arithmetic, no DOM access ──

export interface SpringState {
  angle: number;
  velocity: number;
}

const STIFFNESS = 0.08;
const DAMPING = 0.72;
const DEFAULT_FRICTION = 0.92;
const MAX_TILT_DEG = 18;

export function applyFriction(velocity: number, friction: number): number {
  return velocity * friction;
}

export function clampTilt(value: number, maxDeg: number): number {
  return Math.max(-maxDeg, Math.min(maxDeg, value));
}

export function stepSpring(
  state: SpringState,
  target: number,
  dt: number
): SpringState {
  const force = (target - state.angle) * STIFFNESS;
  const acceleration = force - state.velocity * DAMPING;
  const newVelocity = state.velocity + acceleration * dt;
  const newAngle = state.angle + newVelocity * dt;
  return { angle: newAngle, velocity: newVelocity };
}

export function createPhysicsState(initialAngle?: number): {
  angle: number;
  velocity: number;
  targetAngle: number;
  tiltX: number;
  tiltY: number;
  targetTiltX: number;
  targetTiltY: number;
  isDragging: boolean;
} {
  return {
    angle: initialAngle ?? 0.08,
    velocity: 0,
    targetAngle: 0.08,
    tiltX: 0,
    tiltY: 0,
    targetTiltX: 0,
    targetTiltY: 0,
    isDragging: false,
  };
}

export function tickPhysics(
  state: ReturnType<typeof createPhysicsState>,
  friction: number = DEFAULT_FRICTION,
  prefersReducedMotion: boolean = false
): void {
  const dt = 1; // normalized time step per frame

  if (prefersReducedMotion) {
    // Snap directly, no animation
    state.angle = state.targetAngle;
    state.velocity = 0;
    state.tiltX = state.targetTiltX;
    state.tiltY = state.targetTiltY;
    return;
  }

  if (!state.isDragging) {
    // Spring toward target angle
    const springResult = stepSpring(
      { angle: state.angle, velocity: state.velocity },
      state.targetAngle,
      dt
    );
    state.angle = springResult.angle;
    state.velocity = springResult.velocity;

    // Apply friction when velocity is tiny (below threshold)
    if (Math.abs(state.velocity) < 0.001 && Math.abs(state.angle - state.targetAngle) < 0.0005) {
      state.angle = state.targetAngle;
      state.velocity = 0;
    }
  } else {
    // During drag, apply friction to velocity but don't spring
    state.velocity = applyFriction(state.velocity, friction);
  }

  // Smooth tilt toward targets
  state.tiltX += (state.targetTiltX - state.tiltX) * 0.15;
  state.tiltY += (state.targetTiltY - state.tiltY) * 0.15;

  // Clamp tilts
  state.tiltX = clampTilt(state.tiltX, MAX_TILT_DEG);
  state.tiltY = clampTilt(state.tiltY, MAX_TILT_DEG);
}
