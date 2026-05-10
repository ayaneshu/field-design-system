import { Text, View } from "react-native";
import type { Meta, StoryObj } from "@storybook/react";

import { NeutralButton, type NeutralButtonSize } from "@field-ds/components";
import type { IconName } from "@field-ds/icons";
import { colour, space, textStyles } from "@field-ds/tokens";

// NeutralButton is the only rectangular family with H32 per Figma.
const SIZES: NeutralButtonSize[] = ["H56", "H52", "H48", "H40", "H36", "H32"];

const ICON_PICKER_OPTIONS: (IconName | undefined)[] = [
  undefined,
  "system-plus",
  "system-arrow-right",
  "system-arrow-left",
  "system-search",
  "system-edit",
];

const meta = {
  title: "Components/NeutralButton",
  component: NeutralButton,
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
    label: "Schedule",
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
          "M-NeutralButton — filled near-black CTA. Visually quieter than PrimaryButton — use when multiple actions coexist on light surfaces (Schedule, Select location, Login/Sign up) or when the page already has a primary CTA elsewhere. Six heights including the toolbar-only H32.",
      },
    },
  },
} satisfies Meta<typeof NeutralButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Loading: Story = { args: { loading: true, label: "Saving" } };
export const Disabled: Story = {
  args: { disabled: true, label: "Unavailable" },
};
export const WithIcons: Story = {
  name: "With icons",
  args: { label: "Schedule", iconLeft: "system-plus" },
};
export const Compact: Story = {
  args: { size: "H32", label: "Compact" },
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ gap: space["20"] }}>
      {SIZES.map((s) => (
        <Row key={s} title={s}>
          <NeutralButton label="Schedule" size={s} />
          <NeutralButton label="Schedule" size={s} iconLeft="system-plus" />
          <NeutralButton label="Schedule" size={s} loading />
          <NeutralButton label="Schedule" size={s} disabled />
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
