import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

type Variant = 'display' | 'title' | 'headline' | 'body' | 'caption' | 'label';
type Weight = 'regular' | 'medium' | 'semibold' | 'bold';
type Color = 'ink' | 'muted' | 'placeholder' | 'danger' | 'white';

interface Props extends TextProps {
  variant?: Variant;
  weight?: Weight;
  color?: Color;
}

const variantStyles: Record<Variant, object> = {
  display:  { fontSize: 32, lineHeight: 38 },
  title:    { fontSize: 20, lineHeight: 26 },
  headline: { fontSize: 17, lineHeight: 22 },
  body:     { fontSize: 15, lineHeight: 22 },
  caption:  { fontSize: 13, lineHeight: 18 },
  label:    { fontSize: 11, lineHeight: 14 },
};

const weightMap: Record<Weight, string> = {
  regular:  '400',
  medium:   '500',
  semibold: '600',
  bold:     '700',
};

const colorMap: Record<Color, string> = {
  ink:         theme.colors.ink,
  muted:       theme.colors.muted,
  placeholder: theme.colors.placeholder,
  danger:      theme.colors.danger,
  white:       theme.colors.white,
};

export function Text({ variant = 'body', weight = 'regular', color = 'ink', style, ...props }: Props) {
  return (
    <RNText
      style={[
        variantStyles[variant],
        { fontWeight: weightMap[weight] as any, color: colorMap[color] },
        style,
      ]}
      {...props}
    />
  );
}
