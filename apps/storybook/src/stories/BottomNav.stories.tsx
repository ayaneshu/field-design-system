import { useState } from "react";
import { View } from "react-native";
import type { Meta, StoryObj } from "@storybook/react";

import {
  BottomNav,
  bottomNavIconNames,
  type BottomNavTab,
} from "@field-ds/components";
import { colour, radius, space } from "@field-ds/tokens";

const THREE_TABS: BottomNavTab[] = [
  { key: "home", label: "Home", icon: "bottomnav-home" },
  { key: "categories", label: "Categories", icon: "bottomnav-categories" },
  { key: "cart", label: "Cart", icon: "bottomnav-cart" },
];

const FIVE_TABS: BottomNavTab[] = [
  { key: "home", label: "Home", icon: "bottomnav-home" },
  { key: "categories", label: "Categories", icon: "bottomnav-categories" },
  { key: "deals", label: "Deals", icon: bottomNavIconNames[2] ?? "bottomnav-categories" },
  { key: "cart", label: "Cart", icon: "bottomnav-cart" },
  { key: "account", label: "Account", icon: bottomNavIconNames[bottomNavIconNames.length - 1] ?? "bottomnav-home" },
];

const meta = {
  title: "Components/BottomNav",
  component: BottomNav,
  argTypes: {
    showHomeBar: { control: "boolean" },
    activeKey: { control: "text" },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "M-Bottomnav — primary bottom tab bar. One tab is active at a time and drives the highlight, icon and label colour. Active state automatically swaps the icon to its `-filled` sibling. 3–5 tabs.",
      },
    },
  },
} satisfies Meta<typeof BottomNav>;

export default meta;
type Story = StoryObj<typeof meta>;

function Phone({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        width: 390,
        backgroundColor: colour.surface.primary,
        borderRadius: radius["24"] ?? 24,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: colour.border.subtle,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
      }}
    >
      <View style={{ height: 480, backgroundColor: colour.surface.tertiary }} />
      {children}
    </View>
  );
}

export const ThreeTabs: Story = {
  name: "Three tabs",
  args: {
    tabs: THREE_TABS,
    activeKey: "home",
    showHomeBar: true,
  },
  render: (args) => {
    const [activeKey, setActiveKey] = useState(args.activeKey);
    return (
      <Phone>
        <BottomNav
          {...args}
          activeKey={activeKey}
          onTabPress={setActiveKey}
        />
      </Phone>
    );
  },
};

export const FiveTabs: Story = {
  name: "Five tabs",
  args: {
    tabs: FIVE_TABS,
    activeKey: "deals",
    showHomeBar: true,
  },
  render: (args) => {
    const [activeKey, setActiveKey] = useState(args.activeKey);
    return (
      <Phone>
        <BottomNav
          {...args}
          activeKey={activeKey}
          onTabPress={setActiveKey}
        />
      </Phone>
    );
  },
};

export const WithoutHomeBar: Story = {
  name: "Without home bar",
  args: {
    tabs: THREE_TABS,
    activeKey: "categories",
    showHomeBar: false,
  },
  render: (args) => {
    const [activeKey, setActiveKey] = useState(args.activeKey);
    return (
      <View style={{ width: 390, padding: space["16"] }}>
        <BottomNav
          {...args}
          activeKey={activeKey}
          onTabPress={setActiveKey}
        />
      </View>
    );
  },
};
