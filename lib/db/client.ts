import * as SQLite from 'expo-sqlite';
import { SCHEMA_SQL } from './schema';

let _db: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (_db) return _db;
  _db = await SQLite.openDatabaseAsync('habita.db');
  await _db.execAsync(SCHEMA_SQL);
  // Migrations — safe to re-run (errors mean column already exists)
  await _db.execAsync('ALTER TABLE habit_entries ADD COLUMN note TEXT').catch(() => {});
  return _db;
}
