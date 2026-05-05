import { Pressable, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import { space } from "@field-ds/tokens";

import { useTheme } from "../theme/ThemeContext";

/**
 * Sun ↔ moon toggle. Lives in the top header and flips the playground chrome
 * (page bg, sidebar, title) between light and dark. Components themselves are
 * always rendered in light mode regardless of theme.
 */
export function ThemeToggle() {
  const { mode, toggle, shell } = useTheme();
  const isDark = mode === "dark";
  return (
    <Pressable
      onPress={toggle}
      accessibilityRole="switch"
      accessibilityState={{ checked: isDark }}
      accessibilityLabel={isDark ? "Switch to light mode" : "Switch to dark mode"}
      // @ts-expect-error hover
      style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => ({
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: shell.border,
        backgroundColor: hovered
          ? shell.sidebarRowHoverBg
          : "transparent",
        opacity: pressed ? 0.7 : 1,
        marginLeft: space["8"],
        // @ts-expect-error rn-web passes through to DOM
        transitionProperty: "background-color, border-color",
        transitionDuration: "200ms",
        transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
      })}
    >
      {isDark ? <SunGlyph color={shell.textPrimary} /> : <MoonGlyph color={shell.textPrimary} />}
    </Pressable>
  );
}

function MoonGlyph({ color }: { color: string }) {
  return (
    <View style={{ width: 16, height: 16 }}>
      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
        <Path
          d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"
          fill={color}
        />
      </Svg>
    </View>
  );
}

function SunGlyph({ color }: { color: string }) {
  return (
    <View style={{ width: 16, height: 16 }}>
      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
        <Circle cx="12" cy="12" r="4" fill={color} />
        <Path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </Svg>
    </View>
  );
}
