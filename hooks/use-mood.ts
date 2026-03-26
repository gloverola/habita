import { useCallback, useEffect, useState } from 'react';
import { MoodEntry, getMoodForDate, getMoodEntries, upsertMood as dbUpsert } from '@/lib/db/mood-entries';

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function useMood(today: string, windowDays = 28) {
  const [todayEntry, setTodayEntry] = useState<MoodEntry | null>(null);
  const [history, setHistory] = useState<MoodEntry[]>([]);

  const fromDate = addDays(today, -(windowDays - 1));

  const refresh = useCallback(async () => {
    const [td, hist] = await Promise.all([
      getMoodForDate(today),
      getMoodEntries(fromDate, today),
    ]);
    setTodayEntry(td);
    setHistory(hist);
  }, [today, fromDate]);

  useEffect(() => { refresh(); }, [refresh]);

  const setMood = useCallback(async (score: number) => {
    const entry = await dbUpsert(today, score);
    setTodayEntry(entry);
    await refresh();
  }, [today, refresh]);

  return { todayEntry, history, refresh, setMood };
}
