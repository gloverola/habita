import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/primitives/text';
import { theme } from '@/constants/theme';

const MILESTONES = [7, 14, 30, 60, 100];
const { width, height } = Dimensions.get('window');

interface Props {
  streaks: Record<string, number>;
  habitNames: Record<string, string>; // id → name
}

export function MilestoneOverlay({ streaks, habitNames }: Props) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.7);
  const seenRef = useRef<Set<string>>(new Set());
  const [visible, setVisible] = React.useState(false);
  const [info, setInfo] = React.useState({ streak: 0, name: '' });

  useEffect(() => {
    for (const [id, streak] of Object.entries(streaks)) {
      if (!MILESTONES.includes(streak)) continue;
      const key = `${id}-${streak}`;
      if (seenRef.current.has(key)) continue;
      seenRef.current.add(key);

      const name = habitNames[id] ?? '';
      setInfo({ streak, name });
      setVisible(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      opacity.value = withSequence(
        withTiming(1, { duration: 300 }),
        withDelay(1800, withTiming(0, { duration: 400 })),
      );
      scale.value = withSequence(
        withSpring(1, { damping: 12, stiffness: 200 }),
        withDelay(1800, withTiming(0.8, { duration: 400 })),
      );

      setTimeout(() => setVisible(false), 2600);
      break; // Show one at a time
    }
  }, [streaks]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const contentStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, overlayStyle]} pointerEvents="none">
      <Animated.View style={[styles.content, contentStyle]}>
        <Text variant="display" weight="bold" color="white" style={styles.streak}>
          {info.streak}
        </Text>
        <Text variant="caption" weight="semibold" color="white" style={styles.label}>
          DAY STREAK
        </Text>
        <Text variant="body" color="white" style={styles.name} numberOfLines={1}>
          {info.name}
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,10,10,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  content: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  streak: {
    fontSize: 72,
    lineHeight: 80,
  },
  label: {
    letterSpacing: 3,
    opacity: 0.8,
  },
  name: {
    opacity: 0.7,
    marginTop: theme.spacing.sm,
  },
});
