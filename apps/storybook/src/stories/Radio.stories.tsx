import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import type { Meta, StoryObj } from "@storybook/react";

import { Radio, type RadioSize } from "@field-ds/components";
import { colour, space, textStyles } from "@field-ds/tokens";

const SIZES: RadioSize[] = ["H24", "H20", "H16"];

const meta = {
  title: "Components/Radio",
  component: Radio,
  argTypes: {
    size: { control: "inline-radio", options: SIZES },
    disabled: { control: "boolean" },
    selected: { control: "boolean" },
    defaultSelected: { control: "boolean" },
  },
  args: {
    size: "H24",
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          "M-Radio — single-select control for mutually exclusive choices. Three sizes (H24 / H20 / H16). Always render in a group of two or more. Tapping an already-selected radio is a no-op — deselection happens implicitly when another radio in the group is selected.",
      },
    },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultSelected: false },
};

export const Selected: Story = {
  args: { defaultSelected: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledSelected: Story = {
  name: "Disabled · selected",
  args: { disabled: true, defaultSelected: true },
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ gap: space["20"] }}>
      {SIZES.map((s) => (
        <View key={s}>
          <Text
            style={[
              textStyles.B11_SemiBold,
              {
                color: colour["text-n-icon"].tertiary,
                textTransform: "uppercase",
                letterSpacing: 0.4,
                marginBottom: space["12"],
              },
            ]}
          >
            {s}
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: space["20"],
              alignItems: "center",
            }}
          >
            <StateCell label="Default">
              <Radio size={s} />
            </StateCell>
            <StateCell label="Selected">
              <Radio size={s} defaultSelected />
            </StateCell>
            <StateCell label="Disabled">
              <Radio size={s} disabled />
            </StateCell>
            <StateCell label="Disabled · selected">
              <Radio size={s} disabled defaultSelected />
            </StateCell>
          </View>
        </View>
      ))}
    </View>
  ),
};

export const Controlled: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [agreed, setAgreed] = useState(false);
    return (
      <View
        style={{ flexDirection: "row", alignItems: "center", gap: space["12"] }}
      >
        <Radio selected={agreed} onChange={() => setAgreed(true)} />
        <Pressable onPress={() => setAgreed((v) => !v)}>
          <Text
            style={[
              textStyles.B14_Medium,
              { color: colour["text-n-icon"].primary },
            ]}
          >
            I'll handle this myself
          </Text>
        </Pressable>
      </View>
    );
  },
};

export const SingleSelectGroup: Story = {
  name: "Single-select group",
  parameters: { controls: { disable: true } },
  render: () => {
    const [pick, setPick] = useState<"fast" | "standard" | "economy">(
      "standard",
    );

    const opts = [
      { key: "fast", label: "Fast — 2 hours" },
      { key: "standard", label: "Standard — same day" },
      { key: "economy", label: "Economy — 2 days" },
    ] as const;

    return (
      <View style={{ minWidth: 280 }}>
        {opts.map((opt, i, arr) => (
          <Pressable
            key={opt.key}
            onPress={() => setPick(opt.key)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: space["12"],
              paddingVertical: space["12"],
              borderBottomWidth: i === arr.length - 1 ? 0 : 1,
              borderBottomColor: colour.border.subtle,
            }}
          >
            <Radio
              size="H20"
              selected={pick === opt.key}
              onChange={() => setPick(opt.key)}
            />
            <Text
              style={[
                textStyles.B14_Medium,
                { color: colour["text-n-icon"].primary },
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>
    );
  },
};

function StateCell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ alignItems: "center", gap: space["8"], minWidth: 96 }}>
      {children}
      <Text
        style={[
          textStyles.B11_Medium,
          { color: colour["text-n-icon"].tertiary, textAlign: "center" },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}
