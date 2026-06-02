import { useState } from "react";
import { Text, View } from "react-native";
import type { Meta, StoryObj } from "@storybook/react";

import { PrimaryButton, type PrimaryButtonSize } from "@field-ds/components";
import type { IconName } from "@field-ds/icons";
import { colour, space, textStyles } from "@field-ds/tokens";

const SIZES: PrimaryButtonSize[] = ["H56", "H52", "H48", "H40", "H36"];

// Curated icon set surfaced via the Storybook controls panel. Includes
// `undefined` so the iconLeft/iconRight slots can be cleared from the UI.
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
  title: "Components/PrimaryButton",
  component: PrimaryButton,
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
    label: "Continue",
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
          "M-PrimaryButton — high-emphasis filled blue CTA. Use for the single most important action on a screen (Save, Continue, Checkout). Only one PrimaryButton per context.",
      },
    },
  },
} satisfies Meta<typeof PrimaryButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: { loading: true, label: "Saving" },
};

export const Disabled: Story = {
  args: { disabled: true, label: "Unavailable" },
};

export const WithIcons: Story = {
  name: "With icons",
  args: {
    label: "Continue",
    iconLeft: "system-plus",
    iconRight: "system-arrow-right",
  },
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ gap: space["20"] }}>
      {SIZES.map((s) => (
        <Row key={s} title={s}>
          <PrimaryButton label="Continue" size={s} />
          <PrimaryButton label="Continue" size={s} iconLeft="system-plus" />
          <PrimaryButton label="Continue" size={s} loading />
          <PrimaryButton label="Continue" size={s} disabled />
        </Row>
      ))}
    </View>
  ),
};

export const Controlled: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [busy, setBusy] = useState(false);
    return (
      <View style={{ gap: space["12"] }}>
        <PrimaryButton
          label={busy ? "Saving" : "Save"}
          loading={busy}
          onPress={() => {
            setBusy(true);
            setTimeout(() => setBusy(false), 1500);
          }}
        />
        <Caption>Tap to trigger a 1.5s loading state.</Caption>
      </View>
    );
  },
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
