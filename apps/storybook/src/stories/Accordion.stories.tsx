import { useState } from "react";
import { Text, View } from "react-native";
import type { Meta, StoryObj } from "@storybook/react";

import { Accordion } from "@field-ds/components";
import { Icon } from "@field-ds/icons";
import { colour, space, textStyles } from "@field-ds/tokens";

const meta = {
  title: "Components/Accordion",
  component: Accordion,
  argTypes: {
    title: { control: "text" },
    defaultExpanded: { control: "boolean" },
    expanded: { control: "boolean" },
  },
  args: {
    title: "Delivery",
    body: "Same-day delivery is available across the UAE for orders placed before 4pm. International orders ship within 3–5 business days.",
    defaultExpanded: false,
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "M-Accordion — disclosure control that reveals supplementary content on tap. Apple-style ease-out (320ms open / 260ms close); body renders at intrinsic size and is revealed by uncovering, never by stretching.",
      },
    },
  },
  decorators: [
    (Story) => (
      <View style={{ width: 360 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultExpanded: Story = {
  name: "Default expanded",
  args: { defaultExpanded: true },
};

export const WithIconLeft: Story = {
  name: "With icon",
  args: {
    title: "Specifications",
    iconLeft: (
      <Icon
        name="system-info"
        size={20}
        color={colour["text-n-icon"].primary}
      />
    ),
    body: "Dimensions, materials, and certifications appear here.",
  },
};

export const RichBody: Story = {
  name: "Rich body",
  args: {
    title: "What's included",
    body: (
      <View style={{ gap: space["8"] }}>
        {[
          "1× device unit",
          "2× swappable battery packs",
          "USB-C charging cable",
          "Quick-start guide",
        ].map((line) => (
          <Text
            key={line}
            style={[
              textStyles.Body_B14_Regular,
              { color: colour["text-n-icon"].primary },
            ]}
          >
            • {line}
          </Text>
        ))}
      </View>
    ),
  },
};

export const Stack: Story = {
  name: "Stack (FAQ)",
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ gap: space["12"] }}>
      <Accordion
        title="How long does delivery take?"
        body="Same-day across UAE for orders before 4pm; otherwise 1–2 business days."
      />
      <Accordion
        title="Can I return an item?"
        body="Returns are accepted within 14 days of delivery, in original packaging."
      />
      <Accordion
        title="Do you ship internationally?"
        body="Yes — to 28 countries. Customs and duties are calculated at checkout."
      />
    </View>
  ),
};

export const Controlled: Story = {
  name: "Controlled",
  parameters: { controls: { disable: true } },
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <Accordion
        title={`Open: ${open ? "true" : "false"}`}
        body="This accordion's open state is owned by the parent. Toggle from anywhere."
        expanded={open}
        onExpandedChange={setOpen}
      />
    );
  },
};
