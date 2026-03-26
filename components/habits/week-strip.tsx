import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DayCell, DayCellStatus } from './day-cell';
import { HabitEntry } from '@/lib/db/habit-entries';
import { theme } from '@/constants/theme';

interface Props {
  weekDates: string[];
  today: string;
  entries: HabitEntry[];
  onDayPress?: (date: string) => void;
  onDayLongPress?: (date: string) => void;
}

export function WeekStrip({ weekDates, today, entries, onDayPress, onDayLongPress }: Props) {
  function getStatus(date: string): DayCellStatus {
    if (date > today) return 'future';
    const entry = entries.find(e => e.date === date);
    if (!entry) return 'empty';
    return entry.status;
  }

  function getHasNote(date: string): boolean {
    return !!entries.find(e => e.date === date)?.note;
  }

  return (
    <View style={styles.row}>
      {weekDates.map((date, i) => (
        <DayCell
          key={date}
          dayIndex={i}
          status={getStatus(date)}
          isToday={date === today}
          hasNote={getHasNote(date)}
          onPress={date <= today ? () => onDayPress?.(date) : undefined}
          onLongPress={date <= today ? () => onDayLongPress?.(date) : undefined}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: theme.dayCell.gap,
  },
});
