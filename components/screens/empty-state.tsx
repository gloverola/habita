import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@/components/primitives/text';
import { theme } from '@/constants/theme';

interface Props {
  message: string;
  ctaLabel?: string;
  onCta?: () => void;
}

export function EmptyState({ message, ctaLabel, onCta }: Props) {
  return (
    <View style={styles.container}>
      <Text variant="body" color="muted" style={styles.message}>
        {message}
      </Text>
      {ctaLabel && onCta && (
        <TouchableOpacity onPress={onCta} style={styles.cta}>
          <Text variant="body" weight="semibold">{ctaLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  message: {
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  cta: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});
