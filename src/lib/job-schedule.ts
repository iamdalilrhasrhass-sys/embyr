export const JOB_CADENCES = ["hourly", "daily", "weekly"] as const;
export type JobCadence = (typeof JOB_CADENCES)[number];

export interface JobWindow {
  bucketStart: Date;
  reportStart: Date;
  reportEnd: Date;
  idempotencyKey: string;
}

export function isJobCadence(value: unknown): value is JobCadence {
  return (
    typeof value === "string" && JOB_CADENCES.includes(value as JobCadence)
  );
}

function startOfUtcHour(value: Date): Date {
  const result = new Date(value);
  result.setUTCMinutes(0, 0, 0);
  return result;
}

function startOfUtcDay(value: Date): Date {
  const result = new Date(value);
  result.setUTCHours(0, 0, 0, 0);
  return result;
}

function startOfUtcWeek(value: Date): Date {
  const result = startOfUtcDay(value);
  const day = result.getUTCDay();
  const distanceFromMonday = day === 0 ? 6 : day - 1;
  result.setUTCDate(result.getUTCDate() - distanceFromMonday);
  return result;
}

function addMilliseconds(value: Date, milliseconds: number): Date {
  return new Date(value.getTime() + milliseconds);
}

export function buildJobWindow(cadence: JobCadence, now = new Date()): JobWindow {
  if (Number.isNaN(now.getTime())) throw new Error("Invalid job timestamp");

  if (cadence === "hourly") {
    const bucketStart = startOfUtcHour(now);
    const reportEnd = bucketStart;
    const reportStart = addMilliseconds(reportEnd, -60 * 60 * 1000);
    return {
      bucketStart,
      reportStart,
      reportEnd,
      idempotencyKey: `hourly:${bucketStart.toISOString().slice(0, 13)}`,
    };
  }

  if (cadence === "daily") {
    const bucketStart = startOfUtcDay(now);
    const reportEnd = bucketStart;
    const reportStart = addMilliseconds(reportEnd, -24 * 60 * 60 * 1000);
    return {
      bucketStart,
      reportStart,
      reportEnd,
      idempotencyKey: `daily:${bucketStart.toISOString().slice(0, 10)}`,
    };
  }

  const bucketStart = startOfUtcWeek(now);
  const reportEnd = bucketStart;
  const reportStart = addMilliseconds(reportEnd, -7 * 24 * 60 * 60 * 1000);
  return {
    bucketStart,
    reportStart,
    reportEnd,
    idempotencyKey: `weekly:${bucketStart.toISOString().slice(0, 10)}`,
  };
}
