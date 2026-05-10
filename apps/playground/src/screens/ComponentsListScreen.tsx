import { View, useWindowDimensions } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { radius } from "@field-ds/tokens";

import { PageScaffold, type SidebarItem } from "../components/PageScaffold";
import { HubCardShell } from "./FoundationsScreen";
import {
  componentsSidebar,
  navigateFromSidebar,
} from "../navigation/sidebars";
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
  { route: "Divider", name: "Divider", illustration: DividerIllustration },
  {
    route: "FilterChip",
    name: "Filter Chip",
    illustration: FilterChipIllustration,
  },
  {
    route: "IconButton",
    name: "Icon Button",
    illustration: IconButtonIllustration,
  },
  {
    route: "InfoBanner",
    name: "Info Banner",
    illustration: InfoBannerIllustration,
  },
  {
    route: "InputText",
    name: "Input Text",
    illustration: InputTextIllustration,
  },
  {
    route: "InputTextarea",
    name: "Input Textarea",
    illustration: InputTextareaIllustration,
  },
  {
    route: "ListItem",
    name: "List Item",
    illustration: ListItemIllustration,
  },
  {
    route: "NeutralButton",
    name: "Neutral Button",
    illustration: NeutralButtonIllustration,
  },
  {
    route: "PrimaryButton",
    name: "Primary Button",
    illustration: PrimaryButtonIllustration,
  },
  {
    route: "RoundButton",
    name: "Round Button",
    illustration: RoundButtonIllustration,
  },
  {
    route: "SecondaryButton",
    name: "Secondary Button",
    illustration: SecondaryButtonIllustration,
  },
  {
    route: "SecondaryNeutralButton",
    name: "Secondary Neutral Button",
    illustration: SecondaryNeutralButtonIllustration,
  },
  {
    route: "TextButton",
    name: "Text Button",
    illustration: TextButtonIllustration,
  },
];

