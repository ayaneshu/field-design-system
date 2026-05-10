import { useState } from "react";
import { View } from "react-native";
import type { Meta, StoryObj } from "@storybook/react";

import { Icon } from "@field-ds/icons";
import { InputText, type InputTextLabelMode } from "@field-ds/components";
import { colour, space } from "@field-ds/tokens";

const LABEL_MODES: InputTextLabelMode[] = ["external", "inline", "none"];

const meta = {
  title: "Components/InputText",
  component: InputText,
  argTypes: {
    labelMode: { control: "inline-radio", options: LABEL_MODES },
    required: { control: "boolean" },
    showHelperText: { control: "boolean" },
    showCounter: { control: "boolean" },
    disabled: { control: "boolean" },
    error: { control: "boolean" },
  },
  args: {
    label: "Label",
    labelMode: "external",
    placeholder: "Placeholder",
    helperText: "Helper text goes here",
    required: false,
    showHelperText: false,
    showCounter: false,
    disabled: false,
    error: false,
    maxLength: 20,
  },
  parameters: {
    docs: {
      description: {
        component:
          "M-InputText — single-line text input. Three label modes (external / inline / none) × six derived states (Resting / Active / Typing / Filled / Error / Disabled). State is derived from focus + value + the `error` / `disabled` props.",
      },
    },
  },
} satisfies Meta<typeof InputText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = {
  args: { required: true },
};

export const WithHelper: Story = {
  args: { showHelperText: true },
};

export const WithCounter: Story = {
  args: { showCounter: true, showHelperText: true },
};

export const Error: Story = {
  args: { error: "That model isn't available.", showHelperText: true },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "iPhone 17 pro max" },
};

export const Inline: Story = {
  args: { labelMode: "inline" },
};

export const NoLabel: Story = {
  name: "No label",
  args: { labelMode: "none" },
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ gap: space["16"], width: 360 }}>
      <InputText label="Resting" placeholder="Placeholder" />
      <InputText label="Filled" defaultValue="iPhone 17 pro max" />
      <InputText
        label="Error"
        defaultValue="iPhone 17 pro max"
        error
        showHelperText
        helperText="That model isn't available."
      />
      <InputText label="Disabled" defaultValue="iPhone 17 pro max" disabled />
    </View>
  ),
};

export const LabelModes: Story = {
  name: "Label modes",
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ gap: space["20"], width: 360 }}>
      <InputText label="Email" labelMode="external" placeholder="you@noon.com" />
      <InputText label="Phone" labelMode="inline" />
      <InputText labelMode="none" placeholder="Search products" />
    </View>
  ),
};

export const WithSlots: Story = {
  name: "With slots",
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ gap: space["16"], width: 360 }}>
      <InputText
        label="Search"
        labelMode="none"
        placeholder="Search products"
        leftSlot={
          <Icon
            name="system-search"
            size={20}
            color={colour["text-n-icon"].tertiary}
          />
        }
      />
      <InputText
        label="Promo code"
        rightSlot={
          <Icon
            name="system-info-circle"
            size={20}
            color={colour["text-n-icon"].tertiary}
          />
        }
      />
    </View>
  ),
};

export const Controlled: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [value, setValue] = useState("");
    return (
      <View style={{ width: 360 }}>
        <InputText
          label="Name"
          placeholder="Your full name"
          value={value}
          onChangeText={setValue}
          showHelperText
          helperText={value ? `${value.length} characters` : "Required"}
        />
      </View>
    );
  },
};
