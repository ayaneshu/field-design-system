import { View, useWindowDimensions } from "react-native";
import Svg, { Circle, Path, Polygon, Rect } from "react-native-svg";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { radius } from "@field-ds/tokens";

import { PageScaffold, type SidebarItem } from "../components/PageScaffold";
import { HubCardShell, useInk } from "./FoundationsScreen";
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
  { route: "ActionBar", name: "Action Bar", illustration: ActionBarIllustration },
  { route: "BottomNav", name: "BottomNav", illustration: BottomNavIllustration },
  { route: "BottomSheet", name: "BottomSheet", illustration: BottomSheetIllustration },
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
    route: "PageHeader",
    name: "Page Header",
    illustration: PageHeaderIllustration,
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
    route: "Radio",
    name: "Radio",
    illustration: RadioIllustration,
  },
  {
    route: "RatingInput",
    name: "Rating Input",
    illustration: RatingInputIllustration,
  },
  {
    route: "RoundButton",
    name: "Round Button",
    illustration: RoundButtonIllustration,
  },
  {
    route: "SearchBar",
    name: "Search Bar",
    illustration: SearchBarIllustration,
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
    route: "Switch",
    name: "Switch",
    illustration: SwitchIllustration,
  },
  {
    route: "TextButton",
    name: "Text Button",
    illustration: TextButtonIllustration,
  },
  {
    route: "NeutralTextButton",
    name: "Text Button Neutral",
    illustration: NeutralTextButtonIllustration,
  },
  {
    route: "Toggle",
    name: "Toggle",
    illustration: ToggleIllustration,
  },
];

function ToggleIllustration({ tone }: { tone: string }) {
  // Two settings rows — each pairs a label (left) with a toggle (right).
  // Top row OFF, bottom row ON. Reads as a settings panel snippet, which
  // is exactly where M-Toggle ships.
  const { ambient } = useInk();
  const Row = ({ on }: { on: boolean }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        width: 156,
      }}
    >
      <View style={{ gap: 3 }}>
        <LabelBar width={68} alpha={0.85} tone={tone} />
        <LabelBar width={48} alpha={0.4} tone={tone} />
      </View>
      <View
        style={{
          width: 40,
          height: 22,
          borderRadius: 9999,
          backgroundColor: on ? tone : "transparent",
          borderWidth: on ? 0 : STROKE,
          borderColor: tone,
          opacity: on ? 1 : 0.55,
          padding: 2.5,
          alignItems: on ? "flex-end" : "flex-start",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: 16,
            height: 16,
            borderRadius: 9999,
            backgroundColor: on ? ambient : tone,
          }}
        />
      </View>
    </View>
  );
  return (
    <IlloFrame>
      <View style={{ gap: 10, alignItems: "center" }}>
        <Row on={false} />
        <View
          style={{ width: 156, height: STROKE, backgroundColor: tone, opacity: 0.18 }}
        />
        <Row on />
      </View>
    </IlloFrame>
  );
}

function SwitchIllustration({ tone }: { tone: string }) {
  // Segmented control with three labelled slots, middle active. A label
  // line above ("Sort by") + the segmented control reads as a real toolbar
  // selection, not an isolated pill.
  const { ambient } = useInk();
  return (
    <IlloFrame>
      <View style={{ alignItems: "center", gap: 8 }}>
        <View style={{ width: 156, alignItems: "flex-start" }}>
          <LabelBar width={56} alpha={0.5} tone={tone} />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: 156,
            height: 30,
            borderRadius: 9999,
            borderWidth: STROKE,
            borderColor: tone,
            padding: 3,
          }}
        >
          <View style={{ flex: 1, alignItems: "center" }}>
            <LabelBar width={20} alpha={0.5} tone={tone} />
          </View>
          <View
            style={{
              flex: 1,
              height: 20,
              borderRadius: 9999,
              backgroundColor: tone,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: 20,
                height: STROKE + 0.5,
                backgroundColor: ambient,
                borderRadius: 1,
              }}
            />
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            <LabelBar width={20} alpha={0.5} tone={tone} />
          </View>
        </View>
      </View>
    </IlloFrame>
  );
}

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
//
// Family recipe matched with FoundationsScreen.tsx:
//   1. Hairline 1.5px strokes
//   2. Opacity ramp 1.0 / 0.45 / 0.22
//   3. Focal element framed by ambient context (label / paragraph line /
//      status bar / annotation)
//   4. Radii vocabulary: 4 utility, 6 cards, 9999 pills
//   5. One designer's note per tile

const ILLO_W = 200;
const ILLO_H = 116;
const STROKE = 1.5;