export function ComponentsListScreen({ navigation }: Props) {
  // Reuse the shared sidebar so the Button group + indented children stay
  // consistent with the per-component detail pages. We're on the index so
  // the back-link row at the top (`all`) is the active one.
  const baseSidebar = componentsSidebar("");
  const sidebarItems: SidebarItem[] = baseSidebar.map((item, i) =>
    i === 0 ? { ...item, active: true } : item,
  );

  const { width } = useWindowDimensions();
  const cardsPerRow = width >= 1280 ? 4 : width >= 800 ? 3 : 2;

  return (
    <PageScaffold
      topNavActive="Components"
      title="components"
      subtitle="Production-ready building blocks composed from Field DS tokens. Tap one to explore states, props and live demos."
      sidebar={sidebarItems}
      onSidebarSelect={(key) => {
        // We're already on the Components index — ignore the back-link.
        if (key === "all") return;
        navigateFromSidebar(navigation, key);
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

function DividerIllustration({ tone }: { tone: string }) {
  // Two text rows separated by a hairline — solid above, dashed below.
  return (
    <IlloFrame>
      <View style={{ width: 132, gap: 10 }}>
        <View
          style={{
            width: 84,
            height: 4,
            borderRadius: 2,
            backgroundColor: tone,
            opacity: 0.7,
          }}
        />
        <View
          style={{
            height: 0,
            borderTopWidth: 2,
            borderTopColor: tone,
          }}
        />
        <View
          style={{
            width: 64,
            height: 4,
            borderRadius: 2,
            backgroundColor: tone,
            opacity: 0.7,
          }}
        />
        <View
          style={{
            height: 0,
            borderTopWidth: 2,
            borderTopColor: tone,
            borderStyle: "dashed",
            opacity: 0.8,
          }}
        />
        <View
          style={{
            width: 76,
            height: 4,
            borderRadius: 2,
            backgroundColor: tone,
            opacity: 0.7,
          }}
        />
      </View>
    </IlloFrame>
  );
}

function PrimaryButtonIllustration({ tone }: { tone: string }) {
  // Single filled rectangular CTA — high emphasis.
  return (
    <IlloFrame>
      <View
        style={{
          width: 110,
          height: 28,
          borderRadius: radius["8"],
          backgroundColor: tone,
        }}
      />
    </IlloFrame>
  );
}

function SecondaryButtonIllustration({ tone }: { tone: string }) {
  // Outline rectangular CTA with a 2px border.
  return (
    <IlloFrame>
      <View
        style={{
          width: 110,
          height: 28,
          borderRadius: radius["8"],
          borderWidth: 2,
          borderColor: tone,
        }}
      />
    </IlloFrame>
  );
}

function SecondaryNeutralButtonIllustration({ tone }: { tone: string }) {
  // Outline rectangular CTA with a softer (lower-opacity) border to evoke
  // the muted-neutral border vs. the action-blue border of Secondary.
  return (
    <IlloFrame>
      <View
        style={{
          width: 110,
          height: 28,
          borderRadius: radius["8"],
          borderWidth: 2,
          borderColor: tone,
          opacity: 0.55,
        }}
      />
    </IlloFrame>
  );
}

function NeutralButtonIllustration({ tone }: { tone: string }) {
  // Two stacked filled CTAs to evoke a quieter mid-emphasis fill that often
  // sits beside another Neutral action on a light surface.
  return (
    <IlloFrame>
      <View style={{ gap: 8, alignItems: "center" }}>
        <View
          style={{
            width: 90,
            height: 22,
            borderRadius: radius["6"],
            backgroundColor: tone,
            opacity: 0.85,
          }}
        />
        <View
          style={{
            width: 90,
            height: 22,
            borderRadius: radius["6"],
            backgroundColor: tone,
            opacity: 0.55,
          }}
        />
      </View>
    </IlloFrame>
  );
}

function RoundButtonIllustration({ tone }: { tone: string }) {
  // Pill-shaped pair to evoke the M-NeutralRoundButton.
  return (
    <IlloFrame>
      <View style={{ gap: 10, alignItems: "center" }}>
        <View
          style={{
            width: 92,
            height: 22,
            borderRadius: 9999,
            backgroundColor: tone,
          }}
        />
        <View
          style={{
            width: 76,
            height: 20,
            borderRadius: 9999,
            borderWidth: 2,
            borderColor: tone,
          }}
        />
      </View>
    </IlloFrame>
  );
}

function TextButtonIllustration({ tone }: { tone: string }) {
  // Inline label + arrow chevron to evoke the M-TextButton family.
  return (
    <IlloFrame>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <View
          style={{
            width: 60,
            height: 6,
            borderRadius: 3,
            backgroundColor: tone,
          }}
        />
        <View
          style={{
            width: 0,
            height: 0,
            borderTopWidth: 6,
            borderBottomWidth: 6,
            borderLeftWidth: 8,
            borderTopColor: "transparent",
            borderBottomColor: "transparent",
            borderLeftColor: tone,
          }}
        />
      </View>
    </IlloFrame>
  );
}

function FilterChipIllustration({ tone }: { tone: string }) {
  // Two pill-shaped chips — one default outline, one bold-bordered with an
  // inline cross to evoke the M-FilterChip "Added" treatment.
  return (
    <IlloFrame>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderWidth: 2,
            borderColor: tone,
            opacity: 0.5,
            borderRadius: radius["8"],
          }}
        >
          <View
            style={{ width: 6, height: 6, backgroundColor: tone, borderRadius: 1 }}
          />
          <View
            style={{ width: 30, height: 4, backgroundColor: tone, borderRadius: 2 }}
          />
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: 4,
              borderRightWidth: 4,
              borderTopWidth: 5,
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              borderTopColor: tone,
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderWidth: 2,
            borderColor: tone,
            borderRadius: radius["8"],
          }}
        >
          <View
            style={{ width: 30, height: 4, backgroundColor: tone, borderRadius: 2 }}
          />
          <View style={{ width: 1, height: 10, backgroundColor: tone, opacity: 0.4 }} />
          <View style={{ position: "relative", width: 8, height: 8 }}>
            <View
              style={{
                position: "absolute",
                top: 3,
                left: 0,
                width: 8,
                height: 2,
                backgroundColor: tone,
                transform: [{ rotate: "45deg" }],
              }}
            />
            <View
              style={{
                position: "absolute",
                top: 3,
                left: 0,
                width: 8,
                height: 2,
                backgroundColor: tone,
                transform: [{ rotate: "-45deg" }],
              }}
            />
          </View>
        </View>
      </View>
    </IlloFrame>
  );
}

function InputTextIllustration({ tone }: { tone: string }) {
  // Label tag + outlined field with a blinking caret to evoke a single-line
  // input.
  return (
    <IlloFrame>
      <View style={{ width: 132, gap: 6 }}>
        <View
          style={{ width: 36, height: 4, backgroundColor: tone, borderRadius: 2 }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderWidth: 2,
            borderColor: tone,
            borderRadius: radius["6"],
          }}
        >
          <View
            style={{ width: 56, height: 4, backgroundColor: tone, opacity: 0.55, borderRadius: 2 }}
          />
          <View style={{ width: 2, height: 12, backgroundColor: tone }} />
        </View>
      </View>
    </IlloFrame>
  );
}

