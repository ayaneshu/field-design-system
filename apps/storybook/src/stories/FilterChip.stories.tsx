import { useState } from "react";
import { Image, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import type { Meta, StoryObj } from "@storybook/react";

import { FilterChip, type FilterChipContent } from "@field-ds/components";
import type { IconName } from "@field-ds/icons";
import { colour, space, textStyles } from "@field-ds/tokens";

const CONTENTS: FilterChipContent[] = ["label", "slot"];

// Curated icon set for the controls panel — mirrors the Button picker so
// designers can drive both surfaces the same way.
const ICON_PICKER_OPTIONS: (IconName | undefined)[] = [
  undefined,
  "system-preferences",
  "system-sort",
  "system-caret-down",
  "system-cross",
  "system-search",
  "system-heart",
  "system-bag",
  "system-edit",
  "system-info-circle",
  "system-check-circle",
];

const meta = {
  title: "Components/FilterChip",
  component: FilterChip,
  argTypes: {
    content: { control: "inline-radio", options: CONTENTS },
    label: { control: "text" },
    count: { control: "text" },
    showIconLeft: { control: "boolean" },
    showIconRight: { control: "boolean" },
    iconLeft: { control: "select", options: ICON_PICKER_OPTIONS },
    iconRight: { control: "select", options: ICON_PICKER_OPTIONS },
    added: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    content: "label",
    label: "Filter",
    count: "(4)",
    showIconLeft: true,
    showIconRight: true,
    iconLeft: "system-preferences",
    iconRight: "system-caret-down",
    added: false,
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          "M-FilterChip — height-36 filter / sort chip. Two content modes (label, slot) × four states (default, pressed, disabled, added). Pressed visuals come from the Pressable's pressed flag — there is no Pressed prop. The slot variant accepts any node (image, SVG, brand mark, custom view) inside its 20×20 child slot.",
      },
    },
  },
} satisfies Meta<typeof FilterChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Filter" },
};

export const Sort: Story = {
  args: { label: "Sort", iconLeft: "system-sort" },
};

export const NoLeftIcon: Story = {
  name: "No left icon",
  args: { label: "Category", showIconLeft: false },
};

export const NoRightIcon: Story = {
  name: "No right icon (static badge)",
  args: { label: "Filter", showIconRight: false },
};

export const Disabled: Story = {
  args: { label: "Filter", disabled: true },
};

export const Added: Story = {
  name: "Added (filters applied)",
  args: { label: "Filter", count: "(4)", added: true },
};

export const AppliedFilterPill: Story = {
  name: "Applied filter pill",
  args: {
    label: "Delivered",
    showIconLeft: false,
    iconRight: "system-cross",
    showIconRight: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A single applied filter pill — uses the default state with `showIconLeft={false}` and `iconRight=\"system-cross\"`, not the `added` state.",
      },
    },
  },
};

export const SlotWithImage: Story = {
  name: "Slot · image",
  args: { content: "slot" },
  render: (args) => (
    <FilterChip {...args}>
      <Image
        source={{ uri: "https://placehold.co/40x40/0f7eff/ffffff?text=N" }}
        style={{ width: 20, height: 20, borderRadius: 4 }}
      />
    </FilterChip>
  ),
};

export const SlotWithSvg: Story = {
  name: "Slot · SVG",
  args: { content: "slot" },
  render: (args) => (
    <FilterChip {...args}>
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="9" fill={colour.surface["action-bold"]} />
        <Path
          d="M8 12.5l2.5 2.5L16 9.5"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </FilterChip>
  ),
};

export const SlotWithCustomNode: Story = {
  name: "Slot · custom node",
  args: { content: "slot" },
  render: (args) => (
    <FilterChip {...args}>
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 4,
          backgroundColor: colour.surface["yellow-bold"],
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={[
            textStyles.B11_SemiBold,
            { color: colour["text-n-icon"].primary, fontSize: 10 },
          ]}
        >
          ★
        </Text>
      </View>
    </FilterChip>
  ),
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ gap: space["20"] }}>
      <View>
        <SectionLabel>Label</SectionLabel>
        <View
          style={{
            flexDirection: "row",
            gap: space["12"],
            alignItems: "center",
          }}
        >
          <StateCell label="Default">
            <FilterChip label="Filter" />
          </StateCell>
          <StateCell label="Disabled">
            <FilterChip label="Filter" disabled />
          </StateCell>
          <StateCell label="Added">
            <FilterChip label="Filter" count="(4)" added />
          </StateCell>
          <StateCell label="No right icon">
            <FilterChip label="Filter" showIconRight={false} />
          </StateCell>
          <StateCell label="No left icon">
            <FilterChip label="Filter" showIconLeft={false} />
          </StateCell>
        </View>
      </View>

      <View>
        <SectionLabel>Slot</SectionLabel>
        <View
          style={{
            flexDirection: "row",
            gap: space["12"],
            alignItems: "center",
          }}
        >
          <StateCell label="Default">
            <FilterChip content="slot">
              <SlotDot />
            </FilterChip>
          </StateCell>
          <StateCell label="Disabled">
            <FilterChip content="slot" disabled>
              <SlotDot />
            </FilterChip>
          </StateCell>
          <StateCell label="Added">
            <FilterChip content="slot" added>
              <SlotDot />
            </FilterChip>
          </StateCell>
        </View>
      </View>
    </View>
  ),
};

export const Interactive: Story = {
  name: "Interactive · clear-all",
  parameters: { controls: { disable: true } },
  render: () => {
    const [count, setCount] = useState(4);
    return (
      <View style={{ gap: space["12"], alignItems: "flex-start" }}>
        <FilterChip
          label="Filter"
          count={`(${count})`}
          added={count > 0}
          onPress={() => setCount((c) => c + 1)}
          onClear={() => setCount(0)}
        />
        <Text
          style={[
            textStyles.B12_Medium,
            { color: colour["text-n-icon"].tertiary },
          ]}
        >
          Tap the chip to add a filter, the cross to clear all.
        </Text>
      </View>
    );
  },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
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
      {children}
    </Text>
  );
}

function StateCell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ alignItems: "center", gap: space["8"] }}>
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

function SlotDot() {
  return (
    <View
      style={{
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: colour.surface["action-bold"],
      }}
    />
  );
}