function LabelBar({
  width,
  alpha = 0.45,
  tone,
  height = STROKE + 1,
}: {
  width: number;
  alpha?: number;
  tone: string;
  height?: number;
}) {
  return (
    <View
      style={{
        width,
        height,
        borderRadius: 1.5,
        backgroundColor: tone,
        opacity: alpha,
      }}
    />
  );
}

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
  // Three rows in one framed card, middle row expanded with two body lines.
  // A leading dot icon on each header row + chevron on the right turns
  // generic "stacked bars" into clearly readable disclosure headers.
  const Header = ({
    titleWidth,
    expanded,
  }: {
    titleWidth: number;
    expanded: boolean;
  }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
      }}
    >
      <View
        style={{
          width: 10,
          height: 10,
          borderRadius: 9999,
          borderWidth: STROKE,
          borderColor: tone,
          opacity: 0.65,
        }}
      />
      <View style={{ flex: 1 }}>
        <LabelBar width={titleWidth} alpha={expanded ? 1 : 0.7} tone={tone} />
      </View>
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: 4,
          borderRightWidth: 4,
          borderTopWidth: expanded ? 0 : 5,
          borderBottomWidth: expanded ? 5 : 0,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderTopColor: expanded ? "transparent" : tone,
          borderBottomColor: expanded ? tone : "transparent",
          opacity: 0.85,
        }}
      />
    </View>
  );
  return (
    <IlloFrame>
      <View
        style={{
          width: 168,
          borderWidth: STROKE,
          borderColor: tone,
          borderRadius: radius["6"],
          overflow: "hidden",
        }}
      >
        <Header titleWidth={66} expanded={false} />
        <View style={{ height: STROKE, backgroundColor: tone, opacity: 0.18 }} />
        <Header titleWidth={74} expanded />
        {/* Expanded body — three paragraph lines + a small action chip */}
        <View style={{ paddingHorizontal: 28, paddingBottom: 10, gap: 4 }}>
          <LabelBar width={120} alpha={0.4} tone={tone} />
          <LabelBar width={96} alpha={0.4} tone={tone} />
          <LabelBar width={72} alpha={0.4} tone={tone} />
        </View>
        <View style={{ height: STROKE, backgroundColor: tone, opacity: 0.18 }} />
        <Header titleWidth={56} expanded={false} />
      </View>
    </IlloFrame>
  );
}

function ActionBarIllustration({ tone }: { tone: string }) {
  // A caption / placeholder line above a full-width CTA pill — the canonical
  // single-layout ActionBar.
  return (
    <IlloFrame>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 16,
          gap: 8,
        }}
      >
        <LabelBar width={96} alpha={0.35} tone={tone} />
        <View
          style={{
            width: "82%",
            height: 18,
            borderRadius: 8,
            backgroundColor: tone,
            opacity: 0.85,
          }}
        />
      </View>
    </IlloFrame>
  );
}

function BottomSheetIllustration({ tone }: { tone: string }) {
  // A grabber bar above a rounded sheet card, plus a hint of a primary CTA
  // pinned to the bottom — mirrors the floating-12px-inset chrome.
  return (
    <IlloFrame>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "flex-end" }}>
        <View
          style={{
            width: 28,
            height: 3,
            borderRadius: 9999,
            backgroundColor: tone,
            opacity: 0.45,
            marginBottom: 6,
          }}
        />
        <View
          style={{
            width: "82%",
            height: 76,
            borderRadius: 12,
            borderWidth: STROKE,
            borderColor: tone,
            opacity: 0.9,
            paddingHorizontal: 10,
            paddingTop: 12,
            justifyContent: "space-between",
            paddingBottom: 8,
          }}
        >
          <View style={{ gap: 4 }}>
            <LabelBar width={56} alpha={0.55} tone={tone} />
            <LabelBar width={88} alpha={0.35} tone={tone} />
            <LabelBar width={72} alpha={0.35} tone={tone} />
          </View>
          <View
            style={{
              height: 14,
              borderRadius: 6,
              backgroundColor: tone,
              opacity: 0.85,
            }}
          />
        </View>
        <View
          style={{
            width: 38,
            height: 2,
            borderRadius: 9999,
            backgroundColor: tone,
            opacity: 0.35,
            marginTop: 8,
            marginBottom: 4,
          }}
        />
      </View>
    </IlloFrame>
  );
}

function BottomNavIllustration({ tone }: { tone: string }) {
  // Bottom-nav strip with five tabs, middle active, plus the iOS home
  // indicator hairline below — exactly how the M-BottomNav ships. The
  // active tab gets a small notification badge dot at its top-right,
  // rendered as a filled disc with an ambient hairline ring so it reads
  // against the active-tab fill in both light and dark modes.
  const { ambient } = useInk();
  const Tab = ({ active, badge }: { active?: boolean; badge?: boolean }) => (
    <View style={{ alignItems: "center", gap: 4, flex: 1 }}>
      <View style={{ width: 14, height: 14 }}>
        <View
          style={{
            width: 14,
            height: 14,
            borderRadius: 3,
            backgroundColor: active ? tone : "transparent",
            borderWidth: active ? 0 : STROKE,
            borderColor: tone,
            opacity: active ? 1 : 0.55,
          }}
        />
        {badge ? (
          <View
            style={{
              position: "absolute",
              top: -3,
              right: -3,
              width: 7,
              height: 7,
              borderRadius: 9999,
              backgroundColor: tone,
              borderWidth: STROKE,
              borderColor: ambient,
            }}
          />
        ) : null}
      </View>
      <LabelBar width={active ? 18 : 14} alpha={active ? 0.95 : 0.4} tone={tone} height={STROKE} />
    </View>
  );
  return (
    <IlloFrame>
      <View
        style={{
          width: 172,
          borderWidth: STROKE,
          borderColor: tone,
          borderRadius: radius["12"],
          paddingHorizontal: 10,
          paddingTop: 10,
          paddingBottom: 8,
          alignItems: "center",
          gap: 6,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "stretch",
            gap: 6,
          }}
        >
          <Tab />
          <Tab badge />
          <Tab active />
          <Tab />
          <Tab />
        </View>
        {/* Home indicator hairline */}
        <View
          style={{
            width: 60,
            height: STROKE,
            backgroundColor: tone,
            borderRadius: 1,
            opacity: 0.75,
          }}
        />
      </View>
    </IlloFrame>
  );
}

