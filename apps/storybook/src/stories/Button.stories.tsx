import { useState } from "react";
import { Text, View } from "react-native";
import type { Meta, StoryObj } from "@storybook/react";

import {
  Button,
  IconButton,
  RoundButton,
  TextButton,
  type ButtonSize,
  type ButtonVariant,
  type IconButtonEmphasis,
  type IconButtonSize,
  type RoundButtonSize,
  type TextButtonSize,
  type TextButtonTone,
} from "@field-ds/components";
import type { IconName } from "@field-ds/icons";
import { colour, space, textStyles } from "@field-ds/tokens";

const VARIANTS: ButtonVariant[] = [
  "primary",
  "secondary",
  "secondary-neutral",
  "neutral",
];
const SIZES: ButtonSize[] = ["H56", "H52", "H48", "H40", "H36", "H32"];

// Curated icon set surfaced via the Storybook controls panel. Includes
// `undefined` so the iconLeft/iconRight slots can be cleared from the UI.
// Mirrors the playground picker so designers can drive the same buttons
// the same way in both surfaces.
const ICON_PICKER_OPTIONS: (IconName | undefined)[] = [
  undefined,
  "system-plus",
  "system-arrow-right",
  "system-arrow-left",
  "system-arrow-up",
  "system-arrow-down",
  "system-chevron-right",
  "system-chevron-left",
  "system-search",
  "system-edit",
  "system-bag",
  "system-heart",
  "system-bin",
  "system-info-circle",
  "system-check-circle",
  "system-message",
];

const meta = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: { control: "inline-radio", options: VARIANTS },
    size: { control: "inline-radio", options: SIZES },
    label: { control: "text" },
    iconLeft: {
      control: "select",
      options: ICON_PICKER_OPTIONS,
      description: "Glyph rendered before the label. Pick `—` to omit.",
    },
    iconRight: {
      control: "select",
      options: ICON_PICKER_OPTIONS,
      description: "Glyph rendered after the label. Pick `—` to omit.",
    },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    fullWidth: { control: "boolean" },
  },
  args: {
    variant: "primary",
    size: "H56",
    label: "Continue",
    iconLeft: undefined,
    iconRight: undefined,
    loading: false,
    disabled: false,
    fullWidth: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Rectangular text+icon CTA mapping to Figma's M-PrimaryButton, M-SecondaryButton, M-SecondaryNeutralButton, and M-NeutralButton. Four variants × six heights × default / pressed / loader / disabled states. H32 is only valid on `variant=\"neutral\"`.",
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Secondary: Story = {
  args: { variant: "secondary", label: "Cancel" },
};

export const SecondaryNeutral: Story = {
  name: "Secondary · neutral",
  args: { variant: "secondary-neutral", label: "Edit" },
};

export const Neutral: Story = {
  args: { variant: "neutral", label: "Schedule" },
};

export const Loading: Story = {
  args: { loading: true, label: "Saving" },
};

export const Disabled: Story = {
  args: { disabled: true, label: "Unavailable" },
};

export const WithIcons: Story = {
  name: "With icons",
  args: {
    label: "Continue",
    iconLeft: "system-plus",
    iconRight: "system-arrow-right",
  },
};

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ gap: space["20"] }}>
      {VARIANTS.map((v) => (
        <Row key={v} title={v}>
          <Button label="Default" variant={v} />
          <Button label="With icon" variant={v} iconLeft="system-plus" />
          <Button label="Loading" variant={v} loading />
          <Button label="Disabled" variant={v} disabled />
        </Row>
      ))}
    </View>
  ),
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ gap: space["20"] }}>
      {SIZES.map((s) => {
        // H32 only ships on the neutral variant per Figma.
        const variant: ButtonVariant = s === "H32" ? "neutral" : "primary";
        return (
          <Row key={s} title={s}>
            <Button label="Continue" variant={variant} size={s} />
            <Button
              label="Continue"
              variant={variant}
              size={s}
              iconLeft="system-plus"
            />
            <Button label="Continue" variant={variant} size={s} loading />
            <Button label="Continue" variant={variant} size={s} disabled />
          </Row>
        );
      })}
    </View>
  ),
};

export const Controlled: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [busy, setBusy] = useState(false);
    return (
      <View style={{ gap: space["12"] }}>
        <Button
          label={busy ? "Saving" : "Save"}
          loading={busy}
          onPress={() => {
            setBusy(true);
            setTimeout(() => setBusy(false), 1500);
          }}
        />
        <Caption>Tap to trigger a 1.5s loading state.</Caption>
      </View>
    );
  },
};

// ─────────── RoundButton ───────────

const ROUND_SIZES: RoundButtonSize[] = ["H40", "H36"];

export const RoundButtons: Story = {
  name: "RoundButton · all states",
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ gap: space["20"] }}>
      {ROUND_SIZES.map((s) => (
        <Row key={s} title={`Round · ${s}`}>
          <RoundButton label="Filter" size={s} />
          <RoundButton label="Filter" size={s} iconLeft="system-plus" />
          <RoundButton label="Filter" size={s} loading />
          <RoundButton label="Filter" size={s} disabled />
        </Row>
      ))}
    </View>
  ),
};

// ─────────── TextButton ───────────

const TEXT_TONES: TextButtonTone[] = ["blue", "neutral"];
const TEXT_SIZES: TextButtonSize[] = ["A14", "A12"];

export const TextButtons: Story = {
  name: "TextButton · all states",
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ gap: space["20"] }}>
      {TEXT_TONES.map((tone) => (
        <View key={tone} style={{ gap: space["12"] }}>
          {TEXT_SIZES.map((sz) => (
            <Row key={sz} title={`${tone} · ${sz}`}>
              <TextButton label="View all" tone={tone} size={sz} />
              <TextButton
                label="View all"
                tone={tone}
                size={sz}
                iconRight="system-arrow-right"
              />
              <TextButton label="View all" tone={tone} size={sz} disabled />
            </Row>
          ))}
        </View>
      ))}
    </View>
  ),
};

// ─────────── IconButton ───────────

const ICON_SIZES: IconButtonSize[] = ["H40", "H36"];
const ICON_EMPHASIS: IconButtonEmphasis[] = ["default", "ghost", "action"];

export const IconButtons: Story = {
  name: "IconButton · all emphases",
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ gap: space["20"] }}>
      {ICON_SIZES.map((sz) => (
        <View key={sz} style={{ gap: space["12"] }}>
          <Caption>{sz}</Caption>
          <View style={{ flexDirection: "row", gap: space["20"] }}>
            {ICON_EMPHASIS.map((em) => (
              <View key={em} style={{ gap: space["8"], alignItems: "center" }}>
                <View style={{ flexDirection: "row", gap: space["8"] }}>
                  <IconButton
                    icon="system-plus"
                    accessibilityLabel="Add"
                    size={sz}
                    emphasis={em}
                  />
                  <IconButton
                    icon="system-plus"
                    accessibilityLabel="Add"
                    size={sz}
                    emphasis={em}
                    disabled
                  />
                </View>
                <Caption>{em}</Caption>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  ),
};

// ─────────── Layout helpers ───────────

function Row({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ gap: space["8"] }}>
      <Caption>{title}</Caption>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: space["12"],
          alignItems: "center",
        }}
      >
        {children}
      </View>
    </View>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
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
      {children}
    </Text>
  );
}
