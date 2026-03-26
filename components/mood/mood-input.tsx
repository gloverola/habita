import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@/components/primitives/text';
import { theme } from '@/constants/theme';

interface Props {
  value: number | null;
  onChange: (score: number) => void;
}

export function MoodInput({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map(score => (
          <TouchableOpacity
            key={score}
            onPress={() => onChange(score)}
            style={[styles.btn, value === score && styles.btnSelected]}
            activeOpacity={0.7}
          >
            <Text
              variant="body"
              weight={value === score ? 'bold' : 'regular'}
              color={value === score ? 'white' : 'ink'}
            >
              {score}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.labels}>
        <Text variant="label" color="muted">Terrible</Text>
        <Text variant="label" color="muted">Amazing</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  btn: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radii.sm,
    backgroundColor: theme.colors.gray100,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  btnSelected: {
    backgroundColor: theme.colors.ink,
    borderColor: theme.colors.ink,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xxs,
  },
});