function RadioIllustration({ tone }: { tone: string }) {
  // Three radios in a single-select group with title + label lines. Top
  // row selected (filled inner disc), the other two unselected, each at
  // decreasing alpha to show natural visual rhythm.
  const Row = ({ selected, labelW, alpha }: { selected: boolean; labelW: number; alpha: number }) => (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <View
        style={{
          width: 16,
          height: 16,
          borderRadius: 9999,
          borderWidth: STROKE,
          borderColor: tone,
          alignItems: "center",
          justifyContent: "center",
          opacity: selected ? 1 : alpha,
        }}
      >
        {selected ? (
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 9999,
              backgroundColor: tone,
            }}
          />
        ) : null}
      </View>
      <LabelBar width={labelW} alpha={selected ? 0.95 : alpha} tone={tone} />
    </View>
  );
  return (
    <IlloFrame>
      <View style={{ gap: 8 }}>
        <LabelBar width={56} alpha={0.55} tone={tone} />
        <View style={{ gap: 9 }}>
          <Row selected labelW={86} alpha={0.55} />
          <Row selected={false} labelW={72} alpha={0.55} />
          <Row selected={false} labelW={92} alpha={0.4} />
        </View>
      </View>
    </IlloFrame>
  );
}

function CheckboxIllustration({ tone }: { tone: string }) {
  // Three checkboxes — indeterminate parent ("Select all" hint) above two
  // children: one checked, one unchecked. The implied hierarchy is the
  // designer's note that lifts this above a generic three-row stack.
  const { ambient } = useInk();
  const Row = ({
    state,
    labelW,
    alpha,
    indent,
  }: {
    state: "checked" | "indeterminate" | "unchecked";
    labelW: number;
    alpha: number;
    indent?: boolean;
  }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingLeft: indent ? 14 : 0,
      }}
    >
      <View
        style={{
          width: 16,
          height: 16,
          borderRadius: 4,
          borderWidth: state === "unchecked" ? STROKE : 0,
          borderColor: tone,
          backgroundColor: state === "unchecked" ? "transparent" : tone,
          alignItems: "center",
          justifyContent: "center",
          opacity: state === "unchecked" ? alpha : 1,
        }}
      >
        {state === "checked" ? (
          <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
            <Path
              d="M2.5 6.2 L5 8.5 L9.5 3.6"
              stroke={ambient}
              strokeWidth={1.7}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        ) : state === "indeterminate" ? (
          <View
            style={{
              width: 8,
              height: STROKE + 0.5,
              backgroundColor: ambient,
              borderRadius: 1,
            }}
          />
        ) : null}
      </View>
      <LabelBar width={labelW} alpha={state === "unchecked" ? alpha : 0.95} tone={tone} />
    </View>
  );
  return (
    <IlloFrame>
      <View style={{ gap: 9 }}>
        <Row state="indeterminate" labelW={86} alpha={0.55} />
        <Row state="checked" labelW={76} alpha={0.55} indent />
        <Row state="unchecked" labelW={92} alpha={0.45} indent />
      </View>
    </IlloFrame>
  );
}

function DividerIllustration({ tone }: { tone: string }) {
  // Three settings sections separated by dividers. Each section has a
  // small leading dot (section glyph), a header label and a body line.
  // The dividers themselves vary — full-width solid above, inset solid
  // below (padding-left example), then a dashed divider for the variant
  // showcase. Reads as a settings menu with proper hierarchy.
  const Section = ({
    labelW,
    bodyW,
  }: {
    labelW: number;
    bodyW: number;
  }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 6,
        paddingVertical: 4,
      }}
    >
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 9999,
          borderWidth: STROKE,
          borderColor: tone,
          opacity: 0.55,
        }}
      />
      <View style={{ flex: 1, gap: 3 }}>
        <LabelBar width={labelW} alpha={0.9} tone={tone} height={STROKE + 0.5} />
        <LabelBar width={bodyW} alpha={0.4} tone={tone} height={STROKE} />
      </View>
    </View>
  );
  return (
    <IlloFrame>
      <View
        style={{
          width: 168,
          borderWidth: STROKE,
          borderColor: tone,
          borderRadius: radius["6"],
          overflow: "hidden",
        }}
      >
        <Section labelW={68} bodyW={96} />
        {/* Full-width solid divider */}
        <View style={{ height: STROKE, backgroundColor: tone, opacity: 0.5 }} />
        <Section labelW={56} bodyW={108} />
        {/* Inset solid divider — starts after the leading dot column */}
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: 22 }} />
          <View style={{ flex: 1, height: STROKE, backgroundColor: tone, opacity: 0.5 }} />
        </View>
        <Section labelW={72} bodyW={84} />
        {/* Dashed divider — variant showcase */}
        <View
          style={{
            height: 0,
            borderTopWidth: STROKE,
            borderTopColor: tone,
            borderStyle: "dashed",
            opacity: 0.45,
          }}
        />
        <Section labelW={48} bodyW={100} />
      </View>
    </IlloFrame>
  );
}

