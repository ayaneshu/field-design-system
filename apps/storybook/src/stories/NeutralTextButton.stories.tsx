import { Text, View } from "react-native";
import type { Meta, StoryObj } from "@storybook/react";

import {
  NeutralTextButton,
  type NeutralTextButtonSize,
} from "@field-ds/components";
import type { IconName } from "@field-ds/icons";
import { colour, space, textStyles } from "@field-ds/tokens";

const SIZES: NeutralTextButtonSize[] = ["A14", "A12"];

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
  title: "Components/NeutralTextButton",
  component: NeutralTextButton,
  argTypes: {
    size: { control: "inline-radio", options: SIZES },
    label: { control: "text" },
    iconLeft: { control: "select", options: ICON_PICKER_OPTIONS },
    iconRight: { control: "select", options: ICON_PICKER_OPTIONS },
    disabled: { control: "boolean" },
  },
  args: {
    size: "A14",
    label: "Dismiss",
    iconLeft: undefined,
    iconRight: undefined,
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Low-emphasis neutral-tone CTA mapping to Figma's M-TextButtonNeutral. Transparent surface with a near-black label and optional icons, picking up a subtle neutral tint on press. Use on coloured / inverted surfaces or when blue would compete. For the default blue text link, see TextButton.",
      },
    },
  },
} satisfies Meta<typeof NeutralTextButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ gap: space["20"] }}>
      {SIZES.map((sz) => (
        <View key={sz} style={{ gap: space["8"] }}>
          <Caption>{sz}</Caption>
          <View
            style={{
              flexDirection: "row",
              gap: space["12"],
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <NeutralTextButton label="Dismiss" size={sz} />
            <NeutralTextButton
              label="Edit"
              size={sz}
              iconLeft="system-edit"
            />
            <NeutralTextButton label="Dismiss" size={sz} disabled />
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
