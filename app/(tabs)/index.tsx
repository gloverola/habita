import React, { useCallback, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import { ScreenHeader } from '@/components/screens/screen-header';
import { EmptyState } from '@/components/screens/empty-state';
import { HabitList } from '@/components/habits/habit-list';
import { DailySummary } from '@/components/habits/daily-summary';
import { WeeklyReport } from '@/components/habits/weekly-report';
import { MilestoneOverlay } from '@/components/habits/milestone-overlay';
import { NoteModal } from '@/components/habits/note-modal';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Text } from '@/components/primitives/text';
import { useHabits } from '@/hooks/use-habits';
import { useHabitEntries } from '@/hooks/use-habit-entries';
import { useStreaks } from '@/hooks/use-streaks';
import { Habit } from '@/lib/db/habits';
import { swapHabitOrder } from '@/lib/db/habits';
import { upsertEntryNote, getEntriesForHabits } from '@/lib/db/habit-entries';
import { getMoodEntries } from '@/lib/db/mood-entries';
import { getSetting, setSetting } from '@/lib/db/settings';
import { theme } from '@/constants/theme';

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function getLastWeekRange(): { start: string; end: string } {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun
  const daysSinceMonday = (dayOfWeek + 6) % 7;
  const thisMonday = new Date(today);
  thisMonday.setDate(today.getDate() - daysSinceMonday);
  const lastMonday = new Date(thisMonday);
  lastMonday.setDate(thisMonday.getDate() - 7);
  const lastSunday = new Date(thisMonday);
  lastSunday.setDate(thisMonday.getDate() - 1);
  return {
    start: lastMonday.toISOString().slice(0, 10),
    end: lastSunday.toISOString().slice(0, 10),
  };
}

function getThisMonday(): string {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysSinceMonday = (dayOfWeek + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysSinceMonday);
  return monday.toISOString().slice(0, 10);
}