function PageHeaderIllustration({ tone }: { tone: string }) {
  // Phone-style header: a status bar at the top (time + signal dots), a
  // hairline rule, then the actual header row (back chevron · title ·
  // trailing icon). The status bar is the differentiator from input-text
  // illustrations — this immediately reads as the top of a screen.
  return (
    <IlloFrame>
      <View
        style={{
          width: 172,
          borderWidth: STROKE,
          borderColor: tone,
          borderRadius: radius["8"],
          overflow: "hidden",
        }}
      >
        {/* Status bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 10,
            paddingVertical: 4,
          }}
        >
          <LabelBar width={20} alpha={0.7} tone={tone} height={STROKE + 0.5} />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
            <View style={{ width: 3, height: 3, borderRadius: 9999, backgroundColor: tone, opacity: 0.7 }} />
            <View style={{ width: 3, height: 3, borderRadius: 9999, backgroundColor: tone, opacity: 0.55 }} />
            <View style={{ width: 3, height: 3, borderRadius: 9999, backgroundColor: tone, opacity: 0.4 }} />
          </View>
        </View>
        <View style={{ height: STROKE, backgroundColor: tone, opacity: 0.18 }} />
        {/* Header row */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
            paddingVertical: 10,
            gap: 10,
          }}
        >
          <Svg width={10} height={12} viewBox="0 0 10 12" fill="none">
            <Path
              d="M7 1.5 L2 6 L7 10.5"
              stroke={tone}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <View style={{ flex: 1, alignItems: "center", gap: 3 }}>
            <LabelBar width={72} alpha={1} tone={tone} height={STROKE + 1} />
            <LabelBar width={48} alpha={0.4} tone={tone} height={STROKE} />
          </View>
          <View
            style={{
              width: 14,
              height: 14,
              borderRadius: 9999,
              borderWidth: STROKE,
              borderColor: tone,
              opacity: 0.55,
            }}
          />
        </View>
      </View>
    </IlloFrame>
  );
}

// Shared "button pill" composition — the variation between the button
// illustrations is just stroke / fill / label, so we factor the chassis.
function ButtonChip({
  filled,
  tone,
  width,
  height = 28,
  alpha = 1,
  rounded = "rect",
  labelWidth = 36,
  labelAlpha,
}: {
  filled: boolean;
  tone: string;
  /** Fixed pixel width. Omit to let the chip fill its flex parent. */
  width?: number;
  height?: number;
  alpha?: number;
  rounded?: "rect" | "pill";
  labelWidth?: number;
  labelAlpha?: number;
}) {
  const { ambient } = useInk();
  return (
    <View
      style={{
        width,
        height,
        borderRadius: rounded === "pill" ? 9999 : radius["8"],
        backgroundColor: filled ? tone : "transparent",
        borderWidth: filled ? 0 : STROKE,
        borderColor: tone,
        opacity: alpha,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: labelWidth,
          height: STROKE + 1,
          backgroundColor: filled ? ambient : tone,
          borderRadius: 1,
          opacity: labelAlpha ?? (filled ? 1 : 0.85),
        }}
      />
    </View>
  );
}

/**
 * Tile context — a stack of two short input-field outlines above the
 * focal button(s). Reads as "this button sits at the end of a form",
 * which is exactly where Primary/Secondary CTAs live.
 */
function FormContext({ tone, fieldWidth = 132 }: { tone: string; fieldWidth?: number }) {
  return (
    <View style={{ alignItems: "center", gap: 6 }}>
      {[0, 1].map((i) => (
        <View
          key={i}
          style={{
            width: fieldWidth,
            paddingHorizontal: 8,
            paddingVertical: 6,
            borderWidth: STROKE,
            borderColor: tone,
            borderRadius: 4,
            opacity: 0.32,
            justifyContent: "center",
          }}
        >
          <LabelBar width={i === 0 ? 68 : 84} alpha={1} tone={tone} height={STROKE} />
        </View>
      ))}
    </View>
  );
}

function PrimaryButtonIllustration({ tone }: { tone: string }) {
  // Two faint form-field outlines above a single bold filled CTA — reads
  // as "submit a form". The hierarchy is unambiguous: the dark filled
  // button is the destination.
  return (
    <IlloFrame>
      <View style={{ alignItems: "center", gap: 8 }}>
        <FormContext tone={tone} fieldWidth={132} />
        <ButtonChip filled tone={tone} width={132} height={26} labelWidth={52} />
      </View>
    </IlloFrame>
  );
}

function SecondaryButtonIllustration({ tone }: { tone: string }) {
  // Modal action sheet — a "Discard / Save" two-button footer at the
  // bottom of a sheet. The outlined Secondary (Discard) sits beside a
  // filled Primary (Save), framed by a hairline sheet outline with a
  // grabber handle at the top. Reads as "the companion to primary in a
  // confirmation dialog", clearly different from Primary's lone CTA.
  return (
    <IlloFrame>
      <View
        style={{
          width: 168,
          borderWidth: STROKE,
          borderColor: tone,
          borderRadius: radius["6"],
          paddingHorizontal: 10,
          paddingTop: 6,
          paddingBottom: 10,
          gap: 8,
          alignItems: "center",
        }}
      >
        {/* Sheet grabber */}
        <View
          style={{
            width: 28,
            height: STROKE + 1,
            borderRadius: 9999,
            backgroundColor: tone,
            opacity: 0.35,
          }}
        />
        <View style={{ alignItems: "center", gap: 3, alignSelf: "stretch" }}>
          <LabelBar width={104} alpha={0.85} tone={tone} height={STROKE + 0.5} />
          <LabelBar width={132} alpha={0.4} tone={tone} height={STROKE} />
        </View>
        {/* Action pair — Secondary (outline) + Primary (filled) */}
        <View style={{ flexDirection: "row", gap: 6, alignSelf: "stretch" }}>
          <View style={{ flex: 1 }}>
            <ButtonChip filled={false} tone={tone} width={undefined as never} height={24} labelWidth={28} />
          </View>
          <View style={{ flex: 1 }}>
            <ButtonChip filled tone={tone} width={undefined as never} height={24} labelWidth={28} />
          </View>
        </View>
      </View>
    </IlloFrame>
  );
}

