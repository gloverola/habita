import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HabitForm } from '@/components/habits/habit-form';
import { Text } from '@/components/primitives/text';
import { theme } from '@/constants/theme';
import { useHabits } from '@/hooks/use-habits';

export default function AddHabitScreen() {
  const insets = useSafeAreaInsets();
  const { createHabit } = useHabits();

  async function handleSubmit(name: string, frequency: number) {
    await createHabit(name, frequency);
    router.back();
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + theme.spacing.md }]}>
      <View style={styles.header}>
        <Text variant="headline" weight="semibold">New Habit</Text>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Text variant="body" color="muted">Cancel</Text>
        </TouchableOpacity>
      </View>
      <HabitForm onSubmit={handleSubmit} submitLabel="Add Habit" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
});
