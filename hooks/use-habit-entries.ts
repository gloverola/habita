import { useCallback, useEffect, useState } from 'react';
import { HabitEntry, getEntriesForHabits, toggleHabitEntry as dbToggle } from '@/lib/db/habit-entries';

function getWeekDates(today: string): string[] {
  const d = new Date(today + 'T00:00:00');
  const dow = d.getDay(); // 0=Sun
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(d);
    day.setDate(d.getDate() - dow + i);
    dates.push(day.toISOString().slice(0, 10));
  }
  return dates;
}

export function useHabitEntries(habitIds: string[], today: string) {
  const [entries, setEntries] = useState<HabitEntry[]>([]);
  const weekDates = getWeekDates(today);

  const refresh = useCallback(async () => {
    if (habitIds.length === 0) { setEntries([]); return; }
    const data = await getEntriesForHabits(habitIds, weekDates[0], weekDates[6]);
    setEntries(data);
  }, [habitIds.join(','), weekDates[0], weekDates[6]]);

  useEffect(() => { refresh(); }, [refresh]);

  const toggle = useCallback(async (habitId: string, date: string) => {
    await dbToggle(habitId, date);
    await refresh();
  }, [refresh]);

  return { entries, weekDates, toggle, refresh };
}
