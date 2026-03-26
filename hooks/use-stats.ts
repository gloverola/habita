import { useCallback, useEffect, useState } from 'react';
import { getAllTimeStats, AllTimeStats, getMoodHabitCorrelation, CorrelationResult } from '@/lib/db/stats';
import { useFocusEffect } from '@react-navigation/native';

export function useAllTimeStats() {
  const [stats, setStats] = useState<AllTimeStats | null>(null);

  const refresh = useCallback(async () => {
    const data = await getAllTimeStats();
    setStats(data);
  }, []);

  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  return { stats, refresh };
}

export function useMoodCorrelation() {
  const [correlation, setCorrelation] = useState<CorrelationResult | null>(null);

  const refresh = useCallback(async () => {
    const data = await getMoodHabitCorrelation();
    setCorrelation(data);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { correlation, refresh };
}
