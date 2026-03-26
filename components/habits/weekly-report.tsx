import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '@/components/primitives/card';
import { Text } from '@/components/primitives/text';
import { theme } from '@/constants/theme';
import { HabitEntry } from '@/lib/db/habit-entries';
import { MoodEntry } from '@/lib/db/mood-entries';

interface Props {
  weekStart: string; // Mon YYYY-MM-DD
  weekEnd: string;   // Sun YYYY-MM-DD
  habitCount: number;
  entries: HabitEntry[];
  moodEntries: MoodEntry[];
  topStreakName: string | null;
  topStreak: number;
  onDismiss: () => void;
}

export function WeeklyReport({
  weekStart, weekEnd, habitCount, entries, moodEntries,
  topStreakName, topStreak, onDismiss,
}: Props) {
  const doneEntries = entries.filter(e => e.status === 'done');
  const possibleDays = 7 * habitCount;
  const completionPct = possibleDays > 0 ? Math.round((doneEntries.length / possibleDays) * 100) : 0;
  const moodAvg = moodEntries.length > 0
    ? (moodEntries.reduce((s, e) => s + e.score, 0) / moodEntries.length).toFixed(1)
    : null;

  const fmt = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text variant="caption" weight="semibold" color="muted" style={styles.label}>LAST WEEK</Text>
          <Text variant="caption" color="muted">{fmt(weekStart)} – {fmt(weekEnd)}</Text>
        </View>
        <TouchableOpacity onPress={onDismiss} hitSlop={8}>
          <Text variant="caption" color="placeholder">✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <StatItem value={`${completionPct}%`} label="Complete" />
        {moodAvg && <StatItem value={moodAvg} label="Avg mood" />}
        {topStreakName && topStreak > 0 && (
          <StatItem value={`🔥 ${topStreak}d`} label={topStreakName} />
        )}
      </View>
    </Card>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text variant="headline" weight="bold">{value}</Text>
      <Text variant="label" color="muted" numberOfLines={1}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  label: { letterSpacing: 0.5 },
  stats: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  stat: {
    gap: 2,
  },
});
