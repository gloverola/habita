import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/primitives/text';
import { Divider } from '@/components/primitives/divider';
import { Card } from '@/components/primitives/card';
import { HabitForm } from '@/components/habits/habit-form';
import { YearHeatmap } from '@/components/habits/year-heatmap';
import { useHabits } from '@/hooks/use-habits';
import { getHabitById, Habit } from '@/lib/db/habits';
import { getEntriesForHabit, HabitEntry } from '@/lib/db/habit-entries';
import { theme } from '@/constants/theme';

function addDays(d: string, n: number): string {
  const date = new Date(d + 'T00:00:00');
  date.setDate(date.getDate() + n);
  return date.toISOString().slice(0, 10);
}

export default function EditHabitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { updateHabit, archiveHabit, deleteHabit } = useHabits();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [yearEntries, setYearEntries] = useState<HabitEntry[]>([]);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (!id) return;
    getHabitById(id).then(setHabit);
    getEntriesForHabit(id, addDays(today, -364), today).then(setYearEntries);
  }, [id]);

  async function handleSubmit(name: string, frequency: number) {
    if (!id) return;
    await updateHabit(id, name, frequency);
    router.back();
  }

  function confirmArchive() {
    Alert.alert('Archive Habit', 'This habit will be hidden from your list. History is preserved.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Archive', style: 'destructive', onPress: async () => {
        if (id) { await archiveHabit(id); router.back(); }
      }},
    ]);
  }

  function confirmDelete() {
    Alert.alert('Delete Habit', 'This will permanently delete this habit and all its history.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        if (id) { await deleteHabit(id); router.back(); }
      }},
    ]);
  }

  if (!habit) return null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + theme.spacing.md }]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text variant="headline" weight="semibold" numberOfLines={1} style={{ flex: 1 }}>
          {habit.name}
        </Text>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Text variant="body" color="muted">Cancel</Text>
        </TouchableOpacity>
      </View>

      <HabitForm
        initialName={habit.name}
        initialFrequency={habit.frequency}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />

      <Card style={styles.heatmapCard}>
        <YearHeatmap entries={yearEntries} today={today} />
      </Card>

      <Divider spacing={theme.spacing.xs} />

      <View style={styles.dangerZone}>
        <Text variant="caption" weight="semibold" color="muted" style={styles.dangerLabel}>
          DANGER ZONE
        </Text>
        <TouchableOpacity style={styles.dangerBtn} onPress={confirmArchive}>
          <Text variant="body" color="muted">Archive Habit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dangerBtn} onPress={confirmDelete}>
          <Text variant="body" color="danger">Delete Habit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
    paddingBottom: theme.spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  heatmapCard: {
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  dangerZone: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xs,
  },
  dangerLabel: {
    letterSpacing: 0.5,
    marginBottom: theme.spacing.sm,
  },
  dangerBtn: {
    paddingVertical: theme.spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
  },
});
