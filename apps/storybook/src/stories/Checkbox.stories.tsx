import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import type { Meta, StoryObj } from "@storybook/react";

import { Checkbox, type CheckboxSize } from "@field-ds/components";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

const SIZES: CheckboxSize[] = ["H24", "H20", "H16"];

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
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
          "M-Checkbox — selection control for toggling items on or off. Three sizes (H24 / H20 / H16). Selection animates with the same Apple-style ease-out used elsewhere in the system.",
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

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
              textStyles.Body_B11_SemiBold,
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
              <Checkbox size={s} />
            </StateCell>
            <StateCell label="Selected">
              <Checkbox size={s} defaultSelected />
            </StateCell>
            <StateCell label="Disabled">
              <Checkbox size={s} disabled />
            </StateCell>
            <StateCell label="Disabled · selected">
              <Checkbox size={s} disabled defaultSelected />
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
      <View style={{ flexDirection: "row", alignItems: "center", gap: space["12"] }}>
        <Checkbox selected={agreed} onChange={setAgreed} />
        <Text
          style={[
            textStyles.Body_B14_Medium,
            { color: colour["text-n-icon"].primary },
          ]}
        >
          I agree to the terms
        </Text>
      </View>
    );
  },
};

export const MultiSelectList: Story = {
  name: "Multi-select list",
  parameters: { controls: { disable: true } },
  render: () => {
    const [picks, setPicks] = useState<Record<string, boolean>>({
      fast: true,
      organic: false,
      veg: true,
    });
    const toggle = (key: string) =>
      setPicks((prev) => ({ ...prev, [key]: !prev[key] }));

    const opts = [
      { key: "fast", label: "Fast delivery" },
      { key: "organic", label: "Organic only" },
      { key: "veg", label: "Vegetarian" },
    ];

    return (
      <View style={{ minWidth: 280 }}>
        {opts.map((opt, i, arr) => (
          <Pressable
            key={opt.key}
            onPress={() => toggle(opt.key)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: space["12"],
              paddingVertical: space["12"],
              borderBottomWidth: i === arr.length - 1 ? 0 : 1,
              borderBottomColor: colour.border.subtle,
            }}
          >
            <Checkbox
              size="H20"
              selected={!!picks[opt.key]}
              onChange={() => toggle(opt.key)}
            />
            <Text
              style={[
                textStyles.Body_B14_Medium,
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
          textStyles.Body_B11_Medium,
          { color: colour["text-n-icon"].tertiary, textAlign: "center" },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}
