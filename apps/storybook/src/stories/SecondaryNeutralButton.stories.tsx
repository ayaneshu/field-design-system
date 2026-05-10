import { Text, View } from "react-native";
import type { Meta, StoryObj } from "@storybook/react";

import {
  SecondaryNeutralButton,
  type SecondaryNeutralButtonSize,
} from "@field-ds/components";
import type { IconName } from "@field-ds/icons";
import { colour, space, textStyles } from "@field-ds/tokens";

const SIZES: SecondaryNeutralButtonSize[] = [
  "H56",
  "H52",
  "H48",
  "H40",
  "H36",
];

const ICON_PICKER_OPTIONS: (IconName | undefined)[] = [
  undefined,
  "system-plus",
  "system-arrow-right",
  "system-arrow-left",
  "system-edit",
];

const meta = {
  title: "Components/SecondaryNeutralButton",
  component: SecondaryNeutralButton,
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
    size: "H56",
    label: "Skip",
    iconLeft: undefined,
    iconRight: undefined,
    loading: false,
    disabled: false,
    fullWidth: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          "M-SecondaryNeutralButton — outline neutral CTA. White surface with a subtle neutral border; label/icon shift to text-n-icon/secondary on press. Quiet adjacent action where blue would compete.",
      },
    },
  },
} satisfies Meta<typeof SecondaryNeutralButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Loading: Story = { args: { loading: true, label: "Saving" } };
export const Disabled: Story = {
  args: { disabled: true, label: "Unavailable" },
};
export const WithIcons: Story = {
  name: "With icons",
  args: { label: "Manage", iconLeft: "system-edit" },
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ gap: space["20"] }}>
      {SIZES.map((s) => (
        <Row key={s} title={s}>
          <SecondaryNeutralButton label="Skip" size={s} />
          <SecondaryNeutralButton label="Skip" size={s} iconLeft="system-plus" />
          <SecondaryNeutralButton label="Skip" size={s} loading />
          <SecondaryNeutralButton label="Skip" size={s} disabled />
        </Row>
      ))}
    </View>
  ),
};

function Row({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ gap: space["8"] }}>
      <Caption>{title}</Caption>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: space["12"],
          alignItems: "center",
        }}
      >
        {children}
      </View>
    </View>
  );
}

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
