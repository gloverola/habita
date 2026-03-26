import { useCallback, useEffect, useState } from 'react';
import {
  Habit,
  getAllHabits,
  createHabit as dbCreateHabit,
  updateHabit as dbUpdateHabit,
  archiveHabit as dbArchiveHabit,
  deleteHabit as dbDeleteHabit,
} from '@/lib/db/habits';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await getAllHabits();
    setHabits(data);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const createHabit = useCallback(async (name: string, frequency: number) => {
    await dbCreateHabit(name, frequency);
    await refresh();
  }, [refresh]);

  const updateHabit = useCallback(async (id: string, name: string, frequency: number) => {
    await dbUpdateHabit(id, name, frequency);
    await refresh();
  }, [refresh]);

  const archiveHabit = useCallback(async (id: string) => {
    await dbArchiveHabit(id);
    await refresh();
  }, [refresh]);

  const deleteHabit = useCallback(async (id: string) => {
    await dbDeleteHabit(id);
    await refresh();
  }, [refresh]);

  return { habits, loading, refresh, createHabit, updateHabit, archiveHabit, deleteHabit };
}
