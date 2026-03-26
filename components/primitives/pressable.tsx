import React, { useCallback } from 'react';
import { Pressable as RNPressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface Props extends PressableProps {
  style?: StyleProp<ViewStyle>;
  scaleAmount?: number;
  children: React.ReactNode;
}

export function Pressable({ onPressIn, onPressOut, style, scaleAmount = 0.96, children, ...props }: Props) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback((e: any) => {
    scale.value = withSpring(scaleAmount, { damping: 15, stiffness: 300 });
    onPressIn?.(e);
  }, [onPressIn, scaleAmount]);

  const handlePressOut = useCallback((e: any) => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    onPressOut?.(e);
  }, [onPressOut]);

  return (
    <RNPressable onPressIn={handlePressIn} onPressOut={handlePressOut} {...props}>
      <Animated.View style={[animStyle, style]}>
        {children}
      </Animated.View>
    </RNPressable>
  );
}
