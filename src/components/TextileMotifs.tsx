import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import type { Skill } from '../data/mockData';
import { absoluteFill, colors, radius } from '../theme';
import { AppIcon } from './AppIcon';

type DividerProps = {
  /** Line colour — defaults to the shared textile blue. */
  color?: string;
  /** Draw the small rotated "knot" bead at the centre of the line. */
  knot?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Full-width dashed thread used between sections instead of a solid rule.
 * Purely decorative — hidden from assistive technology.
 */
export function ThreadDivider({ color = colors.textileBlue, knot = false, style }: DividerProps) {
  return (
    <View
      pointerEvents="none"
      style={[styles.dividerWrap, style]}
      accessibilityElementsHidden
      importantForAccessibility="no"
    >
      <View style={[styles.dividerLine, { borderColor: color }]} />
      {knot ? <View style={[styles.knot, { borderColor: color }]} /> : null}
    </View>
  );
}

type IsoStackProps = {
  /** Edge length of each rotated square. */
  size?: number;
  /** Hue for the front layer — defaults to the accent tone. */
  tone?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Isometric stack motif — three rotated squares layered back to front.
 * Pure RN Views, no images or SVG.
 */
export function IsoStack({ size = 56, tone = colors.accent, style }: IsoStackProps) {
  const step = size * 0.16;
  const layers = [
    { key: 'back', color: colors.navy, fill: 0.1 },
    { key: 'mid', color: colors.textileBlue, fill: 0.14 },
    { key: 'front', color: tone, fill: 0.1 },
  ];

  return (
    <View
      pointerEvents="none"
      style={[styles.isoWrap, { width: size, height: size + step * 2 }, style]}
      accessibilityElementsHidden
      importantForAccessibility="no"
    >
      {layers.map((layer, i) => (
        <View
          key={layer.key}
          style={{
            position: 'absolute',
            left: 0,
            top: i * step,
            width: size,
            height: size,
            borderRadius: radius.sm,
            borderWidth: 1,
            borderColor: `${layer.color}59`,
            backgroundColor: `${layer.color}${alphaHex(layer.fill)}`,
            transform: [{ rotate: '45deg' }],
          }}
        />
      ))}
    </View>
  );
}

type DimSkillIconProps = {
  skill: Skill;
  /** Square edge length of the tile. */
  size?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Dimensional skill tile: a tinted back plate offset behind an ivory face
 * carrying the skill glyph.
 */
export function DimSkillIcon({ skill, size = 44, style }: DimSkillIconProps) {
  const glyph = Math.round(size * 0.5);

  return (
    <View style={[{ width: size, height: size }, style]}>
      <View
        pointerEvents="none"
        style={[
          styles.dimBack,
          { width: size, height: size, backgroundColor: `${skill.color}40`, borderRadius: radius.md },
        ]}
      />
      <View
        style={[
          styles.dimFront,
          { width: size, height: size, borderRadius: radius.md, borderColor: `${skill.color}59` },
        ]}
      >
        <AppIcon lib={skill.icon.lib} name={skill.icon.name} size={glyph} color={skill.color} />
      </View>
    </View>
  );
}

/** 0–1 alpha rendered as the two hex digits RN expects after `#RRGGBB`. */
function alphaHex(alpha: number): string {
  return Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');
}

const styles = StyleSheet.create({
  dividerWrap: {
    width: '100%',
    alignItems: 'center',
  },
  dividerLine: {
    width: '100%',
    height: 0,
    borderTopWidth: 1,
    borderStyle: 'dashed',
  },
  knot: {
    position: 'absolute',
    top: -2.5,
    width: 6,
    height: 6,
    borderWidth: 1.5,
    transform: [{ rotate: '45deg' }],
  },
  isoWrap: { overflow: 'visible' },
  dimBack: {
    ...absoluteFill,
    transform: [{ translateX: 3 }, { translateY: 3 }],
  },
  dimFront: {
    ...absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: colors.ivory,
  },
});
