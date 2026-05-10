import { useState } from "react";
import { Text, View } from "react-native";
import type { Meta, StoryObj } from "@storybook/react";

import { Accordion, type AccordionProps } from "@field-ds/components";
import { Icon } from "@field-ds/icons";
import { colour, space, textStyles } from "@field-ds/tokens";

// Storybook-only arg: toggle the `iconLeft` slot from a boolean control. Maps
// to a real Icon node before forwarding to the component, mirroring the
// `showIconLeft` boolean property on the Figma M-Accordion.
type StoryArgs = Omit<AccordionProps, "iconLeft"> & { showIconLeft?: boolean };

const InfoIcon = (
  <Icon
    name="system-info-circle"
    size={20}
    color={colour["text-n-icon"].primary}
  />
);

const renderAccordion = ({ showIconLeft, ...args }: StoryArgs) => (
  <Accordion {...args} iconLeft={showIconLeft ? InfoIcon : undefined} />
);

const meta = {
  title: "Components/Accordion",
  component: Accordion,
  render: renderAccordion,
  argTypes: {
    title: { control: "text" },
    defaultExpanded: { control: "boolean" },
    expanded: { control: "boolean" },
    showIconLeft: {
      control: "boolean",
      description:
        "Storybook-only — toggles the `iconLeft` slot on/off using a default info icon.",
      table: { category: "Slots" },
    },
    iconLeft: { table: { disable: true } },
  },
  args: {
    title: "Delivery",
    children:
      "Same-day delivery is available across the UAE for orders placed before 4pm. International orders ship within 3–5 business days.",
    defaultExpanded: false,
    showIconLeft: false,
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
} satisfies Meta<StoryArgs>;

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
    showIconLeft: true,
    children: "Dimensions, materials, and certifications appear here.",
  },
};

export const RichBody: Story = {
  name: "Rich body",
  args: {
    title: "What's included",
    children: (
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
      <Accordion title="How long does delivery take?">
        Same-day across UAE for orders before 4pm; otherwise 1–2 business days.
      </Accordion>
      <Accordion title="Can I return an item?">
        Returns are accepted within 14 days of delivery, in original packaging.
      </Accordion>
      <Accordion title="Do you ship internationally?">
        Yes — to 28 countries. Customs and duties are calculated at checkout.
      </Accordion>
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
        expanded={open}
        onExpandedChange={setOpen}
      >
        This accordion's open state is owned by the parent. Toggle from anywhere.
      </Accordion>
    );
  },
};
