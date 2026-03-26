import React from 'react';
import { G, Line, Text as SvgText } from 'react-native-svg';
import { theme } from '@/constants/theme';

interface Props {
  width: number;
  height: number;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;
  yForScore: (score: number) => number;
}

const GRID_SCORES = [2, 4, 6, 8, 10];

export function ChartAxis({ width, height, paddingLeft, paddingRight, paddingTop, paddingBottom, yForScore }: Props) {
  const chartWidth = width - paddingLeft - paddingRight;

  return (
    <G>
      {GRID_SCORES.map(score => {
        const y = yForScore(score);
        return (
          <G key={score}>
            <Line
              x1={paddingLeft}
              y1={y}
              x2={width - paddingRight}
              y2={y}
              stroke={theme.colors.gray200}
              strokeWidth={1}
            />
            <SvgText
              x={paddingLeft - 4}
              y={y + 4}
              fontSize={10}
              fill={theme.colors.gray400}
              textAnchor="end"
            >
              {score}
            </SvgText>
          </G>
        );
      })}
    </G>
  );
}
