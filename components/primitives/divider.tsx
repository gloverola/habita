import React from 'react';
import { View, ViewProps } from 'react-native';
import { theme } from '@/constants/theme';

interface Props extends ViewProps {
  vertical?: boolean;
  spacing?: number;
}

export function Divider({ vertical = false, spacing = 0, style, ...props }: Props) {
  return (
    <View
      style={[
        vertical
          ? { width: 1, height: '100%', backgroundColor: theme.colors.border, marginHorizontal: spacing }
          : { height: 1, width: '100%', backgroundColor: theme.colors.border, marginVertical: spacing },
        style,
      ]}
      {...props}
    />
  );
}
