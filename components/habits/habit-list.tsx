import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { HabitCard } from './habit-card';
import { Habit } from '@/lib/db/habits';
import { HabitEntry } from '@/lib/db/habit-entries';
import { theme } from '@/constants/theme';

interface Props {
  habits: Habit[];
  entries: HabitEntry[];
  weekDates: string[];
  today: string;
  streaks?: Record<string, number>;
  isEditMode?: boolean;
  onDayPress: (habitId: string, date: string) => void;
  onDayLongPress?: (habitId: string, date: string) => void;
  onHabitPress?: (habit: Habit) => void;
  onMoveUp?: (habit: Habit) => void;
  onMoveDown?: (habit: Habit) => void;
  ListHeaderComponent?: React.ReactElement;
  ListEmptyComponent?: React.ReactElement;
}

export function HabitList({
  habits, entries, weekDates, today, streaks = {}, isEditMode,
  onDayPress, onDayLongPress, onHabitPress,
  onMoveUp, onMoveDown,
  ListHeaderComponent, ListEmptyComponent,
}: Props) {
  return (
    <FlatList
      data={habits}
      keyExtractor={item => item.id}
      renderItem={({ item, index }) => (
        <HabitCard
          habit={item}
          entries={entries}
          weekDates={weekDates}
          today={today}
          streak={streaks[item.id] ?? 0}
          isEditMode={isEditMode}
          canMoveUp={isEditMode && index > 0}
          canMoveDown={isEditMode && index < habits.length - 1}
          onMoveUp={() => onMoveUp?.(item)}
          onMoveDown={() => onMoveDown?.(item)}
          onDayPress={(date) => onDayPress(item.id, date)}
          onDayLongPress={(date) => onDayLongPress?.(item.id, date)}
          onPress={() => onHabitPress?.(item)}
        />
      )}
      contentContainerStyle={styles.content}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
    flexGrow: 1,
  },
});
