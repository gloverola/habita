import { useCallback, useEffect, useState } from 'react';
import { getStreaks } from '@/lib/streaks';

export function useStreaks(habitIds: string[], today: string) {
  const [streaks, setStreaks] = useState<Record<string, number>>({});

  const refresh = useCallback(async () => {
    const data = await getStreaks(habitIds, today);
    setStreaks(data);
  }, [habitIds.join(','), today]);

  useEffect(() => { refresh(); }, [refresh]);

  return { streaks, refresh };
}
