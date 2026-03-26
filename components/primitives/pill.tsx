import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './text';
import { theme } from '@/constants/theme';

interface Props {
  label: string;
  variant?: 'default' | 'outline';
}

export function Pill({ label, variant = 'default' }: Props) {
  return (
    <View style={[styles.base, variant === 'outline' && styles.outline]}>
      <Text variant="label" weight="medium" color={variant === 'outline' ? 'muted' : 'white'}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.ink,
    borderRadius: theme.radii.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs + 1,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});
