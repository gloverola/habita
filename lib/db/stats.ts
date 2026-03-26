import { getDb } from './client';

export interface AllTimeStats {
  totalDone: number;
  activeDays: number;
  firstDate: string | null;
  longestStreak: number;
}

export async function getAllTimeStats(): Promise<AllTimeStats> {
  const db = await getDb();

  const agg = await db.getFirstAsync<{ total: number; days: number; first: string | null }>(
    `SELECT COUNT(*) as total,
            COUNT(DISTINCT date) as days,
            MIN(date) as first
     FROM habit_entries WHERE status = 'done'`
  );

  // Compute longest streak across all habits/dates
  const rows = await db.getAllAsync<{ date: string }>(
    `SELECT DISTINCT date FROM habit_entries WHERE status = 'done' ORDER BY date ASC`
  );

  let longest = 0;
  let current = 0;
  let prev: string | null = null;
  for (const { date } of rows) {
    if (prev === null) {
      current = 1;
    } else {
      const diff = daysDiff(prev, date);
      current = diff === 1 ? current + 1 : 1;
    }
    if (current > longest) longest = current;
    prev = date;
  }

  return {
    totalDone: agg?.total ?? 0,
    activeDays: agg?.days ?? 0,
    firstDate: agg?.first ?? null,
    longestStreak: longest,
  };
}

function daysDiff(a: string, b: string): number {
  return Math.round(
    (new Date(b + 'T00:00:00').getTime() - new Date(a + 'T00:00:00').getTime()) /
    86400000
  );
}

export interface CorrelationResult {
  allDoneAvg: number | null;   // avg mood on days all active habits were done
  notAllDoneAvg: number | null;
  sampleSize: number;
}

export async function getMoodHabitCorrelation(): Promise<CorrelationResult> {
  const db = await getDb();

  // Active habit count
  const habitRow = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM habits WHERE archived = 0'
  );
  const habitCount = habitRow?.count ?? 0;
  if (habitCount === 0) return { allDoneAvg: null, notAllDoneAvg: null, sampleSize: 0 };

  // For each date with a mood entry, count done habits
  const rows = await db.getAllAsync<{ date: string; score: number; done_count: number }>(
    `SELECT m.date, m.score,
            (SELECT COUNT(*) FROM habit_entries e WHERE e.date = m.date AND e.status = 'done') as done_count
     FROM mood_entries m`
  );

  if (rows.length === 0) return { allDoneAvg: null, notAllDoneAvg: null, sampleSize: 0 };

  const allDone = rows.filter(r => r.done_count >= habitCount);
  const notAllDone = rows.filter(r => r.done_count < habitCount);

  const avg = (arr: typeof rows) =>
    arr.length === 0 ? null : arr.reduce((s, r) => s + r.score, 0) / arr.length;

  return {
    allDoneAvg: avg(allDone),
    notAllDoneAvg: avg(notAllDone),
    sampleSize: rows.length,
  };
}
