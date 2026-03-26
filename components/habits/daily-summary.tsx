import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { Text } from '@/components/primitives/text';
import { theme } from '@/constants/theme';

interface Props {
  doneCount: number;
  totalCount: number;
}

const MESSAGES = [
  { threshold: 0,    text: 'Let\'s go — first one counts.' },
  { threshold: 0.01, text: 'Good start, keep going.' },
  { threshold: 0.5,  text: 'Halfway there!' },
  { threshold: 0.99, text: 'All done — great day.' },
];

function getMessage(ratio: number): string {
  let msg = MESSAGES[0].text;
  for (const m of MESSAGES) {
    if (ratio >= m.threshold) msg = m.text;
  }
  return msg;
}

export function DailySummary({ doneCount, totalCount }: Props) {
  const progress = useSharedValue(0);
  const ratio = totalCount > 0 ? doneCount / totalCount : 0;

  useEffect(() => {
    progress.value = withTiming(ratio, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
  }, [ratio]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%` as any,
  }));

  if (totalCount === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text variant="headline" weight="bold">
          {doneCount}
          <Text variant="headline" weight="regular" color="muted">
            /{totalCount} today
          </Text>
        </Text>
        <Text variant="caption" color="muted">{getMessage(ratio)}</Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, barStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.gray200,
    overflow: 'hidden',
  },
  fill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.ink,
  },
});
