import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/primitives/text';
import { theme } from '@/constants/theme';

const MOOD_LABELS: Record<number, string> = {
  1: 'Awful',
  2: 'Bad',
  3: 'Poor',
  4: 'Meh',
  5: 'Okay',
  6: 'Good',
  7: 'Great',
  8: 'Amazing',
  9: 'Excellent',
  10: 'Perfect',
};

interface Props {
  score: number | null;
}

export function MoodScoreBadge({ score }: Props) {
  return (
    <View style={styles.container}>
      <View style={[styles.circle, score ? styles.filled : styles.empty]}>
        <Text variant="display" weight="bold" color={score ? 'white' : 'placeholder'}>
          {score ?? '—'}
        </Text>
      </View>
      <Text variant="body" color="muted" style={styles.label}>
        {score ? MOOD_LABELS[score] ?? '' : 'How are you feeling?'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.lg,
  },
  circle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filled: {
    backgroundColor: theme.colors.ink,
  },
  empty: {
    backgroundColor: theme.colors.gray100,
    borderWidth: 2,
    borderColor: theme.colors.gray200,
  },
  label: {},
});
