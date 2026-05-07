import { Text, View } from "react-native";
import type { Meta, StoryObj } from "@storybook/react";

import {
  TextButton,
  type TextButtonSize,
  type TextButtonTone,
} from "@field-ds/components";
import type { IconName } from "@field-ds/icons";
import { colour, space, textStyles } from "@field-ds/tokens";

const TONES: TextButtonTone[] = ["blue", "neutral"];
const SIZES: TextButtonSize[] = ["A14", "A12"];

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
  title: "Components/TextButton",
  component: TextButton,
  argTypes: {
    tone: { control: "inline-radio", options: TONES },
    size: { control: "inline-radio", options: SIZES },
    label: { control: "text" },
    iconLeft: { control: "select", options: ICON_PICKER_OPTIONS },
    iconRight: { control: "select", options: ICON_PICKER_OPTIONS },
    disabled: { control: "boolean" },
  },
  args: {
    tone: "blue",
    size: "A14",
    label: "View all",
    iconLeft: undefined,
    iconRight: "system-arrow-right",
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Low-emphasis CTA mapping to Figma's M-TextButtonBlue and M-TextButtonNeutral. Transparent surface with optional icons, picking up a subtle tint on press. Use for inline supportive actions ('View all', row-level 'Edit', toolbar links).",
      },
    },
  },
} satisfies Meta<typeof TextButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Neutral: Story = {
  args: { tone: "neutral" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ gap: space["20"] }}>
      {TONES.map((tone) => (
        <View key={tone} style={{ gap: space["12"] }}>
          {SIZES.map((sz) => (
            <View key={sz} style={{ gap: space["8"] }}>
              <Caption>{`${tone} · ${sz}`}</Caption>
              <View
                style={{
                  flexDirection: "row",
                  gap: space["12"],
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <TextButton label="View all" tone={tone} size={sz} />
                <TextButton
                  label="View all"
                  tone={tone}
                  size={sz}
                  iconRight="system-arrow-right"
                />
                <TextButton label="View all" tone={tone} size={sz} disabled />
              </View>
            </View>
          ))}
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
