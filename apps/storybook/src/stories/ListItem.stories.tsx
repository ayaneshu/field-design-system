import { Alert, Switch, Text, View } from "react-native";
import type { Meta, StoryObj } from "@storybook/react";

import { Checkbox, ListItem, type ListItemProps } from "@field-ds/components";
import { Icon } from "@field-ds/icons";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

// Storybook-only arg: toggle the `leading` slot from a boolean control. Maps
// to a real Icon node before forwarding, mirroring the `Show leading` boolean
// property on the Figma M-List-Item.
type StoryArgs = Omit<ListItemProps, "leading" | "trailing" | "titleSlot"> & {
  showLeadingIcon?: boolean;
  showChevron?: boolean;
};

const LocationIcon = (
  <Icon
    name="system-location"
    size={24}
    color={colour["text-n-icon"].primary}
  />
);

const ChevronTrailing = (
  <Icon
    name="system-chevron-right"
    size={20}
    color={colour["text-n-icon"].secondary}
  />
);

const renderListItem = ({ showLeadingIcon, showChevron, ...args }: StoryArgs) => (
  <ListItem
    {...args}
    leading={showLeadingIcon ? LocationIcon : undefined}
    trailing={showChevron ? ChevronTrailing : undefined}
  />
);

const meta = {
  title: "Components/ListItem",
  component: ListItem,
  render: renderListItem,
  argTypes: {
    title: { control: "text" },
    subtitle: { control: "text" },
    size: { control: "radio", options: ["small", "big"] },
    showLeadingIcon: {
      control: "boolean",
      description:
        "Storybook-only — toggles the `leading` slot using a default location icon.",
      table: { category: "Slots" },
    },
    showChevron: {
      control: "boolean",
      description:
        "Storybook-only — toggles the `trailing` slot using a default chevron.",
      table: { category: "Slots" },
    },
    leading: { table: { disable: true } },
    trailing: { table: { disable: true } },
    titleSlot: { table: { disable: true } },
  },
  args: {
    title: "Title",
    subtitle: "Subtitle",
    size: "small",
    showLeadingIcon: true,
    showChevron: false,
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "M-ListItem — atomic stackable row primitive. The `leading` slot is a 24×24 area where developers can drop any custom node (Icon, avatar, Checkbox, badge). Use inside a list; do not stack standalone.",
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

export const TitleOnly: Story = {
  name: "Title only",
  args: { subtitle: undefined },
};

export const Big: Story = {
  args: { size: "big", title: "Big title", subtitle: "Used in denser hubs" },
};

export const CustomLeading: Story = {
  name: "Custom leading slot (avatar)",
  args: {
    title: "Layla Ahmed",
    subtitle: "layla@example.com",
    showLeadingIcon: false,
  },
  render: (args) => (
    <ListItem
      {...args}
      leading={
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 9999,
            backgroundColor: colour["surface"]["action-bold"] ?? "#0070F3",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={[
              textStyles.Body_B12_Bold,
              { color: colour.surface.primary },
            ]}
          >
            LA
          </Text>
        </View>
      }
    />
  ),
};

export const WithCheckbox: Story = {
  name: "Leading: Checkbox",
  args: {
    title: "Save my address for next time",
    subtitle: undefined,
    showLeadingIcon: false,
  },
  render: (args) => (
    <ListItem {...args} leading={<Checkbox defaultSelected size="H24" />} />
  ),
};

export const WithTitleSlot: Story = {
  name: "With title slot (badge)",
  args: { title: "New feature" },
  render: (args) => (
    <ListItem
      {...args}
      leading={LocationIcon}
      titleSlot={
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 9999,
            backgroundColor: colour["text-n-icon"].error,
          }}
        />
      }
    />
  ),
};

export const WithTrailingChevron: Story = {
  name: "Trailing: chevron (navigation)",
  args: { showChevron: true },
};

export const WithTrailingSwitch: Story = {
  name: "Trailing: switch (settings)",
  args: { title: "Push notifications", subtitle: "Daily digest" },
  render: (args) => (
    <ListItem
      {...args}
      leading={LocationIcon}
      trailing={
        <Switch
          value
          trackColor={{
            false: colour.surface.muted,
            true: colour["text-n-icon"].action,
          }}
          thumbColor={colour.surface.primary}
        />
      }
    />
  ),
};

export const Pressable: Story = {
  name: "Pressable",
  args: {
    title: "Tap me",
    subtitle: "Logs to console on press",
    showChevron: true,
    onPress: () => Alert.alert("Pressed", "ListItem onPress fired"),
  },
};


export const Density: Story = {
  name: "Density (small + big)",
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ gap: space["12"] }}>
      <PreviewSurface>
        <ListItem title="Small density" subtitle="B14 SemiBold title" leading={LocationIcon} />
      </PreviewSurface>
      <PreviewSurface>
        <ListItem size="big" title="Big density" subtitle="H16 Bold title" leading={LocationIcon} />
      </PreviewSurface>
    </View>
  ),
};

export const Stack: Story = {
  name: "Stack (list)",
  parameters: { controls: { disable: true } },
  render: () => (
    <View
      style={{
        backgroundColor: colour.surface.primary,
        borderRadius: radius["12"],
        overflow: "hidden",
      }}
    >
      <ListItem
        title="Address"
        subtitle="123 Sheikh Zayed Rd, Dubai"
        leading={LocationIcon}
        trailing={ChevronTrailing}
        onPress={() => {}}
      />
      <ListItem
        title="Payment method"
        subtitle="Visa ending in 4242"
        leading={
          <Icon
            name="system-bag"
            size={24}
            color={colour["text-n-icon"].primary}
          />
        }
        trailing={ChevronTrailing}
        onPress={() => {}}
      />
      <ListItem
        title="Notifications"
        subtitle="Daily digest"
        leading={
          <Icon
            name="system-notification"
            size={24}
            color={colour["text-n-icon"].primary}
          />
        }
        trailing={
          <Switch
            value
            trackColor={{
              false: colour.surface.muted,
              true: colour["text-n-icon"].action,
            }}
            thumbColor={colour.surface.primary}
          />
        }
      />
    </View>
  ),
};

function PreviewSurface({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: colour.surface.tertiary,
        borderRadius: radius["12"],
        padding: space["12"],
      }}
    >
      {children}
    </View>
  );
}