export default function HabitsScreen() {
  const today = getToday();
  const { habits, loading, refresh: refreshHabits } = useHabits();
  const habitIds = habits.map(h => h.id);
  const { entries, weekDates, toggle, refresh: refreshEntries } = useHabitEntries(habitIds, today);
  const { streaks, refresh: refreshStreaks } = useStreaks(habitIds, today);

  const [isEditMode, setIsEditMode] = useState(false);

  // Note modal state
  const [noteModal, setNoteModal] = useState<{ habitId: string; date: string } | null>(null);
  const noteEntry = noteModal
    ? entries.find(e => e.habit_id === noteModal.habitId && e.date === noteModal.date)
    : null;
  const noteHabit = noteModal ? habits.find(h => h.id === noteModal.habitId) : null;

  // Weekly report state
  const [showReport, setShowReport] = useState(false);
  const [reportEntries, setReportEntries] = useState<any[]>([]);
  const [reportMoods, setReportMoods] = useState<any[]>([]);
  const lastWeek = getLastWeekRange();

  useFocusEffect(useCallback(() => {
    refreshHabits();
    loadReport();
  }, [refreshHabits]));

  async function loadReport() {
    const thisMonday = getThisMonday();
    const dismissed = await getSetting('lastReportDismissed');
    if (dismissed === thisMonday) { setShowReport(false); return; }

    const ids = (await import('@/lib/db/habits').then(m => m.getAllHabits()))
      .map(h => h.id);
    if (ids.length === 0) { setShowReport(false); return; }

    const [rEntries, rMoods] = await Promise.all([
      getEntriesForHabits(ids, lastWeek.start, lastWeek.end),
      getMoodEntries(lastWeek.start, lastWeek.end),
    ]);
    if (rEntries.length === 0) { setShowReport(false); return; }
    setReportEntries(rEntries);
    setReportMoods(rMoods);
    setShowReport(true);
  }

  async function handleDismissReport() {
    await setSetting('lastReportDismissed', getThisMonday());
    setShowReport(false);
  }

  React.useEffect(() => { refreshEntries(); }, [habits.length]);

  const handleDayPress = useCallback(async (habitId: string, date: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await toggle(habitId, date);
    refreshStreaks();
  }, [toggle, refreshStreaks]);

  const handleDayLongPress = useCallback((habitId: string, date: string) => {
    Haptics.selectionAsync();
    setNoteModal({ habitId, date });
  }, []);

  const handleSaveNote = useCallback(async (note: string) => {
    if (!noteModal) return;
    await upsertEntryNote(noteModal.habitId, noteModal.date, note);
    await refreshEntries();
    setNoteModal(null);
  }, [noteModal, refreshEntries]);

  const handleHabitPress = useCallback((habit: Habit) => {
    if (isEditMode) return;
    router.push(`/habit/${habit.id}`);
  }, [isEditMode]);

  const handleMoveUp = useCallback(async (habit: Habit) => {
    const idx = habits.findIndex(h => h.id === habit.id);
    if (idx <= 0) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await swapHabitOrder(habit.id, habits[idx - 1].id);
    await refreshHabits();
  }, [habits, refreshHabits]);

  const handleMoveDown = useCallback(async (habit: Habit) => {
    const idx = habits.findIndex(h => h.id === habit.id);
    if (idx >= habits.length - 1) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await swapHabitOrder(habit.id, habits[idx + 1].id);
    await refreshHabits();
  }, [habits, refreshHabits]);

  const todayDoneCount = entries.filter(e => e.date === today && e.status === 'done').length;
  const habitNames: Record<string, string> = {};
  habits.forEach(h => { habitNames[h.id] = h.name; });

  // Top streak for report
  const topEntry = Object.entries(streaks).sort(([, a], [, b]) => b - a)[0];
  const topStreakName = topEntry ? habitNames[topEntry[0]] ?? null : null;
  const topStreak = topEntry ? topEntry[1] : 0;

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Habita"
        rightAction={
          <View style={styles.headerActions}>
            {habits.length > 1 && (
              <TouchableOpacity
                onPress={() => setIsEditMode(v => !v)}
                style={styles.headerBtn}
                hitSlop={8}
              >
                <Text variant="body" weight="medium" color={isEditMode ? 'ink' : 'muted'}>
                  {isEditMode ? 'Done' : 'Edit'}
                </Text>
              </TouchableOpacity>
            )}
            {!isEditMode && (
              <TouchableOpacity
                onPress={() => router.push('/add-habit')}
                style={styles.headerBtn}
                hitSlop={8}
              >
                <IconSymbol name="plus" size={22} color={theme.colors.ink} />
              </TouchableOpacity>
            )}
          </View>
        }
      />

      {!loading && (
        <HabitList
          habits={habits}
          entries={entries}
          weekDates={weekDates}
          today={today}
          streaks={streaks}
          isEditMode={isEditMode}
          onDayPress={handleDayPress}
          onDayLongPress={handleDayLongPress}
          onHabitPress={handleHabitPress}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          ListHeaderComponent={
            <View>
              <DailySummary doneCount={todayDoneCount} totalCount={habits.length} />
              {showReport && (
                <WeeklyReport
                  weekStart={lastWeek.start}
                  weekEnd={lastWeek.end}
                  habitCount={habits.length}
                  entries={reportEntries}
                  moodEntries={reportMoods}
                  topStreakName={topStreakName}
                  topStreak={topStreak}
                  onDismiss={handleDismissReport}
                />
              )}
            </View>
          }
          ListEmptyComponent={
            <EmptyState
              message="No habits yet. Start tracking something you want to build."
              ctaLabel="Add your first habit"
              onCta={() => router.push('/add-habit')}
            />
          }
        />
      )}

      <MilestoneOverlay streaks={streaks} habitNames={habitNames} />

      <NoteModal
        visible={!!noteModal}
        date={noteModal?.date ?? today}
        habitName={noteHabit?.name ?? ''}
        initialNote={noteEntry?.note ?? ''}
        onSave={handleSaveNote}
        onClose={() => setNoteModal(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  headerBtn: {
    paddingHorizontal: theme.spacing.xs,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
