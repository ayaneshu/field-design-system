import { useState } from "react";
import { Text, View } from "react-native";
import type { Meta, StoryObj } from "@storybook/react";

import { Toggle, type ToggleSize } from "@field-ds/components";
import { colour, space, textStyles } from "@field-ds/tokens";

const SIZES: ToggleSize[] = ["H16", "H20", "H24"];

const meta = {
  title: "Components/Toggle",
  component: Toggle,
  argTypes: {
    size: { control: "inline-radio", options: SIZES },
    disabled: { control: "boolean" },
    defaultOn: { control: "boolean" },
  },
  args: {
    size: "H20",
    disabled: false,
    defaultOn: false,
    accessibilityLabel: "Toggle",
  },
  parameters: {
    docs: {
      description: {
        component:
          "M-Toggle — binary on/off control. Three sizes (H16 / H20 / H24). Thumb slides 220 ms with the system Apple ease; track crossfades; reduced-motion snaps. Pair with a visible label.",
      },
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const On: Story = {
  args: { defaultOn: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledOn: Story = {
  name: "Disabled · On",
  args: { disabled: true, defaultOn: true },
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ gap: space["24"] }}>
      {SIZES.map((s) => (
        <View key={s} style={{ gap: space["12"] }}>
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
            {s}
          </Text>
          <View style={{ flexDirection: "row", gap: space["16"] }}>
            <Toggle size={s} defaultOn={false} accessibilityLabel={`${s} off`} />
            <Toggle size={s} defaultOn accessibilityLabel={`${s} on`} />
            <Toggle
              size={s}
              defaultOn={false}
              disabled
              accessibilityLabel={`${s} off disabled`}
            />
            <Toggle
              size={s}
              defaultOn
              disabled
              accessibilityLabel={`${s} on disabled`}
            />
          </View>
        </View>
      ))}
    </View>
  ),
};

export const Controlled: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [on, setOn] = useState(false);
    return (
      <View style={{ gap: space["12"], alignItems: "flex-start" }}>
        <Toggle on={on} onChange={setOn} accessibilityLabel="Notifications" />
        <Text
          style={[
            textStyles.Body_B12_Medium,
            { color: colour["text-n-icon"].tertiary },
          ]}
        >
          Notifications: {on ? "On" : "Off"}
        </Text>
      </View>
    );
  },
};
