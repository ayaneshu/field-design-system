import { useState } from "react";
import { Text, View } from "react-native";
import type { Meta, StoryObj } from "@storybook/react";

import { Switch, type SwitchSize } from "@field-ds/components";
import { colour, space, textStyles } from "@field-ds/tokens";

const SIZES: SwitchSize[] = ["H40", "H48"];

const ON_OFF = [
  { value: "off", label: "Off" },
  { value: "on", label: "On" },
];

const RANGE = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

const SIZES_OPTIONS = [
  { value: "xs", label: "XS" },
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L" },
];

const meta = {
  title: "Components/Switch",
  component: Switch,
  argTypes: {
    size: { control: "inline-radio", options: SIZES },
    disabled: { control: "boolean" },
  },
  args: {
    size: "H40",
    disabled: false,
    options: ON_OFF,
    defaultValue: "off",
  },
  parameters: {
    docs: {
      description: {
        component:
          "M-Switch — pill-shaped segmented control with 2–4 slots. Two sizes (H40 / H48). The active slot is marked by a white thumb that slides on selection with the same Apple-style ease-out used elsewhere in the system.",
      },
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <View style={{ width: 240 }}>
        <Story />
      </View>
    ),
  ],
};

export const H48: Story = {
  args: { size: "H48" },
  decorators: [
    (Story) => (
      <View style={{ width: 240 }}>
        <Story />
      </View>
    ),
  ],
};

export const ThreeSlots: Story = {
  name: "Three slots",
  args: { options: RANGE, defaultValue: "week" },
  decorators: [
    (Story) => (
      <View style={{ width: 320 }}>
        <Story />
      </View>
    ),
  ],
};

export const FourSlots: Story = {
  name: "Four slots",
  args: { options: SIZES_OPTIONS, defaultValue: "m" },
  decorators: [
    (Story) => (
      <View style={{ width: 320 }}>
        <Story />
      </View>
    ),
  ],
};

export const FourSlotsH48: Story = {
  name: "Four slots · H48",
  args: { size: "H48", options: SIZES_OPTIONS, defaultValue: "m" },
  decorators: [
    (Story) => (
      <View style={{ width: 360 }}>
        <Story />
      </View>
    ),
  ],
};

export const Disabled: Story = {
  args: { disabled: true },
  decorators: [
    (Story) => (
      <View style={{ width: 240 }}>
        <Story />
      </View>
    ),
  ],
};

export const Controlled: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [range, setRange] = useState("week");
    return (
      <View style={{ width: 320, gap: space["12"] }}>
        <Switch options={RANGE} value={range} onChange={setRange} />
        <Text
          style={[
            textStyles.B12_Medium,
            { color: colour["text-n-icon"].tertiary, textAlign: "center" },
          ]}
        >
          Selected: {range}
        </Text>
      </View>
    );
  },
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ gap: space["24"], width: 360 }}>
      {SIZES.map((s) => (
        <View key={s} style={{ gap: space["12"] }}>
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
            {s}
          </Text>
          <Switch size={s} options={ON_OFF} defaultValue="off" />
          <Switch size={s} options={RANGE} defaultValue="week" />
          <Switch size={s} options={SIZES_OPTIONS} defaultValue="m" />
        </View>
      ))}
    </View>
  ),
};
