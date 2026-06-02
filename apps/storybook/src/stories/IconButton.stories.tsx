import { Text, View } from "react-native";
import type { Meta, StoryObj } from "@storybook/react";

import {
  IconButton,
  type IconButtonEmphasis,
  type IconButtonSize,
} from "@field-ds/components";
import type { IconName } from "@field-ds/icons";
import { colour, space, textStyles } from "@field-ds/tokens";

const EMPHASES: IconButtonEmphasis[] = ["default", "ghost", "action"];
const SIZES: IconButtonSize[] = ["H40", "H36"];

// Wider curated set for IconButton — the icon IS the affordance, so we
// surface a few extra system glyphs that read well at 20px.
const ICON_PICKER_OPTIONS: IconName[] = [
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
  title: "Components/IconButton",
  component: IconButton,
  argTypes: {
    icon: { control: "select", options: ICON_PICKER_OPTIONS },
    emphasis: { control: "inline-radio", options: EMPHASES },
    size: { control: "inline-radio", options: SIZES },
    disabled: { control: "boolean" },
    accessibilityLabel: { control: "text" },
  },
  args: {
    icon: "system-arrow-right",
    emphasis: "default",
    size: "H40",
    disabled: false,
    accessibilityLabel: "Next",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Square circular icon-only button mapping to Figma's M-IconButton. Three emphasis levels (default / ghost / action) × two heights (H40 / H36) × default / pressed / disabled states. Always supply an `accessibilityLabel` — icon-only buttons are opaque to screen readers without one.",
      },
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Ghost: Story = {
  args: { emphasis: "ghost" },
};

export const Action: Story = {
  args: { emphasis: "action", icon: "system-plus", accessibilityLabel: "Add" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Matrix: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ gap: space["20"] }}>
      {SIZES.map((sz) => (
        <View key={sz} style={{ gap: space["12"] }}>
          <Caption>{sz}</Caption>
          <View style={{ flexDirection: "row", gap: space["20"] }}>
            {EMPHASES.map((em) => (
              <View
                key={em}
                style={{ alignItems: "center", gap: space["8"] }}
              >
                <View style={{ flexDirection: "row", gap: space["8"] }}>
                  <IconButton
                    icon="system-plus"
                    accessibilityLabel="Add"
                    size={sz}
                    emphasis={em}
                  />
                  <IconButton
                    icon="system-plus"
                    accessibilityLabel="Add"
                    size={sz}
                    emphasis={em}
                    disabled
                  />
                </View>
                <Caption>{em}</Caption>
              </View>
            ))}
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
        textStyles.B11_SemiBold,
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
