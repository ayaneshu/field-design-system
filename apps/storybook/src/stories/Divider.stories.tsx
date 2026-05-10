import { Text, View } from "react-native";
import type { Meta, StoryObj } from "@storybook/react";

import { Divider, type DividerEmphasis, type DividerStyle } from "@field-ds/components";
import { colour, space, textStyles } from "@field-ds/tokens";

const VARIANTS: DividerStyle[] = ["solid", "dashed"];
const EMPHASES: DividerEmphasis[] = ["low", "high"];

const meta = {
  title: "Components/Divider",
  component: Divider,
  argTypes: {
    variant: { control: "inline-radio", options: VARIANTS },
    emphasis: { control: "inline-radio", options: EMPHASES },
    width: { control: "text" },
    paddingLeft: { control: { type: "number", min: 0, max: 64, step: 4 } },
    paddingRight: { control: { type: "number", min: 0, max: 64, step: 4 } },
  },
  args: {
    variant: "solid",
    emphasis: "low",
    width: "100%",
    paddingLeft: 0,
    paddingRight: 0,
  },
  parameters: {
    docs: {
      description: {
        component:
          "M-Divider — horizontal rule used to separate content into distinct sections. Two styles (solid / dashed) × two emphasis levels (low / high). Pass `width` to constrain the span and `paddingLeft` / `paddingRight` to inset the hairline within that span.",
      },
    },
  },
  decorators: [
    (Story) => (
      <View style={{ width: 360, padding: space["16"] }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SolidHigh: Story = {
  name: "Solid · high emphasis",
  args: { variant: "solid", emphasis: "high" },
};

export const Dashed: Story = {
  args: { variant: "dashed", emphasis: "low" },
};

export const DashedHigh: Story = {
  name: "Dashed · high emphasis",
  args: { variant: "dashed", emphasis: "high" },
};

export const AllVariants: Story = {
  name: "All variants",
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ gap: space["20"] }}>
      {VARIANTS.flatMap((v) =>
        EMPHASES.map((e) => (
          <View key={`${v}-${e}`} style={{ gap: space["8"] }}>
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
              {v} · {e}
            </Text>
            <Divider variant={v} emphasis={e} />
          </View>
        )),
      )}
    </View>
  ),
};

export const WithPadding: Story = {
  name: "With left + right padding",
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ gap: space["20"] }}>
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
        paddingLeft: 16, paddingRight: 16
      </Text>
      <Divider paddingLeft={16} paddingRight={16} />
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
        paddingLeft: 56 (aligned past leading icon)
      </Text>
      <Divider paddingLeft={56} />
    </View>
  ),
};

export const FixedWidth: Story = {
  name: "Fixed width",
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ gap: space["20"], alignItems: "center" }}>
      <Divider width={120} />
      <Divider width={200} variant="dashed" />
      <Divider width={280} emphasis="high" />
    </View>
  ),
};

export const InListRow: Story = {
  name: "In a list row",
  parameters: { controls: { disable: true } },
  render: () => {
    const items = ["Same-day delivery", "Express delivery", "Standard delivery"];
    return (
      <View>
        {items.map((label, i) => (
          <View key={label}>
            <View style={{ paddingVertical: space["12"] }}>
              <Text
                style={[
                  textStyles.Body_B14_Medium,
                  { color: colour["text-n-icon"].primary },
                ]}
              >
                {label}
              </Text>
            </View>
            {i < items.length - 1 && <Divider />}
          </View>
        ))}
      </View>
    );
  },
};
