import { getDb } from './client';
import { randomUUID } from '../uuid';

export interface Habit {
  id: string;
  name: string;
  frequency: number;
  sort_order: number;
  archived: number;
  created_at: string;
}

export async function getAllHabits(): Promise<Habit[]> {
  const db = await getDb();
  return db.getAllAsync<Habit>(
    'SELECT * FROM habits WHERE archived = 0 ORDER BY sort_order ASC, created_at ASC'
  );
}

export async function getAllHabitsIncludingArchived(): Promise<Habit[]> {
  const db = await getDb();
  return db.getAllAsync<Habit>(
    'SELECT * FROM habits ORDER BY archived ASC, sort_order ASC, created_at ASC'
  );
}

export async function getHabitById(id: string): Promise<Habit | null> {
  const db = await getDb();
  return db.getFirstAsync<Habit>('SELECT * FROM habits WHERE id = ?', id);
}

export async function createHabit(name: string, frequency: number): Promise<Habit> {
  const db = await getDb();
  const id = randomUUID();
  const row = await db.getFirstAsync<{ max_order: number | null }>(
    'SELECT MAX(sort_order) as max_order FROM habits'
  );
  const sortOrder = (row?.max_order ?? -1) + 1;
  await db.runAsync(
    'INSERT INTO habits (id, name, frequency, sort_order) VALUES (?, ?, ?, ?)',
    id, name, frequency, sortOrder
  );
  return { id, name, frequency, sort_order: sortOrder, archived: 0, created_at: new Date().toISOString().slice(0, 10) };
}

export async function updateHabit(id: string, name: string, frequency: number): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'UPDATE habits SET name = ?, frequency = ? WHERE id = ?',
    name, frequency, id
  );
}

export async function archiveHabit(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('UPDATE habits SET archived = 1 WHERE id = ?', id);
}

export async function unarchiveHabit(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('UPDATE habits SET archived = 0 WHERE id = ?', id);
}

export async function deleteHabit(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM habits WHERE id = ?', id);
}

export async function swapHabitOrder(id1: string, id2: string): Promise<void> {
  const db = await getDb();
  const h1 = await db.getFirstAsync<{ sort_order: number }>('SELECT sort_order FROM habits WHERE id = ?', id1);
  const h2 = await db.getFirstAsync<{ sort_order: number }>('SELECT sort_order FROM habits WHERE id = ?', id2);
  if (!h1 || !h2) return;
  await db.runAsync('UPDATE habits SET sort_order = ? WHERE id = ?', h2.sort_order, id1);
  await db.runAsync('UPDATE habits SET sort_order = ? WHERE id = ?', h1.sort_order, id2);
}
