import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '@/components/primitives/text';
import { HabitEntry } from '@/lib/db/habit-entries';
import { theme } from '@/constants/theme';

const CELL = 10;
const GAP = 2;
const STEP = CELL + GAP;
const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

interface Props {
  entries: HabitEntry[];
  today: string;
}

interface DayInfo {
  date: string;
  status: 'done' | 'skipped' | 'empty' | 'future';
}

function buildGrid(today: string, entries: HabitEntry[]): DayInfo[][] {
  const entryMap = new Map(entries.map(e => [e.date, e.status]));
  const todayDate = new Date(today + 'T00:00:00');

  // Start from Sunday 52 weeks ago
  const startDate = new Date(todayDate);
  startDate.setDate(todayDate.getDate() - todayDate.getDay() - 51 * 7);

  const weeks: DayInfo[][] = [];
  const cursor = new Date(startDate);

  for (let w = 0; w < 52; w++) {
    const week: DayInfo[] = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = cursor.toISOString().slice(0, 10);
      const status = dateStr > today
        ? 'future'
        : (entryMap.get(dateStr) as 'done' | 'skipped') ?? 'empty';
      week.push({ date: dateStr, status });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

function cellColor(status: DayInfo['status']): string {
  switch (status) {
    case 'done':    return theme.colors.ink;
    case 'skipped': return theme.colors.gray300;
    case 'future':  return 'transparent';
    default:        return theme.colors.gray100;
  }
}

function getMonthLabel(week: DayInfo[]): string | null {
  // Show month label if the first day of this week is the 1st of a month
  // or if this week contains the 1st
  for (const day of week) {
    const d = new Date(day.date + 'T00:00:00');
    if (d.getDate() <= 7 && d.getDay() === 0) {
      return MONTHS[d.getMonth()];
    }
  }
  return null;
}

export function YearHeatmap({ entries, today }: Props) {
  const weeks = buildGrid(today, entries);

  return (
    <View style={styles.container}>
      <Text variant="caption" weight="semibold" color="muted" style={styles.sectionLabel}>
        PAST YEAR
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View>
          {/* Month labels */}
          <View style={styles.monthRow}>
            {weeks.map((week, wi) => {
              const label = getMonthLabel(week);
              return (
                <View key={wi} style={{ width: STEP }}>
                  {label && (
                    <Text variant="label" color="muted" style={styles.monthLabel}>{label}</Text>
                  )}
                </View>
              );
            })}
          </View>
          {/* Grid */}
          <View style={styles.grid}>
            {/* Day labels column */}
            <View style={styles.dayLabels}>
              {DAYS.map((d, i) => (
                <View key={i} style={{ height: STEP, justifyContent: 'center' }}>
                  {i % 2 === 1 && (
                    <Text variant="label" color="muted" style={styles.dayLabel}>{d}</Text>
                  )}
                </View>
              ))}
            </View>
            {/* Week columns */}
            {weeks.map((week, wi) => (
              <View key={wi} style={styles.weekCol}>
                {week.map((day, di) => (
                  <View
                    key={di}
                    style={[
                      styles.cell,
                      { backgroundColor: cellColor(day.status) },
                    ]}
                  />
                ))}
              </View>
            ))}
          </View>
          {/* Legend */}
          <View style={styles.legend}>
            <Text variant="label" color="muted">Less</Text>
            {(['empty', 'skipped', 'done'] as const).map(s => (
              <View key={s} style={[styles.cell, { backgroundColor: cellColor(s) }]} />
            ))}
            <Text variant="label" color="muted">More</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  sectionLabel: {
    letterSpacing: 0.5,
  },
  scroll: {
    paddingBottom: theme.spacing.xs,
  },
  monthRow: {
    flexDirection: 'row',
    marginLeft: 18,
    height: 14,
    marginBottom: 2,
  },
  monthLabel: {
    fontSize: 9,
  },
  grid: {
    flexDirection: 'row',
    gap: GAP,
  },
  dayLabels: {
    width: 16,
    gap: GAP,
  },
  dayLabel: {
    fontSize: 9,
    textAlign: 'right',
  },
  weekCol: {
    gap: GAP,
  },
  cell: {
    width: CELL,
    height: CELL,
    borderRadius: 2,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: GAP + 2,
    marginTop: theme.spacing.xs,
    marginLeft: 18,
  },
});
