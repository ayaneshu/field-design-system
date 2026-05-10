import { Text, View } from "react-native";
import type { Meta, StoryObj } from "@storybook/react";

import {
  InfoBanner,
  type InfoBannerColor,
  type InfoBannerShape,
  type InfoBannerSize,
} from "@field-ds/components";
import type { IconName } from "@field-ds/icons";
import { colour, space, textStyles } from "@field-ds/tokens";

const COLORS: InfoBannerColor[] = [
  "green",
  "grey",
  "blue",
  "orange",
  "supermall",
  "purple",
  "red",
];
const SIZES: InfoBannerSize[] = ["small", "large"];
const SHAPES: InfoBannerShape[] = ["rounded", "rectangular"];

// Curated icon set for the controls panel — covers the glyphs designers
// reach for when configuring an inline status pill.
const ICON_PICKER_OPTIONS: IconName[] = [
  "system-verified",
  "system-check-circle",
  "system-info-circle",
  "system-bag",
  "system-heart",
  "system-search",
  "system-sort",
];

const meta = {
  title: "Components/InfoBanner",
  component: InfoBanner,
  argTypes: {
    label: { control: "text" },
    color: { control: "inline-radio", options: COLORS },
    size: { control: "inline-radio", options: SIZES },
    shape: { control: "inline-radio", options: SHAPES },
    showIcon: { control: "boolean" },
    icon: { control: "select", options: ICON_PICKER_OPTIONS },
  },
  args: {
    label: "Verified seller",
    color: "green",
    size: "small",
    shape: "rounded",
    showIcon: true,
    icon: "system-verified",
  },
  parameters: {
    docs: {
      description: {
        component:
          "M-InfoBanner — single-line status pill that sits inline beside product info, CTAs, or list rows. Non-interactive by design: success confirmations, ETAs, promo tags, low-stock nudges. Pick `color` by intent (green=success, red=error, orange=warning, blue=info/action, grey=neutral, supermall=supermall, purple=loyalty). Background fades left-to-right from the colour's subtle tint to white. Two `size`s × two `shape`s drive padding, gap, icon size, and text style. Keep labels short — long copy truncates.",
      },
    },
  },
} satisfies Meta<typeof InfoBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Verified seller" },
};

export const SmallRoundGrey: Story = {
  name: "Small · Round · Grey",
  args: { label: "Coming soon", color: "grey" },
};

export const SmallRoundBlue: Story = {
  name: "Small · Round · Blue",
  args: { label: "New", color: "blue" },
};

export const SmallRoundOrange: Story = {
  name: "Small · Round · Orange",
  args: { label: "Low stock", color: "orange" },
};

export const SmallRoundSupermall: Story = {
  name: "Small · Round · Supermall",
  args: { label: "Supermall", color: "supermall" },
};

export const SmallRoundPurple: Story = {
  name: "Small · Round · Purple",
  args: { label: "Member exclusive", color: "purple" },
};

export const SmallRoundRed: Story = {
  name: "Small · Round · Red",
  args: { label: "Out of stock", color: "red" },
};

export const SmallRectangular: Story = {
  name: "Small · Rectangular",
  args: { label: "Verified", shape: "rectangular" },
};

export const LargeRound: Story = {
  name: "Large · Round",
  args: { label: "Arrives Tue", size: "large" },
};

export const LargeRectangular: Story = {
  name: "Large · Rectangular",
  args: { label: "Free shipping", color: "blue", size: "large", shape: "rectangular" },
};

export const NoIconSmall: Story = {
  name: "No icon · Small",
  args: { label: "Updated 2h ago", color: "grey", showIcon: false },
};

export const NoIconLarge: Story = {
  name: "No icon · Large",
  args: {
    label: "Sold out",
    color: "red",
    size: "large",
    shape: "rectangular",
    showIcon: false,
  },
};

export const CustomIcon: Story = {
  name: "Custom icon",
  args: {
    label: "Save 20%",
    color: "purple",
    size: "large",
    icon: "system-heart",
  },
};

export const AllColors: Story = {
  name: "All colors",
  parameters: { controls: { disable: true } },
  render: () => {
    const labelByColor: Record<InfoBannerColor, string> = {
      green: "Verified",
      grey: "Coming soon",
      blue: "New",
      orange: "Low stock",
      supermall: "Supermall",
      purple: "Member exclusive",
      red: "Out of stock",
    };
    return (
      <View
        style={{
          flexDirection: "row",
          gap: space["12"],
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {COLORS.map((c) => (
          <InfoBanner key={c} color={c} label={labelByColor[c]} />
        ))}
      </View>
    );
  },
};

export const AllSizesAndShapes: Story = {
  name: "All sizes × shapes",
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ gap: space["20"] }}>
      <View>
        <SectionLabel>Small</SectionLabel>
        <View
          style={{
            flexDirection: "row",
            gap: space["12"],
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {SHAPES.map((s) => (
            <Cell key={s} label={s}>
              <InfoBanner label="Verified" size="small" shape={s} />
            </Cell>
          ))}
        </View>
      </View>
      <View>
        <SectionLabel>Large</SectionLabel>
        <View
          style={{
            flexDirection: "row",
            gap: space["12"],
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {SHAPES.map((s) => (
            <Cell key={s} label={s}>
              <InfoBanner label="Verified" size="large" shape={s} />
            </Cell>
          ))}
        </View>
      </View>
    </View>
  ),
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={[
        textStyles.Body_B11_SemiBold,
        {
          color: colour["text-n-icon"].tertiary,
          textTransform: "uppercase",
          letterSpacing: 0.4,
          marginBottom: space["12"],
        },
      ]}
    >
      {children}
    </Text>
  );
}

function Cell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ alignItems: "center", gap: space["8"] }}>
      {children}
      <Text
        style={[
          textStyles.Body_B11_Medium,
          { color: colour["text-n-icon"].tertiary, textAlign: "center" },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}
