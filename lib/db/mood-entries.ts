import { getDb } from './client';
import { randomUUID } from '../uuid';

export interface MoodEntry {
  id: string;
  date: string;
  score: number;
  note: string | null;
}

export async function getMoodForDate(date: string): Promise<MoodEntry | null> {
  const db = await getDb();
  return db.getFirstAsync<MoodEntry>(
    'SELECT * FROM mood_entries WHERE date = ?',
    date
  );
}

export async function getMoodEntries(fromDate: string, toDate: string): Promise<MoodEntry[]> {
  const db = await getDb();
  return db.getAllAsync<MoodEntry>(
    'SELECT * FROM mood_entries WHERE date >= ? AND date <= ? ORDER BY date ASC',
    fromDate, toDate
  );
}

export async function upsertMood(date: string, score: number, note?: string): Promise<MoodEntry> {
  const db = await getDb();
  const existing = await db.getFirstAsync<MoodEntry>(
    'SELECT * FROM mood_entries WHERE date = ?',
    date
  );
  if (existing) {
    await db.runAsync(
      'UPDATE mood_entries SET score = ?, note = ? WHERE id = ?',
      score, note ?? null, existing.id
    );
    return { ...existing, score, note: note ?? null };
  } else {
    const id = randomUUID();
    await db.runAsync(
      'INSERT INTO mood_entries (id, date, score, note) VALUES (?, ?, ?, ?)',
      id, date, score, note ?? null
    );
    return { id, date, score, note: note ?? null };
  }
}

export async function deleteMoodEntry(date: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM mood_entries WHERE date = ?', date);
}
