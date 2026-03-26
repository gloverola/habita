import { getDb } from './client';
import { randomUUID } from '../uuid';

export interface HabitEntry {
  id: string;
  habit_id: string;
  date: string;
  status: 'done' | 'skipped';
  note: string | null;
}

export async function getEntriesForHabit(habitId: string, fromDate: string, toDate: string): Promise<HabitEntry[]> {
  const db = await getDb();
  return db.getAllAsync<HabitEntry>(
    'SELECT * FROM habit_entries WHERE habit_id = ? AND date >= ? AND date <= ? ORDER BY date ASC',
    habitId, fromDate, toDate
  );
}

export async function getEntriesForHabits(habitIds: string[], fromDate: string, toDate: string): Promise<HabitEntry[]> {
  if (habitIds.length === 0) return [];
  const db = await getDb();
  const placeholders = habitIds.map(() => '?').join(',');
  return db.getAllAsync<HabitEntry>(
    `SELECT * FROM habit_entries WHERE habit_id IN (${placeholders}) AND date >= ? AND date <= ? ORDER BY date ASC`,
    ...habitIds, fromDate, toDate
  );
}

export async function toggleHabitEntry(habitId: string, date: string): Promise<HabitEntry | null> {
  const db = await getDb();
  const existing = await db.getFirstAsync<HabitEntry>(
    'SELECT * FROM habit_entries WHERE habit_id = ? AND date = ?',
    habitId, date
  );

  if (!existing) {
    const id = randomUUID();
    await db.runAsync(
      'INSERT INTO habit_entries (id, habit_id, date, status) VALUES (?, ?, ?, ?)',
      id, habitId, date, 'done'
    );
    return { id, habit_id: habitId, date, status: 'done', note: null };
  } else if (existing.status === 'done') {
    await db.runAsync('UPDATE habit_entries SET status = ? WHERE id = ?', 'skipped', existing.id);
    return { ...existing, status: 'skipped' };
  } else {
    await db.runAsync('DELETE FROM habit_entries WHERE id = ?', existing.id);
    return null;
  }
}

export async function upsertEntryNote(habitId: string, date: string, note: string): Promise<void> {
  const db = await getDb();
  const existing = await db.getFirstAsync<HabitEntry>(
    'SELECT * FROM habit_entries WHERE habit_id = ? AND date = ?',
    habitId, date
  );
  if (existing) {
    await db.runAsync('UPDATE habit_entries SET note = ? WHERE id = ?', note.trim() || null, existing.id);
  } else {
    // Create a done entry with the note
    const id = randomUUID();
    await db.runAsync(
      'INSERT INTO habit_entries (id, habit_id, date, status, note) VALUES (?, ?, ?, ?, ?)',
      id, habitId, date, 'done', note.trim() || null
    );
  }
}
