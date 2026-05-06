import { View, useWindowDimensions } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { radius } from "@field-ds/tokens";

import { PageScaffold, type SidebarItem } from "../components/PageScaffold";
import { HubCardShell } from "./FoundationsScreen";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Components">;

type ComponentEntry = {
  route: keyof RootStackParamList;
  name: string;
  illustration: (props: { tone: string }) => React.ReactNode;
};

// Alphabetised by display name.
const COMPONENTS: ComponentEntry[] = [
  { route: "Accordion", name: "Accordion", illustration: AccordionIllustration },
  { route: "BottomNav", name: "BottomNav", illustration: BottomNavIllustration },
  { route: "Checkbox", name: "Checkbox", illustration: CheckboxIllustration },
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
          <HubCardShell
            key={c.route}
            label={c.name}
            cardsPerRow={cardsPerRow}
            onPress={() => navigation.navigate(c.route as never)}
            renderIllustration={(tone) => <c.illustration tone={tone} />}
          />
        ))}
      </View>
    </PageScaffold>
  );
}

// ─────────── Card illustrations (minimal, monochrome) ───────────

const ILLO_W = 160;
const ILLO_H = 96;

function IlloFrame({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        width: ILLO_W,
        height: ILLO_H,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </View>
  );
}

function AccordionIllustration({ tone }: { tone: string }) {
  // Stack of 3 rows where the middle row is "expanded" — visualises
  // disclosure.
  return (
    <IlloFrame>
      <View style={{ width: 132, gap: 6 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderWidth: 2,
            borderColor: tone,
            borderRadius: radius["6"],
          }}
        >
          <View
            style={{ width: 56, height: 4, backgroundColor: tone, borderRadius: 2 }}
          />
          <View
            style={{
              width: 8,
              height: 8,
              backgroundColor: tone,
              borderRadius: 9999,
            }}
          />
        </View>
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderWidth: 2,
            borderColor: tone,
            borderRadius: radius["6"],
            gap: 4,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View
              style={{ width: 56, height: 4, backgroundColor: tone, borderRadius: 2 }}
            />
            <View
              style={{
                width: 8,
                height: 8,
                backgroundColor: tone,
                opacity: 0.6,
                borderRadius: 9999,
              }}
            />
          </View>
          <View
            style={{ width: 92, height: 3, backgroundColor: tone, opacity: 0.5 }}
          />
          <View
            style={{ width: 70, height: 3, backgroundColor: tone, opacity: 0.5 }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderWidth: 2,
            borderColor: tone,
            borderRadius: radius["6"],
          }}
        >
          <View
            style={{ width: 44, height: 4, backgroundColor: tone, borderRadius: 2 }}
          />
          <View
            style={{
              width: 8,
              height: 8,
              backgroundColor: tone,
              borderRadius: 9999,
            }}
          />
        </View>
      </View>
    </IlloFrame>
  );
}

function BottomNavIllustration({ tone }: { tone: string }) {
  // Phone silhouette with a tab bar. Highlights the centre tab.
  return (
    <IlloFrame>
      <View
        style={{
          width: 70,
          height: ILLO_H - 4,
          borderWidth: 2,
          borderColor: tone,
          borderRadius: radius["8"],
          padding: 6,
          alignItems: "stretch",
          gap: 4,
        }}
      >
        <View style={{ flex: 1 }} />
        <View
          style={{
            height: 22,
            borderTopWidth: 1,
            borderTopColor: tone,
            paddingTop: 5,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <View
            style={{ width: 6, height: 6, backgroundColor: tone, opacity: 0.55 }}
          />
          <View
            style={{
              width: 6,
              height: 6,
              backgroundColor: tone,
              borderRadius: 9999,
            }}
          />
          <View
            style={{ width: 6, height: 6, backgroundColor: tone, opacity: 0.55 }}
          />
        </View>
      </View>
    </IlloFrame>
  );
}

function CheckboxIllustration({ tone }: { tone: string }) {
  // Three checkboxes — selected, unselected, indeterminate.
  return (
    <IlloFrame>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
        }}
      >
        {/* Selected: filled with a tick mark made of two lines */}
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: radius["4"],
            backgroundColor: tone,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: 10,
              height: 4,
              backgroundColor: "rgba(255,255,255,0.92)",
              transform: [{ rotate: "45deg" }, { translateX: 2 }],
            }}
          />
          <View
            style={{
              width: 14,
              height: 4,
              backgroundColor: "rgba(255,255,255,0.92)",
              transform: [{ rotate: "-45deg" }],
              marginTop: -3,
              marginLeft: 3,
            }}
          />
        </View>
        {/* Unselected */}
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: radius["4"],
            borderWidth: 2,
            borderColor: tone,
          }}
        />
        {/* Indeterminate */}
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: radius["4"],
            borderWidth: 2,
            borderColor: tone,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: 14,
              height: 3,
              backgroundColor: tone,
            }}
          />
        </View>
      </View>
    </IlloFrame>
  );
}
