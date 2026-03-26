import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, Switch } from 'react-native';
import { router } from 'expo-router';

import { ScreenHeader } from '@/components/screens/screen-header';
import { Card } from '@/components/primitives/card';
import { Text } from '@/components/primitives/text';
import { Divider } from '@/components/primitives/divider';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { EmptyState } from '@/components/screens/empty-state';
import { getAllHabitsIncludingArchived, Habit, unarchiveHabit, deleteHabit } from '@/lib/db/habits';
import { useAllTimeStats } from '@/hooks/use-stats';
import { useNotifications } from '@/hooks/use-notifications';
import { theme } from '@/constants/theme';

function formatDate(d: string | null): string {
  if (!d) return '—';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatHour(h: number): string {
  const suffix = h >= 12 ? 'PM' : 'AM';
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display}:00 ${suffix}`;
}

export default function SettingsScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const { stats } = useAllTimeStats();
  const { enabled, hour, enable, disable, changeHour } = useNotifications();

  const refresh = useCallback(async () => {
    const data = await getAllHabitsIncludingArchived();
    setHabits(data);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  function handleEdit(habit: Habit) { router.push(`/habit/${habit.id}`); }

  function confirmUnarchive(habit: Habit) {
    Alert.alert('Unarchive', `Restore "${habit.name}" to your habit list?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Restore', onPress: async () => { await unarchiveHabit(habit.id); refresh(); } },
    ]);
  }

  function confirmDelete(habit: Habit) {
    Alert.alert('Delete Habit', `Permanently delete "${habit.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteHabit(habit.id); refresh(); } },
    ]);
  }

  const active = habits.filter(h => h.archived === 0);
  const archived = habits.filter(h => h.archived === 1);

  return (
    <View style={styles.container}>
      <ScreenHeader title="More" />
      <FlatList
        data={[]}
        renderItem={null}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.sections}>

            {/* All-time stats */}
            {stats && stats.totalDone > 0 && (
              <View>
                <Text variant="caption" weight="semibold" color="muted" style={styles.sectionLabel}>
                  ALL TIME
                </Text>
                <Card padding={theme.spacing.md}>
                  <View style={styles.statsGrid}>
                    <StatCell label="Logged" value={String(stats.totalDone)} />
                    <StatCell label="Active days" value={String(stats.activeDays)} />
                    <StatCell label="Best streak" value={`${stats.longestStreak}d`} />
                    <StatCell label="Since" value={stats.firstDate ? formatDate(stats.firstDate) : '—'} />
                  </View>
                </Card>
              </View>
            )}

            {/* Reminders */}
            <View>
              <Text variant="caption" weight="semibold" color="muted" style={styles.sectionLabel}>
                REMINDERS
              </Text>
              <Card padding={0}>
                <View style={styles.row}>
                  <Text variant="body">Daily reminder</Text>
                  <Switch
                    value={enabled}
                    onValueChange={v => v ? enable() : disable()}
                    trackColor={{ true: theme.colors.ink }}
                    thumbColor={theme.colors.white}
                  />
                </View>
                {enabled && (
                  <>
                    <Divider />
                    <View style={styles.row}>
                      <Text variant="body" color="muted">Time</Text>
                      <View style={styles.hourPicker}>
                        <TouchableOpacity
                          onPress={() => changeHour(Math.max(6, hour - 1))}
                          style={styles.hourBtn}
                          disabled={hour <= 6}
                        >
                          <Text variant="body" color={hour <= 6 ? 'placeholder' : 'ink'}>−</Text>
                        </TouchableOpacity>
                        <Text variant="body" weight="medium" style={styles.hourText}>{formatHour(hour)}</Text>
                        <TouchableOpacity
                          onPress={() => changeHour(Math.min(23, hour + 1))}
                          style={styles.hourBtn}
                          disabled={hour >= 23}
                        >
                          <Text variant="body" color={hour >= 23 ? 'placeholder' : 'ink'}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </>
                )}
              </Card>
            </View>

            {/* Active habits */}
            {active.length > 0 && (
              <View>
                <Text variant="caption" weight="semibold" color="muted" style={styles.sectionLabel}>
                  ACTIVE
                </Text>
                <Card padding={0}>
                  {active.map((habit, i) => (
                    <View key={habit.id}>
                      {i > 0 && <Divider />}
                      <TouchableOpacity style={styles.row} onPress={() => handleEdit(habit)} activeOpacity={0.7}>
                        <Text variant="body" style={{ flex: 1 }}>{habit.name}</Text>
                        <IconSymbol name="chevron.right" size={16} color={theme.colors.gray400} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </Card>
              </View>
            )}

            {/* Archived habits */}
            {archived.length > 0 && (
              <View>
                <Text variant="caption" weight="semibold" color="muted" style={styles.sectionLabel}>
                  ARCHIVED
                </Text>
                <Card padding={0}>
                  {archived.map((habit, i) => (
                    <View key={habit.id}>
                      {i > 0 && <Divider />}
                      <View style={styles.row}>
                        <Text variant="body" color="muted" style={{ flex: 1 }}>{habit.name}</Text>
                        <TouchableOpacity onPress={() => confirmUnarchive(habit)} hitSlop={8} style={styles.actionBtn}>
                          <Text variant="caption" weight="medium">Restore</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => confirmDelete(habit)} hitSlop={8} style={styles.actionBtn}>
                          <Text variant="caption" weight="medium" color="danger">Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </Card>
              </View>
            )}

            {habits.length === 0 && (
              <EmptyState message="No habits yet. Add one from the Habits tab." />
            )}
          </View>
        }
      />
    </View>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCell}>
      <Text variant="headline" weight="bold">{value}</Text>
      <Text variant="label" color="muted">{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
    flexGrow: 1,
  },
  sections: {
    gap: theme.spacing.lg,
  },
  sectionLabel: {
    letterSpacing: 0.5,
    marginBottom: theme.spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  statCell: {
    width: '45%',
    gap: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + theme.spacing.xxs,
    minHeight: 48,
    gap: theme.spacing.sm,
  },
  actionBtn: {
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
  },
  hourPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  hourBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hourText: {
    minWidth: 72,
    textAlign: 'center',
  },
});
