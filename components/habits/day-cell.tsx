import React, { useCallback, useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Text } from '@/components/primitives/text';
import { theme } from '@/constants/theme';

export type DayCellStatus = 'done' | 'skipped' | 'empty' | 'future';

interface Props {
  dayIndex: number;
  status: DayCellStatus;
  isToday?: boolean;
  hasNote?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  size?: number;
}

export function DayCell({ dayIndex, status, isToday, hasNote, onPress, onLongPress, size = theme.dayCell.size }: Props) {
  const isFuture = status === 'future';
  const isDone = status === 'done';
  const isSkipped = status === 'skipped';

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (isFuture) return;
    scale.value = withSequence(
      withSpring(0.82, { damping: 10, stiffness: 400 }),
      withSpring(1,    { damping: 12, stiffness: 300 }),
    );
    opacity.value = withSequence(
      withTiming(0.6, { duration: 60 }),
      withTiming(1,   { duration: 160 }),
    );
  }, [status]);

  const handlePress = useCallback(() => {
    scale.value = withSequence(
      withSpring(0.78, { damping: 8, stiffness: 500 }),
      withSpring(1,    { damping: 12, stiffness: 280 }),
    );
    onPress?.();
  }, [onPress]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const cellBaseStyle = [
    styles.cell,
    { width: size, height: size, borderRadius: theme.dayCell.borderRadius },
    getCellStyle(status),
    isToday && !isFuture && styles.todayBorder,
  ];

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={!isFuture ? onLongPress : undefined}
      disabled={isFuture || (!onPress && !onLongPress)}
      hitSlop={4}
      delayLongPress={400}
    >
      <Animated.View style={[cellBaseStyle, animStyle]}>
        {isDone   && <Text variant="label" weight="bold" color="white">✓</Text>}
        {isSkipped && <Text variant="label" weight="bold" color="muted">✕</Text>}
        {hasNote && !isFuture && (
          <View style={[styles.noteDot, isDone ? styles.noteDotOnDark : styles.noteDotOnLight]} />
        )}
      </Animated.View>
    </Pressable>
  );
}

function getCellStyle(status: DayCellStatus) {
  switch (status) {
    case 'done':    return styles.done;
    case 'skipped': return styles.skipped;
    case 'future':  return styles.future;
    default:        return styles.empty;
  }
}

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  done: {
    backgroundColor: theme.colors.cellDone,
  },
  skipped: {
    backgroundColor: theme.colors.cellSkipped,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  empty: {
    backgroundColor: theme.colors.cellEmpty,
  },
  future: {
    backgroundColor: theme.colors.cellFuture,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
  },
  todayBorder: {
    borderWidth: 2,
    borderColor: theme.colors.ink,
  },
  noteDot: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  noteDotOnDark: {
    backgroundColor: theme.colors.gray300,
  },
  noteDotOnLight: {
    backgroundColor: theme.colors.gray400,
  },
});
