import { useState } from "react";
import { View } from "react-native";
import type { Meta, StoryObj } from "@storybook/react";

import { Icon } from "@field-ds/icons";
import { SearchBar, type SearchBarSize } from "@field-ds/components";
import { colour, space } from "@field-ds/tokens";

const SIZES: SearchBarSize[] = ["H48", "H44"];

const meta = {
  title: "Components/SearchBar",
  component: SearchBar,
  argTypes: {
    size: { control: "inline-radio", options: SIZES },
    elevation: { control: "boolean" },
    editable: { control: "boolean" },
    placeholder: { control: "text" },
  },
  args: {
    size: "H48",
    elevation: false,
    editable: true,
    placeholder: "Search for your building, area...",
  },
  parameters: {
    docs: {
      description: {
        component:
          "M-SearchBar — single-line search input. H48 (24px icons, B14) for home/category screens; H44 (20px icons, B12) for PDP back-headers. Up to two trailing icon slots with an auto-divider. Visual state (Placeholder / Active / Typing / Typed) is derived from focus + value.",
      },
    },
  },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const H44: Story = {
  name: "Compact (H44)",
  args: { size: "H44" },
};

export const Elevated: Story = {
  args: { elevation: true },
};

export const WithValue: Story = {
  name: "With value (auto-clear)",
  args: { defaultValue: "iPhone 17 pro max" },
};

export const Disabled: Story = {
  args: { editable: false, defaultValue: "iPhone 17 pro max" },
};

export const PdpBackHeader: Story = {
  name: "PDP back-header pattern",
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ width: 360 }}>
      <SearchBar
        size="H44"
        iconLeft={
          <Icon
            name="system-arrow-left"
            size={20}
            color={colour["text-n-icon"].primary}
          />
        }
        iconRight={
          <Icon
            name="system-camera"
            size={20}
            color={colour["text-n-icon"].primary}
          />
        }
        placeholder="iPhone 17 pro max"
      />
    </View>
  ),
};

export const TwoTrailingIcons: Story = {
  name: "Two trailing icons (auto-divider)",
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ width: 360 }}>
      <SearchBar
        elevation
        iconRight={
          <Icon
            name="system-camera"
            size={24}
            color={colour["text-n-icon"].primary}
          />
        }
        iconRightTwo={
          <Icon
            name="system-mic"
            size={24}
            color={colour["text-n-icon"].primary}
          />
        }
      />
    </View>
  ),
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ gap: space["16"], width: 360 }}>
      <SearchBar size="H48" />
      <SearchBar size="H44" />
    </View>
  ),
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ gap: space["16"], width: 360 }}>
      <SearchBar />
      <SearchBar autoFocus />
      <SearchBar defaultValue="iPhone 17 pro max" />
      <SearchBar editable={false} defaultValue="iPhone 17 pro max" />
    </View>
  ),
};

export const Controlled: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [value, setValue] = useState("");
    return (
      <View style={{ width: 360 }}>
        <SearchBar
          value={value}
          onChangeText={setValue}
          onSubmit={(v) => console.log("submit:", v)}
          onClear={() => console.log("clear")}
        />
      </View>
    );
  },
};
