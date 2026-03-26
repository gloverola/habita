import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@/components/primitives/text';
import { Divider } from '@/components/primitives/divider';
import { FrequencyPicker } from './frequency-picker';
import { theme } from '@/constants/theme';

interface Props {
  initialName?: string;
  initialFrequency?: number;
  onSubmit: (name: string, frequency: number) => void;
  submitLabel?: string;
}

export function HabitForm({ initialName = '', initialFrequency = 3, onSubmit, submitLabel = 'Add Habit' }: Props) {
  const [name, setName] = useState(initialName);
  const [frequency, setFrequency] = useState(initialFrequency);

  function handleSubmit() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed, frequency);
  }

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Text variant="caption" weight="semibold" color="muted" style={styles.fieldLabel}>
          HABIT NAME
        </Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Morning run, Read, Meditate"
          placeholderTextColor={theme.colors.placeholder}
          returnKeyType="done"
          autoFocus
          maxLength={60}
        />
      </View>

      <Divider />

      <View style={styles.field}>
        <Text variant="caption" weight="semibold" color="muted" style={styles.fieldLabel}>
          FREQUENCY
        </Text>
        <FrequencyPicker value={frequency} onChange={setFrequency} />
      </View>

      <Divider />

      <TouchableOpacity
        style={[styles.submitBtn, !name.trim() && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={!name.trim()}
      >
        <Text variant="body" weight="semibold" color={name.trim() ? 'white' : 'placeholder'}>
          {submitLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
  },
  field: {
    paddingVertical: theme.spacing.sm,
  },
  fieldLabel: {
    marginBottom: theme.spacing.xs,
    letterSpacing: 0.5,
  },
  input: {
    fontSize: 17,
    color: theme.colors.ink,
    paddingVertical: theme.spacing.sm,
  },
  submitBtn: {
    backgroundColor: theme.colors.ink,
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  submitBtnDisabled: {
    backgroundColor: theme.colors.gray200,
  },
});
