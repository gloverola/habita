import { getDb } from './db/client';

/**
 * Returns the current consecutive "done" streak for a habit, counting back
 * from today. A day with status "skipped" or no entry breaks the streak.
 */
export async function getStreak(habitId: string, today: string): Promise<number> {
  const db = await getDb();

  // Fetch entries ordered newest-first
  const rows = await db.getAllAsync<{ date: string; status: string }>(
    `SELECT date, status FROM habit_entries
     WHERE habit_id = ? AND date <= ?
     ORDER BY date DESC`,
    habitId,
    today
  );

  let streak = 0;
  let cursor = today;

  for (const row of rows) {
    if (row.date !== cursor) break;          // gap in days — streak ends
    if (row.status !== 'done') break;        // skipped — streak ends
    streak++;
    cursor = prevDay(cursor);
  }

  return streak;
}

/** Fetch streaks for multiple habits in one pass via a single query. */
export async function getStreaks(habitIds: string[], today: string): Promise<Record<string, number>> {
  if (habitIds.length === 0) return {};
  const db = await getDb();

  const placeholders = habitIds.map(() => '?').join(',');
  const rows = await db.getAllAsync<{ habit_id: string; date: string; status: string }>(
    `SELECT habit_id, date, status FROM habit_entries
     WHERE habit_id IN (${placeholders}) AND date <= ?
     ORDER BY habit_id, date DESC`,
    ...habitIds,
    today
  );

  // Group by habit_id
  const byHabit: Record<string, { date: string; status: string }[]> = {};
  for (const row of rows) {
    (byHabit[row.habit_id] ??= []).push(row);
  }

  const result: Record<string, number> = {};
  for (const id of habitIds) {
    const entries = byHabit[id] ?? [];
    let streak = 0;
    let cursor = today;
    for (const e of entries) {
      if (e.date !== cursor) break;
      if (e.status !== 'done') break;
      streak++;
      cursor = prevDay(cursor);
    }
    result[id] = streak;
  }
  return result;
}

function prevDay(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}