function SecondaryNeutralButtonIllustration({ tone }: { tone: string }) {
  // Inline toolbar of three outlined neutral actions — "Edit · Share ·
  // Delete" style, sitting under a list-item-ish header. Distinct from
  // Secondary because there's no Primary partner and there are three
  // equal-emphasis actions in a row, which is the canonical Secondary
  // Neutral pattern.
  return (
    <IlloFrame>
      <View
        style={{
          width: 168,
          borderWidth: STROKE,
          borderColor: tone,
          borderRadius: radius["6"],
          paddingHorizontal: 10,
          paddingVertical: 10,
          gap: 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              backgroundColor: tone,
              opacity: 0.6,
            }}
          />
          <View style={{ flex: 1, gap: 3 }}>
            <LabelBar width={72} alpha={0.85} tone={tone} height={STROKE + 0.5} />
            <LabelBar width={48} alpha={0.4} tone={tone} height={STROKE} />
          </View>
        </View>
        {/* Toolbar of three outlined neutral buttons */}
        <View style={{ flexDirection: "row", gap: 5 }}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={{ flex: 1 }}>
              <ButtonChip
                filled={false}
                tone={tone}
                               height={22}
                labelWidth={22}
                alpha={0.55}
              />
            </View>
          ))}
        </View>
      </View>
    </IlloFrame>
  );
}

function NeutralButtonIllustration({ tone }: { tone: string }) {
  // A list-item card with a filled neutral CTA at the bottom — the "View
  // all" / "Manage" trailing action that ships under a content block.
  // Distinct from Primary (form submit) by sitting under a content stack
  // rather than two form fields.
  return (
    <IlloFrame>
      <View
        style={{
          width: 168,
          borderWidth: STROKE,
          borderColor: tone,
          borderRadius: radius["6"],
          paddingHorizontal: 10,
          paddingVertical: 10,
          gap: 6,
        }}
      >
        {/* Mock content stack */}
        <View style={{ gap: 3 }}>
          <LabelBar width={92} alpha={0.85} tone={tone} height={STROKE + 0.5} />
          <LabelBar width={132} alpha={0.4} tone={tone} height={STROKE} />
          <LabelBar width={108} alpha={0.4} tone={tone} height={STROKE} />
        </View>
        <View style={{ alignSelf: "stretch", marginTop: 2 }}>
          <ButtonChip
            filled
            tone={tone}
                       height={24}
            labelWidth={56}
            alpha={0.85}
          />
        </View>
      </View>
    </IlloFrame>
  );
}

function RoundButtonIllustration({ tone }: { tone: string }) {
  // Trio of circular icon-buttons in a row — distinct from Neutral Button
  // (which is rectangular). This is the canonical M-RoundButton shape:
  // small circular affordances often used as floating actions.
  const { ambient } = useInk();
  const Btn = ({
    filled,
    alpha = 1,
    glyph,
  }: {
    filled: boolean;
    alpha?: number;
    glyph: "plus" | "arrow" | "dot";
  }) => (
    <View
      style={{
        width: 36,
        height: 36,
        borderRadius: 9999,
        backgroundColor: filled ? tone : "transparent",
        borderWidth: filled ? 0 : STROKE,
        borderColor: tone,
        alignItems: "center",
        justifyContent: "center",
        opacity: alpha,
      }}
    >
      {glyph === "plus" ? (
        <>
          <View
            style={{
              position: "absolute",
              width: 14,
              height: STROKE,
              backgroundColor: filled ? ambient : tone,
            }}
          />
          <View
            style={{
              position: "absolute",
              width: STROKE,
              height: 14,
              backgroundColor: filled ? ambient : tone,
            }}
          />
        </>
      ) : glyph === "arrow" ? (
        <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
          <Path
            d="M3 7 L11 7 M7 3 L11 7 L7 11"
            stroke={filled ? ambient : tone}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      ) : (
        <View
          style={{
            width: 6,
            height: 6,
            borderRadius: 9999,
            backgroundColor: filled ? ambient : tone,
          }}
        />
      )}
    </View>
  );
  return (
    <IlloFrame>
      <View style={{ alignItems: "center", gap: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          <Btn filled={false} glyph="dot" alpha={0.55} />
          <Btn filled glyph="plus" />
          <Btn filled={false} glyph="arrow" />
        </View>
        <LabelBar width={76} alpha={0.35} tone={tone} />
      </View>
    </IlloFrame>
  );
}

function TextButtonIllustration({ tone }: { tone: string }) {
  // A short paragraph of three lines (low alpha) followed by a "Read more →"
  // call-to-action — exactly the pattern M-TextButton ships in. The body
  // text gives the link affordance its semantic home.
  return (
    <IlloFrame>
      <View style={{ width: 156, gap: 4, alignItems: "flex-start" }}>
        <LabelBar width={140} alpha={0.4} tone={tone} height={STROKE} />
        <LabelBar width={120} alpha={0.4} tone={tone} height={STROKE} />
        <LabelBar width={92} alpha={0.4} tone={tone} height={STROKE} />
        <View style={{ height: 4 }} />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <LabelBar width={56} alpha={1} tone={tone} height={STROKE + 1} />
          <Svg width={10} height={10} viewBox="0 0 10 10" fill="none">
            <Path
              d="M1.5 5 L8 5 M5 1.5 L8 5 L5 8.5"
              stroke={tone}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
      </View>
    </IlloFrame>
  );
}

function NeutralTextButtonIllustration({ tone }: { tone: string }) {
  // A short notice block — heading line, two body lines, then a quiet
  // "Dismiss" CTA on the right. Neutral text buttons rarely carry a
  // directional arrow; they sit beside copy as dismissive / supportive
  // actions, which is what this layout reads as.
  return (
    <IlloFrame>
      <View
        style={{
          width: 160,
          paddingHorizontal: 10,
          paddingVertical: 8,
          borderRadius: 8,
          borderWidth: STROKE,
          borderColor: tone,
          opacity: 0.95,
          gap: 6,
        }}
      >
        <LabelBar width={110} alpha={0.85} tone={tone} height={STROKE + 1} />
        <View style={{ gap: 3 }}>
          <LabelBar width={134} alpha={0.4} tone={tone} height={STROKE} />
          <LabelBar width={108} alpha={0.4} tone={tone} height={STROKE} />
        </View>
        <View
          style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 2 }}
        >
          <LabelBar width={42} alpha={0.9} tone={tone} height={STROKE + 1} />
        </View>
      </View>
    </IlloFrame>
  );
}

