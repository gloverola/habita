import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@/components/primitives/text';
import { theme } from '@/constants/theme';

interface Props {
  value: number;
  onChange: (value: number) => void;
}

function frequencyLabel(n: number): string {
  if (n === 1) return 'once a week';
  if (n === 7) return 'every day';
  return `${n} days a week`;
}

export function FrequencyPicker({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
      >
        <Text variant="title" weight="medium" color={value <= 1 ? 'placeholder' : 'ink'}>−</Text>
      </TouchableOpacity>

      <Text variant="body" weight="medium" style={styles.label}>
        {frequencyLabel(value)}
      </Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => onChange(Math.min(7, value + 1))}
        disabled={value >= 7}
      >
        <Text variant="title" weight="medium" color={value >= 7 ? 'placeholder' : 'ink'}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
  },
  btn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    textAlign: 'center',
  },
});
