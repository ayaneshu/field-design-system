import { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { Icon, iconNames, iconPaths, type IconName } from "@field-ds/icons";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

import { ViewToggle, type ViewMode } from "../components/ViewToggle";
import { useShell } from "../theme/ThemeContext";

type CopyMode = "name" | "svg";

function buildSvgMarkup(name: IconName): string {
  const paths = (iconPaths[name] ?? []) as readonly string[];
  const pathEls = paths
    .map((d) => `  <path fill="currentColor" d="${d}"/>`)
    .join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" aria-label="${name}">\n${pathEls}\n</svg>`;
}

export function IconsContent({
  copy,
}: {
  copy: (text: string, label?: string) => void;
}) {
  const [view, setView] = useState<ViewMode>("grid");
  const [query, setQuery] = useState("");
  const [copyMode, setCopyMode] = useState<CopyMode>("svg");

  const shell = useShell();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return iconNames;
    return iconNames.filter((n) => n.includes(q));
  }, [query]);

  const handleCopy = (n: IconName) => {
    if (copyMode === "name") {
      copy(n, `name · ${n}`);
    } else {
      copy(buildSvgMarkup(n), `svg · ${n}`);
    }
  };

  return (
    <View>
      {/* Toolbar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: space["12"],
          flexWrap: "wrap",
          marginBottom: space["20"],
        }}
      >
        <View
          style={{
            flexGrow: 1,
            flexBasis: 280,
            flexDirection: "row",
            alignItems: "center",
            gap: space["10"],
            paddingHorizontal: space["14"],
            paddingVertical: space["10"],
            borderRadius: radius.rounded,
            backgroundColor: colour.surface.secondary,
            borderWidth: 1,
            borderColor: colour.border.subtle,
          }}
        >
          <Icon name="system-search" size={16} color={colour["text-n-icon"].tertiary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search icons…"
            placeholderTextColor={colour["text-n-icon"].muted}
            // @ts-expect-error — outlineStyle is web-only
            style={[
              textStyles.Body_B14_Regular,
              {
                flex: 1,
                color: colour["text-n-icon"].primary,
                paddingVertical: 0,
                outlineStyle: "none",
              },
            ]}
          />
        </View>
        <CopyModeToggle value={copyMode} onChange={setCopyMode} />
        <ViewToggle value={view} onChange={setView} />
      </View>

      {/* Count */}
      <Text
        style={[
          textStyles.Body_B11_SemiBold,
          {
            color: shell.textTertiary,
            textTransform: "uppercase",
            letterSpacing: 1.4,
            marginBottom: space["16"],
          },
        ]}
      >
        {filtered.length} {filtered.length === 1 ? "match" : "matches"} · copying{" "}
        {copyMode === "svg" ? "SVG" : "name"}
      </Text>

      {view === "grid" ? (
        <GridView icons={filtered} onCopy={handleCopy} />
      ) : (
        <ListView icons={filtered} onCopy={handleCopy} copyMode={copyMode} />
      )}
    </View>
  );
}

function CopyModeToggle({
  value,
  onChange,
}: {
  value: CopyMode;
  onChange: (v: CopyMode) => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: colour.surface.secondary,
        borderRadius: radius.rounded,
        padding: space["2"],
      }}
    >
      {(["svg", "name"] as const).map((v) => {
        const active = v === value;
        return (
          <Pressable
            key={v}
            onPress={() => onChange(v)}
            accessibilityRole="button"
            accessibilityState={active ? { selected: true } : {}}
            style={({ pressed }) => ({
              paddingHorizontal: space["12"],
              paddingVertical: space["6"],
              borderRadius: radius.rounded,
              backgroundColor: active ? colour.surface.primary : "transparent",
              opacity: pressed ? 0.85 : 1,
              ...(active
                ? {
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.06,
                    shadowRadius: 3,
                    elevation: 1,
                  }
                : null),
            })}
          >
            <Text
              style={[
                textStyles.Body_B12_SemiBold,
                {
                  color: active
                    ? colour["text-n-icon"].primary
                    : colour["text-n-icon"].tertiary,
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                },
              ]}
            >
              {v === "svg" ? "SVG" : "Name"}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function GridView({
  icons,
  onCopy,
}: {
  icons: IconName[];
  onCopy: (n: IconName) => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        borderWidth: 1,
        borderColor: colour.border.subtle,
        borderRadius: radius["16"],
        overflow: "hidden",
        backgroundColor: colour.surface.primary,
      }}
    >
      {icons.map((n) => (
        <Pressable
          key={n}
          onPress={() => onCopy(n)}
          accessibilityRole="button"
          accessibilityLabel={`Copy ${n}`}
          // @ts-expect-error — hover
          style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => ({
            width: 144,
            height: 144,
            alignItems: "center",
            justifyContent: "center",
            gap: space["12"],
            borderRightWidth: 1,
            borderBottomWidth: 1,
            borderRightColor: colour.border.subtle,
            borderBottomColor: colour.border.subtle,
            backgroundColor: hovered ? colour.surface.secondary : "transparent",
            opacity: pressed ? 0.85 : 1,
          })}
        >
          {/* Preview is 40×40; the underlying glyph is the 24×24 production
              icon scaled up so it stays crisp without changing the SVG that
              gets copied to the clipboard. */}
          <Icon name={n} size={40} color={colour["text-n-icon"].primary} />
          <Text
            numberOfLines={2}
            style={[
              textStyles.Body_B11_Regular,
              {
                color: colour["text-n-icon"].tertiary,
                textAlign: "center",
                paddingHorizontal: space["6"],
              },
            ]}
          >
            {n.replace(/^system-/, "")}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function ListView({
  icons,
  onCopy,
  copyMode,
}: {
  icons: IconName[];
  onCopy: (n: IconName) => void;
  copyMode: CopyMode;
}) {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: colour.border.subtle,
        borderRadius: radius["12"],
        overflow: "hidden",
      }}
    >
      {icons.map((n, i) => (
        <Pressable
          key={n}
          onPress={() => onCopy(n)}
          accessibilityRole="button"
          accessibilityLabel={`Copy ${n}`}
          // @ts-expect-error — hover
          style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => ({
            flexDirection: "row",
            alignItems: "center",
            gap: space["16"],
            paddingHorizontal: space["16"],
            paddingVertical: space["12"],
            borderTopWidth: i === 0 ? 0 : 1,
            borderTopColor: colour.border.subtle,
            backgroundColor: hovered ? colour.surface.secondary : colour.surface.primary,
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: radius["8"],
              backgroundColor: colour.surface.tertiary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name={n} size={20} color={colour["text-n-icon"].primary} />
          </View>
          <Text
            style={[
              textStyles.Body_B14_SemiBold,
              { color: colour["text-n-icon"].primary, flex: 1 },
            ]}
          >
            {n}
          </Text>
          <Text
            style={[
              textStyles.Body_B11_SemiBold,
              {
                color: colour["text-n-icon"].tertiary,
                textTransform: "uppercase",
                letterSpacing: 0.6,
              },
            ]}
          >
            copy {copyMode}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
