import React from 'react';
import { View } from 'react-native';
import Svg, { Polyline, Circle, G } from 'react-native-svg';
import { MoodEntry } from '@/lib/db/mood-entries';
import { ChartAxis } from './chart-axis';
import { theme } from '@/constants/theme';

const PADDING = { top: 12, right: 12, bottom: 24, left: 28 };

interface Props {
  data: MoodEntry[];
  width: number;
  height: number;
  today: string;
  days?: number;
}

function addDays(dateStr: string, d: number): string {
  const date = new Date(dateStr + 'T00:00:00');
  date.setDate(date.getDate() + d);
  return date.toISOString().slice(0, 10);
}

export function MoodChart({ data, width, height, today, days = 28 }: Props) {
  if (width === 0) return <View style={{ height }} />;

  const fromDate = addDays(today, -(days - 1));
  const chartWidth = width - PADDING.left - PADDING.right;
  const chartHeight = height - PADDING.top - PADDING.bottom;

  function xForIndex(index: number): number {
    return PADDING.left + (index / (days - 1)) * chartWidth;
  }

  function dateToIndex(date: string): number {
    const from = new Date(fromDate + 'T00:00:00');
    const d = new Date(date + 'T00:00:00');
    return Math.round((d.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
  }

  function yForScore(score: number): number {
    return PADDING.top + chartHeight - ((score - 1) / 9) * chartHeight;
  }

  // Build polyline points only for entries within range
  const validEntries = data
    .filter(e => e.date >= fromDate && e.date <= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  // Group consecutive entries into segments (gap-aware)
  const segments: MoodEntry[][] = [];
  let current: MoodEntry[] = [];
  for (let i = 0; i < validEntries.length; i++) {
    if (current.length === 0) {
      current.push(validEntries[i]);
    } else {
      const prev = current[current.length - 1];
      const dayGap = dateToIndex(validEntries[i].date) - dateToIndex(prev.date);
      if (dayGap <= 2) {
        current.push(validEntries[i]);
      } else {
        segments.push(current);
        current = [validEntries[i]];
      }
    }
  }
  if (current.length > 0) segments.push(current);

  const todayEntry = data.find(e => e.date === today);

  return (
    <Svg width={width} height={height}>
      <ChartAxis
        width={width}
        height={height}
        paddingLeft={PADDING.left}
        paddingRight={PADDING.right}
        paddingTop={PADDING.top}
        paddingBottom={PADDING.bottom}
        yForScore={yForScore}
      />

      {segments.map((segment, si) => {
        if (segment.length < 2) return null;
        const points = segment
          .map(e => `${xForIndex(dateToIndex(e.date))},${yForScore(e.score)}`)
          .join(' ');
        return (
          <Polyline
            key={si}
            points={points}
            fill="none"
            stroke={theme.colors.ink}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })}

      {validEntries.map(entry => {
        const x = xForIndex(dateToIndex(entry.date));
        const y = yForScore(entry.score);
        const isToday = entry.date === today;
        return (
          <G key={entry.date}>
            <Circle
              cx={x}
              cy={y}
              r={isToday ? 5 : 3}
              fill={isToday ? theme.colors.ink : theme.colors.surface}
              stroke={theme.colors.ink}
              strokeWidth={isToday ? 0 : 1.5}
            />
          </G>
        );
      })}
    </Svg>
  );
}
