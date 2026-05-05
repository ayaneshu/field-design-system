import { Pressable, Text, View } from "react-native";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

export type ViewMode = "grid" | "list";

/**
 * Segmented pill — same shape as the bottom-tab control, scoped per page.
 * Fontshare-style: small, unfussy, sits right-aligned in a page toolbar.
 */
export function ViewToggle({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
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
      {(["grid", "list"] as const).map((v) => {
        const active = v === value;
        const tint = active ? colour["text-n-icon"].primary : colour["text-n-icon"].tertiary;
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
              flexDirection: "row",
              alignItems: "center",
              gap: space["6"],
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
            {v === "grid" ? <GridGlyph color={tint} /> : <ListGlyph color={tint} />}
            <Text style={[textStyles.Body_B12_SemiBold, { color: tint }]}>
              {v === "grid" ? "Grid" : "List"}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function GridGlyph({ color }: { color: string }) {
  return (
    <View style={{ width: 14, height: 14, flexDirection: "row", flexWrap: "wrap", gap: 2 }}>
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={{ width: 6, height: 6, backgroundColor: color, borderRadius: 1 }} />
      ))}
    </View>
  );
}

function ListGlyph({ color }: { color: string }) {
  return (
    <View style={{ width: 14, height: 14, justifyContent: "space-between", paddingVertical: 2 }}>
      <View style={{ height: 2, backgroundColor: color, borderRadius: 1 }} />
      <View style={{ height: 2, backgroundColor: color, borderRadius: 1 }} />
      <View style={{ height: 2, backgroundColor: color, borderRadius: 1 }} />
    </View>
  );
}
