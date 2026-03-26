import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MoodEntry } from '@/lib/db/mood-entries';
import { Text } from '@/components/primitives/text';
import { theme } from '@/constants/theme';

interface Props {
  history: MoodEntry[]; // sorted asc, last 28 days
  today: string;
}

function avg(entries: MoodEntry[]): number | null {
  if (entries.length === 0) return null;
  return entries.reduce((s, e) => s + e.score, 0) / entries.length;
}

function addDays(d: string, n: number): string {
  const date = new Date(d + 'T00:00:00');
  date.setDate(date.getDate() + n);
  return date.toISOString().slice(0, 10);
}

export function MoodInsights({ history, today }: Props) {
  const weekStart = addDays(today, -6);
  const prevWeekStart = addDays(today, -13);
  const prevWeekEnd = addDays(today, -7);

  const thisWeek = history.filter(e => e.date >= weekStart && e.date <= today);
  const lastWeek = history.filter(e => e.date >= prevWeekStart && e.date <= prevWeekEnd);

  const thisAvg = avg(thisWeek);
  const lastAvg = avg(lastWeek);

  if (thisAvg === null) return null;

  let trend: '↑' | '↓' | '→' | null = null;
  let trendColor: 'ink' | 'muted' = 'muted';
  if (lastAvg !== null) {
    const diff = thisAvg - lastAvg;
    if (diff > 0.4) { trend = '↑'; trendColor = 'ink'; }
    else if (diff < -0.4) { trend = '↓'; trendColor = 'muted'; }
    else { trend = '→'; trendColor = 'muted'; }
  }

  return (
    <View style={styles.row}>
      <Stat label="This week" value={thisAvg.toFixed(1)} />
      {lastAvg !== null && <Stat label="Last week" value={lastAvg.toFixed(1)} />}
      {trend && (
        <View style={styles.stat}>
          <Text variant="caption" color="muted" style={styles.label}>Trend</Text>
          <Text variant="headline" weight="semibold" color={trendColor}>{trend}</Text>
        </View>
      )}
      <Stat label="Entries" value={String(history.length)} />
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text variant="caption" color="muted" style={styles.label}>{label}</Text>
      <Text variant="headline" weight="semibold">{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: theme.spacing.sm,
  },
  stat: {
    alignItems: 'center',
    gap: 2,
  },
  label: {
    letterSpacing: 0.2,
  },
});
