import { Text, View } from "react-native";
import type { Meta, StoryObj } from "@storybook/react";

import { RoundButton, type RoundButtonSize } from "@field-ds/components";
import type { IconName } from "@field-ds/icons";
import { colour, space, textStyles } from "@field-ds/tokens";

const SIZES: RoundButtonSize[] = ["H40", "H36"];

// Same curated set as the Button + IconButton stories so designers can
// swap glyphs in the controls panel without leaving the doc page.
const ICON_PICKER_OPTIONS: (IconName | undefined)[] = [
  undefined,
  "system-plus",
  "system-arrow-right",
  "system-arrow-left",
  "system-arrow-up",
  "system-arrow-down",
  "system-chevron-right",
  "system-chevron-left",
  "system-search",
  "system-edit",
  "system-bag",
  "system-heart",
  "system-bin",
  "system-info-circle",
  "system-check-circle",
  "system-message",
];

const meta = {
  title: "Components/RoundButton",
  component: RoundButton,
  argTypes: {
    size: { control: "inline-radio", options: SIZES },
    label: { control: "text" },
    iconLeft: { control: "select", options: ICON_PICKER_OPTIONS },
    iconRight: { control: "select", options: ICON_PICKER_OPTIONS },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    fullWidth: { control: "boolean" },
  },
  args: {
    size: "H40",
    label: "Filter",
    iconLeft: "system-plus",
    iconRight: undefined,
    loading: false,
    disabled: false,
    fullWidth: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Pill-shaped neutral CTA mapping to Figma's M-NeutralRoundButton. Two heights (H40 / H36); same colour semantics as `Button variant=\"secondary-neutral\"` with a fully rounded border. Use for compact toolbar / map-chip / sticky header actions.",
      },
    },
  },
} satisfies Meta<typeof RoundButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: { loading: true, label: "Saving" },
};

export const Disabled: Story = {
  args: { disabled: true, label: "Unavailable" },
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ gap: space["20"] }}>
      {SIZES.map((s) => (
        <View key={s} style={{ gap: space["8"] }}>
          <Caption>{s}</Caption>
          <View
            style={{
              flexDirection: "row",
              gap: space["12"],
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <RoundButton label="Filter" size={s} />
            <RoundButton label="Filter" size={s} iconLeft="system-plus" />
            <RoundButton label="Filter" size={s} loading />
            <RoundButton label="Filter" size={s} disabled />
          </View>
        </View>
      ))}
    </View>
  ),
};

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={[
        textStyles.Body_B11_SemiBold,
        {
          color: colour["text-n-icon"].tertiary,
          textTransform: "uppercase",
          letterSpacing: 0.4,
        },
      ]}
    >
      {children}
    </Text>
  );
}