function IconButtonIllustration({ tone }: { tone: string }) {
  // Toolbar — four circular icon-only buttons in a row inside a hairline
  // tray. Glyphs vary (plus, search, heart, more) so each button reads as
  // a distinct affordance rather than four identical circles.
  const { ambient } = useInk();
  const Btn = ({
    glyph,
    filled = false,
    alpha = 1,
  }: {
    glyph: "plus" | "search" | "heart" | "more";
    filled?: boolean;
    alpha?: number;
  }) => (
    <View
      style={{
        width: 26,
        height: 26,
        borderRadius: 9999,
        backgroundColor: filled ? tone : "transparent",
        alignItems: "center",
        justifyContent: "center",
        opacity: alpha,
      }}
    >
      {glyph === "plus" ? (
        <>
          <View style={{ position: "absolute", width: 10, height: STROKE, backgroundColor: filled ? ambient : tone }} />
          <View style={{ position: "absolute", width: STROKE, height: 10, backgroundColor: filled ? ambient : tone }} />
        </>
      ) : glyph === "search" ? (
        <Svg width={11} height={11} viewBox="0 0 12 12" fill="none">
          <Circle cx="5" cy="5" r="3.25" stroke={tone} strokeWidth={1.25} />
          <Path d="M7.6 7.6 L10 10" stroke={tone} strokeWidth={1.25} strokeLinecap="round" />
        </Svg>
      ) : glyph === "heart" ? (
        <Svg width={12} height={11} viewBox="0 0 12 11" fill="none">
          <Path
            d="M6 10 L1.8 5.6 A2.5 2.5 0 0 1 6 2.2 A2.5 2.5 0 0 1 10.2 5.6 Z"
            stroke={tone}
            strokeWidth={1.25}
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      ) : (
        <View style={{ flexDirection: "row", gap: 2 }}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={{ width: 2.5, height: 2.5, borderRadius: 9999, backgroundColor: tone }}
            />
          ))}
        </View>
      )}
    </View>
  );
  return (
    <IlloFrame>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          paddingHorizontal: 8,
          paddingVertical: 6,
          borderWidth: STROKE,
          borderColor: tone,
          borderRadius: 9999,
        }}
      >
        <Btn glyph="search" />
        <View style={{ width: STROKE, height: 14, backgroundColor: tone, opacity: 0.25 }} />
        <Btn glyph="plus" filled />
        <Btn glyph="heart" />
        <Btn glyph="more" alpha={0.55} />
      </View>
    </IlloFrame>
  );
}

function FilterChipIllustration({ tone }: { tone: string }) {
  // Horizontal scroll row of four filter chips — first two added (filled
  // emphasis), next two default (outline). The wrapping row reads as a
  // category toolbar at the top of a results list, which is where
  // M-FilterChip lives.
  const Chip = ({
    added,
    width = 56,
  }: {
    added: boolean;
    width?: number;
  }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderWidth: STROKE,
        borderColor: tone,
        borderRadius: 9999,
        opacity: added ? 1 : 0.5,
      }}
    >
      <LabelBar width={width - 22} alpha={1} tone={tone} height={STROKE} />
      {added ? (
        <Svg width={8} height={8} viewBox="0 0 8 8" fill="none">
          <Path
            d="M2 2 L6 6 M6 2 L2 6"
            stroke={tone}
            strokeWidth={STROKE}
            strokeLinecap="round"
          />
        </Svg>
      ) : (
        <View
          style={{
            width: 0,
            height: 0,
            borderLeftWidth: 3,
            borderRightWidth: 3,
            borderTopWidth: 4,
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderTopColor: tone,
          }}
        />
      )}
    </View>
  );
  return (
    <IlloFrame>
      <View style={{ alignItems: "flex-start", gap: 8 }}>
        <View style={{ flexDirection: "row", gap: 6 }}>
          <Chip added width={50} />
          <Chip added width={58} />
          <Chip added={false} width={56} />
          <Chip added={false} width={48} />
        </View>
        {/* Result hint below — a faint row of two product cards */}
        <View style={{ flexDirection: "row", gap: 6 }}>
          <View
            style={{
              width: 60,
              height: 14,
              borderRadius: 4,
              borderWidth: STROKE,
              borderColor: tone,
              opacity: 0.25,
            }}
          />
          <View
            style={{
              width: 60,
              height: 14,
              borderRadius: 4,
              borderWidth: STROKE,
              borderColor: tone,
              opacity: 0.25,
            }}
          />
        </View>
      </View>
    </IlloFrame>
  );
}

