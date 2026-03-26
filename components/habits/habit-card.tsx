import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '@/components/primitives/card';
import { Text } from '@/components/primitives/text';
import { Pill } from '@/components/primitives/pill';
import { WeekStrip } from './week-strip';
import { Habit } from '@/lib/db/habits';
import { HabitEntry } from '@/lib/db/habit-entries';
import { theme } from '@/constants/theme';

interface Props {
  habit: Habit;
  entries: HabitEntry[];
  weekDates: string[];
  today: string;
  streak: number;
  onDayPress: (date: string) => void;
  onDayLongPress?: (date: string) => void;
  onPress?: () => void;
  // Reorder mode
  isEditMode?: boolean;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

function frequencyLabel(n: number): string {
  if (n === 1) return '1×/wk';
  if (n === 7) return 'daily';
  return `${n}×/wk`;
}

export function HabitCard({
  habit, entries, weekDates, today, streak,
  onDayPress, onDayLongPress, onPress,
  isEditMode, canMoveUp, canMoveDown, onMoveUp, onMoveDown,
}: Props) {
  const weekEntries = entries.filter(e => e.habit_id === habit.id);
  const doneCount = weekEntries.filter(e => e.status === 'done').length;

  return (
    <TouchableOpacity onPress={!isEditMode ? onPress : undefined} activeOpacity={isEditMode ? 1 : 0.8}>
      <Card style={styles.card}>
        <View style={styles.row}>
          {isEditMode && (
            <View style={styles.reorderBtns}>
              <TouchableOpacity
                onPress={onMoveUp}
                disabled={!canMoveUp}
                style={styles.reorderBtn}
                hitSlop={4}
              >
                <Text variant="body" color={canMoveUp ? 'ink' : 'placeholder'}>▲</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onMoveDown}
                disabled={!canMoveDown}
                style={styles.reorderBtn}
                hitSlop={4}
              >
                <Text variant="body" color={canMoveDown ? 'ink' : 'placeholder'}>▼</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.nameRow}>
                <Text variant="body" weight="semibold" numberOfLines={1} style={styles.name}>
                  {habit.name}
                </Text>
                <Pill label={frequencyLabel(habit.frequency)} variant="outline" />
              </View>
              <View style={styles.meta}>
                <Text variant="caption" color="muted">
                  {doneCount}/{weekDates.filter(d => d <= today).length} this week
                </Text>
                {streak > 0 && (
                  <Text variant="caption" color="muted">
                    🔥 {streak} day{streak === 1 ? '' : 's'}
                  </Text>
                )}
              </View>
            </View>
            {!isEditMode && (
              <WeekStrip
                weekDates={weekDates}
                today={today}
                entries={weekEntries}
                onDayPress={onDayPress}
                onDayLongPress={onDayLongPress}
              />
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  reorderBtns: {
    alignItems: 'center',
    gap: theme.spacing.xxs,
  },
  reorderBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: theme.spacing.sm,
  },
  header: {
    gap: theme.spacing.xxs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  name: {
    flex: 1,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
