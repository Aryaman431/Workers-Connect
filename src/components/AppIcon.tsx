import React from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import type { IconLib } from '../data/mockData';

type Props = {
  lib: IconLib;
  name: string;
  size?: number;
  color?: string;
  accessibilityLabel?: string;
};

/** Small helper that renders an icon from either supported icon family. */
export function AppIcon({ lib, name, size = 24, color = '#17212B', accessibilityLabel }: Props) {
  if (lib === 'Ionicons') {
    return (
      <Ionicons
        name={name as keyof typeof Ionicons.glyphMap}
        size={size}
        color={color}
        accessibilityLabel={accessibilityLabel}
      />
    );
  }
  return (
    <MaterialCommunityIcons
      name={name as keyof typeof MaterialCommunityIcons.glyphMap}
      size={size}
      color={color}
      accessibilityLabel={accessibilityLabel}
    />
  );
}

export default AppIcon;