function InputTextareaIllustration({ tone }: { tone: string }) {
  // Label tag + a taller outlined field with multiple text-line shimmers.
  return (
    <IlloFrame>
      <View style={{ width: 132, gap: 6 }}>
        <View
          style={{ width: 40, height: 4, backgroundColor: tone, borderRadius: 2 }}
        />
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderWidth: 2,
            borderColor: tone,
            borderRadius: radius["6"],
            gap: 5,
            minHeight: 56,
          }}
        >
          <View
            style={{ width: 100, height: 3, backgroundColor: tone, opacity: 0.55, borderRadius: 2 }}
          />
          <View
            style={{ width: 84, height: 3, backgroundColor: tone, opacity: 0.55, borderRadius: 2 }}
          />
          <View
            style={{ width: 60, height: 3, backgroundColor: tone, opacity: 0.55, borderRadius: 2 }}
          />
        </View>
      </View>
    </IlloFrame>
  );
}

function ListItemIllustration({ tone }: { tone: string }) {
  // Three rows: a 24x24 leading dot, two text lines, and a trailing chevron —
  // the canonical "list item with leading icon, body, and trailing affordance"
  // composition.
  const Row = ({ trailingChevron }: { trailingChevron?: boolean }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 8,
        paddingVertical: 6,
      }}
    >
      <View
        style={{
          width: 12,
          height: 12,
          borderRadius: 9999,
          backgroundColor: tone,
          opacity: 0.85,
        }}
      />
      <View style={{ flex: 1, gap: 3 }}>
        <View
          style={{ width: 60, height: 4, backgroundColor: tone, borderRadius: 2 }}
        />
        <View
          style={{
            width: 38,
            height: 3,
            backgroundColor: tone,
            opacity: 0.5,
            borderRadius: 2,
          }}
        />
      </View>
      {trailingChevron && (
        <View
          style={{
            width: 0,
            height: 0,
            borderTopWidth: 5,
            borderBottomWidth: 5,
            borderLeftWidth: 6,
            borderTopColor: "transparent",
            borderBottomColor: "transparent",
            borderLeftColor: tone,
            opacity: 0.7,
          }}
        />
      )}
    </View>
  );
  return (
    <IlloFrame>
      <View
        style={{
          width: 132,
          borderWidth: 2,
          borderColor: tone,
          borderRadius: radius["6"],
          overflow: "hidden",
        }}
      >
        <Row trailingChevron />
        <View style={{ height: 1, backgroundColor: tone, opacity: 0.3 }} />
        <Row trailingChevron />
        <View style={{ height: 1, backgroundColor: tone, opacity: 0.3 }} />
        <Row />
      </View>
    </IlloFrame>
  );
}

function InfoBannerIllustration({ tone }: { tone: string }) {
  // Stack of two pills — one with a leading dot icon, one without. Evokes
  // the M-InfoBanner "with icon" / "no icon" treatments.
  return (
    <IlloFrame>
      <View style={{ gap: 10, alignItems: "flex-start" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 9999,
            backgroundColor: tone,
            opacity: 0.18,
          }}
        >
          <View
            style={{ width: 8, height: 8, backgroundColor: tone, borderRadius: 9999 }}
          />
          <View
            style={{ width: 50, height: 4, backgroundColor: tone, borderRadius: 2 }}
          />
        </View>
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 9999,
            backgroundColor: tone,
            opacity: 0.18,
          }}
        >
          <View
            style={{ width: 64, height: 4, backgroundColor: tone, borderRadius: 2 }}
          />
        </View>
      </View>
    </IlloFrame>
  );
}

function IconButtonIllustration({ tone }: { tone: string }) {
  // Trio of circular icon-only buttons to evoke the M-IconButton emphasis
  // levels (default, ghost, action).
  return (
    <IlloFrame>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 9999,
            borderWidth: 2,
            borderColor: tone,
          }}
        />
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 9999,
            backgroundColor: tone,
          }}
        />
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 9999,
            borderWidth: 2,
            borderColor: tone,
            opacity: 0.5,
          }}
        />
      </View>
    </IlloFrame>
  );
}
