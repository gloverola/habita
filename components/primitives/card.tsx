import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

interface Props extends ViewProps {
  shadow?: boolean;
  padding?: number;
}

export function Card({ shadow = false, padding = theme.spacing.md, style, children, ...props }: Props) {
  return (
    <View
      style={[
        styles.base,
        { padding },
        shadow && theme.shadows.sm,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});
