import { Pressable, Text, View, useWindowDimensions } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { colour, radius } from "@field-ds/tokens";

import { PageScaffold, type SidebarItem } from "../components/PageScaffold";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Components">;

type ComponentEntry = {
  route: keyof RootStackParamList;
  name: string;
};

// Alphabetised by display name.
const COMPONENTS: ComponentEntry[] = [
  { route: "Accordion", name: "Accordion" },
  { route: "BottomNav", name: "BottomNav" },
  { route: "Checkbox", name: "Checkbox" },
];

export function ComponentsListScreen({ navigation }: Props) {
  // Header row: the section name + divider, active because we're on the index.
  const sidebarItems: SidebarItem[] = [
    { key: "all", label: "Components", active: true, dividerAfter: true },
    ...COMPONENTS.map((c) => ({
      key: c.route,
      label: c.name,
      active: false,
    })),
  ];

  const { width } = useWindowDimensions();
  const cardsPerRow = width >= 1280 ? 4 : width >= 800 ? 3 : 2;

  return (
    <PageScaffold
      topNavActive="Components"
      title="components"
      subtitle="Production-ready building blocks composed from Field DS tokens. Tap one to explore states, props and live demos."
      sidebar={sidebarItems}
      onSidebarSelect={(key) => {
        if (key === "all") return;
        navigation.navigate(key as never);
      }}
    >
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        {COMPONENTS.map((c) => (
          <ComponentCard
            key={c.route}
            entry={c}
            cardsPerRow={cardsPerRow}
            onPress={() => navigation.navigate(c.route as never)}
          />
        ))}
      </View>
    </PageScaffold>
  );
}

function ComponentCard({
  entry,
  cardsPerRow,
  onPress,
}: {
  entry: ComponentEntry;
  cardsPerRow: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={entry.name}
      // @ts-expect-error hover
      style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => ({
        flexBasis: `calc((100% - ${(cardsPerRow - 1) * 24}px) / ${cardsPerRow})` as never,
        flexGrow: 0,
        flexShrink: 0,
        opacity: pressed ? 0.92 : 1,
        transform: [{ translateY: hovered ? -2 : 0 }],
        // @ts-expect-error rn-web passes CSS transition props through to the DOM
        transitionProperty: "transform",
        transitionDuration: "200ms",
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      })}
    >
      <View
        style={{
          aspectRatio: 1.5,
          backgroundColor: colour.surface.tertiary,
          borderRadius: radius["16"],
        }}
      />
      <Text
        numberOfLines={1}
        style={{
          marginTop: 12,
          fontFamily: "Noontree-Bold",
          fontSize: 18,
          lineHeight: 24,
          letterSpacing: -0.15,
          color: colour["text-n-icon"].primary,
        }}
      >
        {entry.name}
      </Text>
    </Pressable>
  );
}
