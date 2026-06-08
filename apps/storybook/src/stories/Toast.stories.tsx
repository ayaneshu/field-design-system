import { Text, View } from "react-native";
import type { Meta, StoryObj } from "@storybook/react";

import { Toast, type ToastAction, type ToastType } from "@field-ds/components";
import type { IconName } from "@field-ds/icons";
import { colour, space, textStyles } from "@field-ds/tokens";

const TYPES: ToastType[] = ["dark", "light", "error", "success"];
const ACTIONS: ToastAction[] = ["button", "close", "none"];

// Curated leading glyphs designers reach for on a toast.
const ICON_PICKER_OPTIONS: IconName[] = [
  "system-check-circle-filled",
  "system-info-circle-filled",
  "system-warning-circle-filled",
  "system-bag",
  "system-heart",
];

// Every story renders inside a fixed-width frame — a toast stretches to its
// container, and the bottom of the screen is its production home.
function ToastFrame({ children }: { children: React.ReactNode }) {
  return <View style={{ width: 360, paddingVertical: space["12"] }}>{children}</View>;
}

const meta = {
  title: "Components/Toast",
  component: Toast,
  decorators: [
    (Story) => (
      <ToastFrame>
        <Story />
      </ToastFrame>
    ),
  ],
  argTypes: {
    type: { control: "inline-radio", options: TYPES },
    title: { control: "text" },
    subtitle: { control: "text" },
    showSubtitle: { control: "boolean" },
    showAsset: { control: "boolean" },
    icon: { control: "select", options: ICON_PICKER_OPTIONS },
    showChevron: { control: "boolean" },
    action: { control: "inline-radio", options: ACTIONS },
    actionLabel: { control: "text" },
    stacked: { control: "boolean" },
    swipeToDismiss: { control: "boolean" },
  },
  args: {
    type: "dark",
    title: "Title goes here",
    subtitle: "Subtitle goes here",
    showSubtitle: true,
    showAsset: true,
    icon: "system-info-circle-filled",
    showChevron: true,
    action: "button",
    actionLabel: "Button",
    stacked: false,
    swipeToDismiss: true,
    // Persist in docs so toasts don't vanish; auto-dismiss (3s) is the default.
    autoDismissMs: null,
  },
  parameters: {
    notes:
      "M-Toast — transient, non-blocking notification (snackbar). Leading 40px asset, one-line title, one-line subtitle with trailing chevron, optional trailing action. Reserve error/success for status that maps to those meanings; dark/light are neutral. Keep the title to a few words and the subtitle to one short line — both truncate and never wrap. For 2+ active toasts set `stacked` (M-Stacked Toast); for persistent/blocking messages use a banner or dialog.",
    docs: {
      description: {
        component:
          "M-Toast — transient bottom-anchored notification. Four types (dark/light/error/success), optional asset/subtitle/chevron/action, slide-up + fade enter, swipe-to-dismiss, and a `stacked` presentation that peeks a second card behind to signal a queue.",
      },
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dark: Story = {
  args: { type: "dark", title: "Link copied", subtitle: "Paste it anywhere" },
};

export const Light: Story = {
  args: {
    type: "light",
    title: "Draft saved",
    subtitle: "Last edited just now",
    icon: "system-info-circle-filled",
  },
};

export const Error: Story = {
  name: "Error",
  args: {
    type: "error",
    title: "Upload failed",
    subtitle: "Tap to try again",
    icon: "system-warning-circle-filled",
    actionLabel: "Retry",
  },
};

export const Success: Story = {
  args: {
    type: "success",
    title: "Order placed",
    subtitle: "Arrives Tuesday",
    icon: "system-check-circle-filled",
  },
};

export const CloseAction: Story = {
  name: "Close action",
  args: { type: "dark", title: "Link copied", subtitle: "Paste it anywhere", action: "close" },
};

export const CloseLight: Story = {
  name: "Close · light",
  args: { type: "light", title: "Draft saved", subtitle: "Last edited just now", action: "close" },
};

export const NoAction: Story = {
  name: "No action",
  args: { type: "dark", action: "none" },
};

export const NoSubtitle: Story = {
  name: "Title only",
  args: { type: "dark", showSubtitle: false },
};

export const NoAsset: Story = {
  name: "No asset",
  args: { type: "light", showAsset: false },
};

export const Stacked: Story = {
  name: "Stacked (queued)",
  args: { type: "dark", title: "3 updates", subtitle: "Tap to review", stacked: true },
};

export const AllTypes: Story = {
  name: "All types",
  parameters: { controls: { disable: true } },
  render: () => {
    const copy: Record<ToastType, { title: string; subtitle: string; icon: IconName }> = {
      dark: { title: "Link copied", subtitle: "Paste it anywhere", icon: "system-info-circle-filled" },
      light: { title: "Draft saved", subtitle: "Last edited just now", icon: "system-info-circle-filled" },
      error: { title: "Upload failed", subtitle: "Tap to try again", icon: "system-warning-circle-filled" },
      success: { title: "Order placed", subtitle: "Arrives Tuesday", icon: "system-check-circle-filled" },
    };
    return (
      <View style={{ gap: space["20"] }}>
        {TYPES.map((t) => (
          <View key={t} style={{ gap: space["8"] }}>
            <SectionLabel>{t}</SectionLabel>
            <Toast type={t} {...copy[t]} autoDismissMs={null} />
          </View>
        ))}
      </View>
    );
  },
};

export const Actions: Story = {
  name: "Action slot",
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ gap: space["20"] }}>
      <View style={{ gap: space["8"] }}>
        <SectionLabel>Button · dark</SectionLabel>
        <Toast type="dark" title="Saved" subtitle="Tap to view" action="button" autoDismissMs={null} />
      </View>
      <View style={{ gap: space["8"] }}>
        <SectionLabel>Close · dark</SectionLabel>
        <Toast type="dark" title="Link copied" subtitle="Paste it anywhere" action="close" autoDismissMs={null} />
      </View>
      <View style={{ gap: space["8"] }}>
        <SectionLabel>Button · light</SectionLabel>
        <Toast type="light" title="Saved" subtitle="Tap to view" action="button" autoDismissMs={null} />
      </View>
      <View style={{ gap: space["8"] }}>
        <SectionLabel>Close · light</SectionLabel>
        <Toast type="light" title="Draft saved" subtitle="Last edited just now" action="close" autoDismissMs={null} />
      </View>
    </View>
  ),
};

export const SingleVsStacked: Story = {
  name: "Single vs stacked",
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ gap: space["28"] }}>
      <View style={{ gap: space["8"] }}>
        <SectionLabel>Single</SectionLabel>
        <Toast type="dark" title="1 notification" subtitle="Tap to open" autoDismissMs={null} />
      </View>
      <View style={{ gap: space["8"] }}>
        <SectionLabel>Stacked · 2+</SectionLabel>
        <Toast type="dark" title="3 notifications" subtitle="Tap to review" stacked autoDismissMs={null} />
      </View>
    </View>
  ),
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
        },
      ]}
    >
      {children}
    </Text>
  );
}