function SearchBarIllustration({ tone }: { tone: string }) {
  // Search bar at the top with a typed query, followed by a small results
  // dropdown of three rows at low alpha. Reads as a live-typing experience.
  return (
    <IlloFrame>
      <View style={{ alignItems: "center", gap: 6 }}>
        <View
          style={{
            width: 168,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderWidth: STROKE,
            borderColor: tone,
            borderRadius: 9999,
          }}
        >
          <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
            <Circle cx={5.5} cy={5.5} r={3.75} stroke={tone} strokeWidth={STROKE} />
            <Path
              d="M8.6 8.6 L12 12"
              stroke={tone}
              strokeWidth={STROKE}
              strokeLinecap="round"
            />
          </Svg>
          <LabelBar width={60} alpha={1} tone={tone} height={STROKE + 1} />
          <View style={{ width: STROKE, height: 14, backgroundColor: tone }} />
        </View>
        {/* Suggestion dropdown beneath */}
        <View
          style={{
            width: 168,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderWidth: STROKE,
            borderColor: tone,
            borderRadius: 8,
            gap: 5,
            opacity: 0.35,
          }}
        >
          <LabelBar width={104} alpha={1} tone={tone} height={STROKE} />
          <LabelBar width={84} alpha={1} tone={tone} height={STROKE} />
          <LabelBar width={120} alpha={1} tone={tone} height={STROKE} />
        </View>
      </View>
    </IlloFrame>
  );
}

function InputTextIllustration({ tone }: { tone: string }) {
  // Floating label on a focused field with a typed value + caret, plus a
  // helper line below — reads as a real form field at active state.
  return (
    <IlloFrame>
      <View style={{ width: 168, gap: 4 }}>
        <View
          style={{
            paddingHorizontal: 12,
            paddingVertical: 12,
            borderWidth: STROKE,
            borderColor: tone,
            borderRadius: radius["6"],
            flexDirection: "row",
            alignItems: "center",
            gap: 3,
          }}
        >
          <LabelBar width={92} alpha={1} tone={tone} height={STROKE + 1} />
          <View style={{ width: STROKE, height: 14, backgroundColor: tone }} />
        </View>
        {/* Floating label tucked onto the border */}
        <View
          style={{
            position: "absolute",
            top: -3,
            left: 12,
            paddingHorizontal: 4,
          }}
        >
          <LabelBar width={36} alpha={0.7} tone={tone} height={STROKE + 0.5} />
        </View>
        {/* Helper / counter row */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 2,
            marginTop: 4,
          }}
        >
          <LabelBar width={72} alpha={0.4} tone={tone} height={STROKE} />
          <LabelBar width={20} alpha={0.4} tone={tone} height={STROKE} />
        </View>
      </View>
    </IlloFrame>
  );
}

function InputTextareaIllustration({ tone }: { tone: string }) {
  // Same floating-label pattern as InputText but with a taller multi-line
  // field, a paragraph of typed text and a caret at the end of the third
  // line. A bottom-right resize handle mark is the designer's note.
  return (
    <IlloFrame>
      <View style={{ width: 168, gap: 4 }}>
        <View
          style={{
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderWidth: STROKE,
            borderColor: tone,
            borderRadius: radius["6"],
            gap: 5,
            minHeight: 64,
          }}
        >
          <LabelBar width={120} alpha={0.85} tone={tone} height={STROKE + 0.5} />
          <LabelBar width={96} alpha={0.85} tone={tone} height={STROKE + 0.5} />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
            <LabelBar width={64} alpha={0.85} tone={tone} height={STROKE + 0.5} />
            <View style={{ width: STROKE, height: 12, backgroundColor: tone }} />
          </View>
          {/* Resize handle — two short diagonal hairlines in the corner */}
          <View
            style={{
              position: "absolute",
              right: 5,
              bottom: 5,
              width: 8,
              height: 8,
            }}
          >
            <View
              style={{
                position: "absolute",
                right: 0,
                bottom: 2,
                width: 8,
                height: STROKE - 0.5,
                backgroundColor: tone,
                opacity: 0.45,
                transform: [{ rotate: "-45deg" }],
              }}
            />
            <View
              style={{
                position: "absolute",
                right: 0,
                bottom: -1,
                width: 4,
                height: STROKE - 0.5,
                backgroundColor: tone,
                opacity: 0.45,
                transform: [{ rotate: "-45deg" }],
              }}
            />
          </View>
        </View>
        <View
          style={{
            position: "absolute",
            top: -3,
            left: 12,
            paddingHorizontal: 4,
          }}
        >
          <LabelBar width={40} alpha={0.7} tone={tone} height={STROKE + 0.5} />
        </View>
      </View>
    </IlloFrame>
  );
}

