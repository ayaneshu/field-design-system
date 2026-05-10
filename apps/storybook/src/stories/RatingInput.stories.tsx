import { useState } from "react";
import { Text, View } from "react-native";
import type { Meta, StoryObj } from "@storybook/react";

import { RatingInput, type RatingInputSize } from "@field-ds/components";
import { colour, space, textStyles } from "@field-ds/tokens";

const SIZES: RatingInputSize[] = [20, 28, 32];

const meta = {
  title: "Components/RatingInput",
  component: RatingInput,
  argTypes: {
    size: { control: "inline-radio", options: SIZES },
    emojis: { control: "boolean" },
    disabled: { control: "boolean" },
    defaultValue: { control: { type: "number", min: 0, max: 5, step: 1 } },
    emoji: { control: "text" },
  },
  args: {
    size: 28,
    emojis: true,
    disabled: false,
    defaultValue: 0,
    emoji: "😊",
  },
  parameters: {
    docs: {
      description: {
        component:
          "M-Rating/Input — interactive 5-star rating with optional emoji feedback at the selected star. Three sizes (20 / 28 / 32). Tap the current star to clear back to zero.",
      },
    },
  },
} satisfies Meta<typeof RatingInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: { defaultValue: 4 },
};

export const WithoutEmojis: Story = {
  name: "Without emojis",
  args: { emojis: false, defaultValue: 3 },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 3 },
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
            {s}px
          </Text>
          <View style={{ gap: space["12"] }}>
            <RatingInput size={s} />
            <RatingInput size={s} defaultValue={3} />
            <RatingInput size={s} defaultValue={5} />
            <RatingInput size={s} defaultValue={3} emojis={false} />
            <RatingInput size={s} defaultValue={3} disabled />
          </View>
        </View>
      ))}
    </View>
  ),
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ gap: space["16"] }}>
      <Row label="Unfilled">
        <RatingInput defaultValue={0} />
      </Row>
      <Row label="1 star">
        <RatingInput defaultValue={1} />
      </Row>
      <Row label="2 stars">
        <RatingInput defaultValue={2} />
      </Row>
      <Row label="3 stars">
        <RatingInput defaultValue={3} />
      </Row>
      <Row label="4 stars">
        <RatingInput defaultValue={4} />
      </Row>
      <Row label="5 stars">
        <RatingInput defaultValue={5} />
      </Row>
    </View>
  ),
};

export const Controlled: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [rating, setRating] = useState(0);
    const labels = [
      "Tap a star to rate",
      "Hated it",
      "Didn't like it",
      "It was OK",
      "Liked it",
      "Loved it",
    ];
    return (
      <View style={{ gap: space["12"], alignItems: "flex-start" }}>
        <RatingInput value={rating} onChange={setRating} size={32} />
        <Text
          style={[
            textStyles.Body_B14_Medium,
            { color: colour["text-n-icon"].secondary },
          ]}
        >
          {labels[rating]}
        </Text>
      </View>
    );
  },
};

export const CustomEmoji: Story = {
  name: "Custom emoji",
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ gap: space["16"] }}>
      <Row label="Party">
        <RatingInput defaultValue={4} emoji="🎉" />
      </Row>
      <Row label="Fire">
        <RatingInput defaultValue={5} emoji="🔥" />
      </Row>
      <Row label="Heart">
        <RatingInput defaultValue={3} emoji="❤️" />
      </Row>
    </View>
  ),
};

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: space["16"] }}>
      <Text
        style={[
          textStyles.Body_B11_Medium,
          {
            color: colour["text-n-icon"].tertiary,
            minWidth: 96,
          },
        ]}
      >
        {label}
      </Text>
      {children}
    </View>
  );
}
