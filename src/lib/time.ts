export function getYearProgressFromTimestamp(ms: number) {
  const now = new Date(ms);
  const year = now.getUTCFullYear();

  const start = Date.UTC(year, 0, 1, 0, 0, 0);
  const end = Date.UTC(year + 1, 0, 1, 0, 0, 0);

  const totalMs = end - start;
  const elapsedMs = Math.min(Math.max(ms - start, 0), totalMs);

  const percent = (elapsedMs / totalMs) * 100;

    const dayMs = 1000 * 60 * 60 * 24;
  const daysTotal = Math.round(totalMs / dayMs);
  const daysPassed = Math.floor(elapsedMs / dayMs);

  return {
    year,
    percent,
    daysPassed,
    daysTotal,
    iso: now.toISOString(),
    elapsedMs,
    totalMs,
  };
}
