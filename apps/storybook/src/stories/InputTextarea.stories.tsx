import { useState } from "react";
import { View } from "react-native";
import type { Meta, StoryObj } from "@storybook/react";

import { InputTextarea } from "@field-ds/components";
import { space } from "@field-ds/tokens";

const meta = {
  title: "Components/InputTextarea",
  component: InputTextarea,
  argTypes: {
    required: { control: "boolean" },
    showHelperText: { control: "boolean" },
    showCounter: { control: "boolean" },
    disabled: { control: "boolean" },
    error: { control: "boolean" },
  },
  args: {
    label: "Label",
    placeholder: "Placeholder",
    helperText: "Helper text goes here",
    required: false,
    showHelperText: false,
    showCounter: true,
    disabled: false,
    error: false,
    maxLength: 200,
  },
  parameters: {
    docs: {
      description: {
        component:
          "M-InputTextarea — multi-line text input for long-form copy (reviews, notes, addresses, messages). Six derived states; counter and helper supported.",
      },
    },
  },
} satisfies Meta<typeof InputTextarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = {
  args: { required: true },
};

export const WithHelper: Story = {
  args: { showHelperText: true },
};

export const Error: Story = {
  args: {
    error: "Please share at least 20 characters.",
    showHelperText: true,
    defaultValue: "Too short.",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "Submitted on 02 May 2026.",
  },
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ gap: space["16"], width: 360 }}>
      <InputTextarea label="Resting" placeholder="Placeholder" />
      <InputTextarea
        label="Filled"
        defaultValue="Loved the packaging — arrived in pristine condition. Charging speed feels noticeably faster than the previous model."
        showCounter
        maxLength={200}
      />
      <InputTextarea
        label="Error"
        defaultValue="Too short."
        error="Please share at least 20 characters."
        showHelperText
        showCounter
        maxLength={200}
      />
      <InputTextarea
        label="Disabled"
        defaultValue="Submitted on 02 May 2026."
        disabled
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
        <InputTextarea
          label="Review"
          placeholder="Tell us how it went…"
          value={value}
          onChangeText={setValue}
          showCounter
          maxLength={200}
          showHelperText
          helperText="Stay friendly and specific."
        />
      </View>
    );
  },
};
