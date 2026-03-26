import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useFocusEffect } from '@react-navigation/native';

import { ScreenHeader } from '@/components/screens/screen-header';
import { Card } from '@/components/primitives/card';
import { Text } from '@/components/primitives/text';
import { MoodScoreBadge } from '@/components/mood/mood-score-badge';
import { MoodInput } from '@/components/mood/mood-input';
import { MoodChart } from '@/components/mood/mood-chart';
import { MoodInsights } from '@/components/mood/mood-insights';
import { MoodCorrelation } from '@/components/mood/mood-correlation';
import { useMood } from '@/hooks/use-mood';
import { useMoodCorrelation } from '@/hooks/use-stats';
import { theme } from '@/constants/theme';

const CHART_HEIGHT = 160;

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function MoodScreen() {
  const today = getToday();
  const { todayEntry, history, setMood, refresh } = useMood(today);
  const { correlation } = useMoodCorrelation();
  const [chartWidth, setChartWidth] = useState(0);

  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  async function handleMoodChange(score: number) {
    await Haptics.selectionAsync();
    await setMood(score);
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Mood" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <MoodScoreBadge score={todayEntry?.score ?? null} />

        <Card style={styles.inputCard}>
          <Text variant="caption" weight="semibold" color="muted" style={styles.sectionLabel}>
            TODAY
          </Text>
          <MoodInput value={todayEntry?.score ?? null} onChange={handleMoodChange} />
        </Card>

        <Card style={styles.chartCard}>
          <Text variant="caption" weight="semibold" color="muted" style={styles.sectionLabel}>
            LAST 28 DAYS
          </Text>
          <View
            onLayout={e => setChartWidth(e.nativeEvent.layout.width)}
            style={{ height: CHART_HEIGHT }}
          >
            <MoodChart
              data={history}
              width={chartWidth}
              height={CHART_HEIGHT}
              today={today}
              days={28}
            />
          </View>
          <MoodInsights history={history} today={today} />
          <MoodCorrelation correlation={correlation} />
        </Card>
      </ScrollView>
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
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  inputCard: {
    gap: theme.spacing.sm,
  },
  chartCard: {
    gap: theme.spacing.sm,
  },
  sectionLabel: {
    letterSpacing: 0.5,
  },
});
