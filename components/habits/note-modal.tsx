import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { Text } from '@/components/primitives/text';
import { theme } from '@/constants/theme';

interface Props {
  visible: boolean;
  date: string;
  habitName: string;
  initialNote: string;
  onSave: (note: string) => void;
  onClose: () => void;
}

export function NoteModal({ visible, date, habitName, initialNote, onSave, onClose }: Props) {
  const [text, setText] = useState(initialNote);

  useEffect(() => {
    if (visible) setText(initialNote);
  }, [visible, initialNote]);

  const displayDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text variant="headline" weight="semibold" numberOfLines={1}>{habitName}</Text>
              <Text variant="caption" color="muted">{displayDate}</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <Text variant="body" color="muted">Cancel</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Add a note…"
            placeholderTextColor={theme.colors.placeholder}
            multiline
            autoFocus
            maxLength={200}
          />
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => onSave(text)}
          >
            <Text variant="body" weight="semibold" color="white">Save Note</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radii.xl,
    borderTopRightRadius: theme.radii.xl,
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.gray200,
    alignSelf: 'center',
    marginBottom: theme.spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  input: {
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    fontSize: 15,
    color: theme.colors.ink,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveBtn: {
    backgroundColor: theme.colors.ink,
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
});
