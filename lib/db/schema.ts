export const SCHEMA_SQL = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS habits (
  id          TEXT PRIMARY KEY NOT NULL,
  name        TEXT NOT NULL,
  frequency   INTEGER NOT NULL CHECK (frequency BETWEEN 1 AND 7),
  sort_order  INTEGER NOT NULL DEFAULT 0,
  archived    INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (date('now'))
);

CREATE TABLE IF NOT EXISTS habit_entries (
  id          TEXT PRIMARY KEY NOT NULL,
  habit_id    TEXT NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  date        TEXT NOT NULL,
  status      TEXT NOT NULL CHECK (status IN ('done', 'skipped')),
  UNIQUE (habit_id, date)
);

CREATE TABLE IF NOT EXISTS mood_entries (
  id          TEXT PRIMARY KEY NOT NULL,
  date        TEXT NOT NULL UNIQUE,
  score       INTEGER NOT NULL CHECK (score BETWEEN 1 AND 10),
  note        TEXT
);

CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);
`;
