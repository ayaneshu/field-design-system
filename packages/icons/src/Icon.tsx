import React from "react";
import Svg, { Path, type SvgProps } from "react-native-svg";
import { iconPaths, type IconName } from "./icons-data";

export type IconProps = Omit<SvgProps, "color"> & {
  name: IconName;
  size?: number;
  color?: string;
};

/**
 * Renders an M-Icon by name. All icons share a 24×24 viewBox.
 *
 *   <Icon name="system-arrow-up" size={20} color={colour["text-n-icon"].primary} />
 */
export function Icon({ name, size = 24, color = "#1D2539", ...rest }: IconProps) {
  const paths = iconPaths[name];
  if (!paths) return null;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      {paths.map((d, i) => (
        <Path key={i} d={d} fill={color} />
      ))}
    </Svg>
  );
}
