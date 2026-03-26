import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/primitives/text';
import { theme } from '@/constants/theme';
import { CorrelationResult } from '@/lib/db/stats';

interface Props {
  correlation: CorrelationResult | null;
}

export function MoodCorrelation({ correlation }: Props) {
  if (!correlation || correlation.sampleSize < 5) return null;
  const { allDoneAvg, notAllDoneAvg } = correlation;
  if (allDoneAvg === null || notAllDoneAvg === null) return null;

  const diff = allDoneAvg - notAllDoneAvg;
  if (Math.abs(diff) < 0.3) return null; // Not enough signal

  const better = diff > 0;

  return (
    <View style={styles.container}>
      <Text variant="caption" weight="semibold" color="muted" style={styles.label}>
        HABIT · MOOD CORRELATION
      </Text>
      <Text variant="body">
        On days you complete{' '}
        <Text variant="body" weight="semibold">all habits</Text>
        {', your avg mood is '}
        <Text variant="body" weight="bold">{allDoneAvg.toFixed(1)}</Text>
        {' vs '}
        <Text variant="body" weight="bold">{notAllDoneAvg.toFixed(1)}</Text>
        {' otherwise — '}
        <Text variant="body" weight="semibold" color={better ? 'ink' : 'muted'}>
          {better ? `${diff.toFixed(1)} pts higher` : `${Math.abs(diff).toFixed(1)} pts lower`}
        </Text>
        .
      </Text>
      <Text variant="caption" color="muted">
        Based on {correlation.sampleSize} days of data
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.xs,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: theme.spacing.sm,
  },
  label: {
    letterSpacing: 0.5,
  },
});