function ListItemIllustration({ tone }: { tone: string }) {
  // A clearly-framed product card containing three list rows with varied
  // leading slots (icon, avatar, checkbox) and trailing affordances
  // (chevron, badge, toggle). Demonstrates the full vocabulary of
  // M-ListItem in one tile.
  const { ambient } = useInk();
  const Row = ({
    leading,
    trailing,
    labelW,
    subW,
  }: {
    leading: "icon" | "avatar" | "checkbox";
    trailing: "chevron" | "badge" | "toggle" | "none";
    labelW: number;
    subW: number;
  }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
      }}
    >
      {leading === "icon" ? (
        <View
          style={{
            width: 18,
            height: 18,
            borderRadius: 9999,
            borderWidth: STROKE,
            borderColor: tone,
            opacity: 0.7,
          }}
        />
      ) : leading === "avatar" ? (
        <View
          style={{
            width: 18,
            height: 18,
            borderRadius: 9999,
            backgroundColor: tone,
            opacity: 0.9,
          }}
        />
      ) : (
        <View
          style={{
            width: 16,
            height: 16,
            borderRadius: 3,
            backgroundColor: tone,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
            <Path
              d="M2.5 6.2 L5 8.5 L9.5 3.6"
              stroke={ambient}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
      )}
      <View style={{ flex: 1, gap: 3 }}>
        <LabelBar width={labelW} alpha={1} tone={tone} height={STROKE + 0.5} />
        <LabelBar width={subW} alpha={0.45} tone={tone} height={STROKE} />
      </View>
      {trailing === "chevron" ? (
        <Svg width={6} height={9} viewBox="0 0 6 9" fill="none">
          <Path
            d="M1 1 L5 4.5 L1 8"
            stroke={tone}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.6}
          />
        </Svg>
      ) : trailing === "badge" ? (
        <View
          style={{
            width: 18,
            height: 12,
            borderRadius: 9999,
            backgroundColor: tone,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LabelBar width={8} alpha={1} tone={ambient} height={STROKE} />
        </View>
      ) : trailing === "toggle" ? (
        <View
          style={{
            width: 24,
            height: 14,
            borderRadius: 9999,
            backgroundColor: tone,
            padding: 1.5,
            alignItems: "flex-end",
          }}
        >
          <View style={{ width: 11, height: 11, borderRadius: 9999, backgroundColor: ambient }} />
        </View>
      ) : null}
    </View>
  );
  return (
    <IlloFrame>
      <View
        style={{
          width: 172,
          borderWidth: STROKE,
          borderColor: tone,
          borderRadius: radius["6"],
          overflow: "hidden",
        }}
      >
        <Row leading="icon" trailing="chevron" labelW={88} subW={60} />
        <View style={{ height: STROKE, backgroundColor: tone, opacity: 0.18 }} />
        <Row leading="avatar" trailing="badge" labelW={76} subW={48} />
        <View style={{ height: STROKE, backgroundColor: tone, opacity: 0.18 }} />
        <Row leading="checkbox" trailing="toggle" labelW={92} subW={56} />
      </View>
    </IlloFrame>
  );
}

function InfoBannerIllustration({ tone }: { tone: string }) {
  // A product-card mock with two info banners overlaid — one stacked at the
  // top with a leading dot icon ("Verified seller") and one shorter banner
  // below the title ("Member exclusive"). Reads as "status pills in
  // context" rather than two pills floating in space.
  return (
    <IlloFrame>
      <View
        style={{
          width: 168,
          borderWidth: STROKE,
          borderColor: tone,
          borderRadius: radius["6"],
          padding: 10,
          gap: 6,
        }}
      >
        {/* Product image placeholder */}
        <View
          style={{
            height: 26,
            borderRadius: 4,
            backgroundColor: tone,
            opacity: 0.16,
          }}
        />
        <View style={{ gap: 4 }}>
          {/* Title row with first banner */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <LabelBar width={64} alpha={0.85} tone={tone} height={STROKE + 0.5} />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                paddingHorizontal: 6,
                paddingVertical: 3,
                borderRadius: 9999,
                borderWidth: STROKE,
                borderColor: tone,
              }}
            >
              <View
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 9999,
                  backgroundColor: tone,
                }}
              />
              <LabelBar width={26} alpha={0.9} tone={tone} height={STROKE} />
            </View>
          </View>
          {/* Subtitle line */}
          <LabelBar width={120} alpha={0.4} tone={tone} height={STROKE} />
          {/* Second banner — inline */}
          <View style={{ flexDirection: "row", marginTop: 2 }}>
            <View
              style={{
                paddingHorizontal: 7,
                paddingVertical: 3,
                borderRadius: 9999,
                borderWidth: STROKE,
                borderColor: tone,
                opacity: 0.55,
              }}
            >
              <LabelBar width={52} alpha={1} tone={tone} height={STROKE} />
            </View>
          </View>
        </View>
      </View>
    </IlloFrame>
  );
}

function RatingInputIllustration({ tone }: { tone: string }) {
  // Five proper 5-pointed stars via SVG polygons, three filled / two
  // outlined, plus a label line below ("4.3 out of 5" feel). Now reads
  // unambiguously as a rating affordance.
  const Star = ({ filled }: { filled: boolean }) => (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
      <Polygon
        points="9,1.5 11.2,6.4 16.5,7 12.6,10.8 13.7,16 9,13.4 4.3,16 5.4,10.8 1.5,7 6.8,6.4"
        fill={filled ? tone : "none"}
        stroke={tone}
        strokeWidth={STROKE}
        strokeLinejoin="round"
        opacity={filled ? 1 : 0.55}
      />
    </Svg>
  );
  return (
    <IlloFrame>
      <View style={{ alignItems: "center", gap: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Star filled />
          <Star filled />
          <Star filled />
          <Star filled={false} />
          <Star filled={false} />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <LabelBar width={28} alpha={0.85} tone={tone} height={STROKE + 1} />
          <LabelBar width={48} alpha={0.4} tone={tone} height={STROKE} />
        </View>
      </View>
    </IlloFrame>
  );
}

