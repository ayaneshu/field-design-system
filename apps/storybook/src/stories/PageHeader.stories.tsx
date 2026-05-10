import { useState } from "react";
import { View } from "react-native";
import type { Meta, StoryObj } from "@storybook/react";

import { PageHeader, type PageHeaderTrailing } from "@field-ds/components";
import { colour, radius } from "@field-ds/tokens";

const SHARE: PageHeaderTrailing = {
  icon: "system-upload",
  onPress: () => {},
  accessibilityLabel: "Share",
};
const HEART: PageHeaderTrailing = {
  icon: "system-heart",
  onPress: () => {},
  accessibilityLabel: "Saved",
};
const MORE: PageHeaderTrailing = {
  icon: "system-horizontal-three-dot-menu",
  onPress: () => {},
  accessibilityLabel: "More",
};
const SEARCH: PageHeaderTrailing = {
  icon: "system-search",
  onPress: () => {},
  accessibilityLabel: "Search",
};

function Phone({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        width: 390,
        backgroundColor: colour.surface.primary,
        borderRadius: radius["24"],
        overflow: "hidden",
        borderWidth: 1,
        borderColor: colour.border.subtle,
      }}
    >
      {children}
      <View
        style={{
          height: 320,
          backgroundColor: colour.surface.tertiary,
        }}
      />
    </View>
  );
}

const meta = {
  title: "Components/PageHeader",
  component: PageHeader,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "M-PageHeader — top-of-screen header. One component, nine `type` values (title, title-center, search-bar, search-pill, search-pill-wide, location, breadcrumb, back-only, icons). Always exactly one per screen.",
      },
    },
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Title: Story = {
  args: { type: "title", title: "Page title", trailing: [SHARE] },
  render: (args) => (
    <Phone>
      <PageHeader {...args} />
    </Phone>
  ),
};

export const TitleWithImage: Story = {
  name: "Title — with image",
  args: {
    type: "title",
    title: "Acme HQ",
    subtitle: "Open · 09:00–18:00",
    trailing: [SHARE],
    imageSource: { uri: "https://placehold.co/76x76/png" },
  },
  render: (args) => (
    <Phone>
      <PageHeader {...args} />
    </Phone>
  ),
};

export const TitleCenter: Story = {
  name: "Title — centered",
  args: { type: "title-center", title: "Settings", trailing: [MORE] },
  render: (args) => (
    <Phone>
      <PageHeader {...args} />
    </Phone>
  ),
};

export const SearchBar: Story = {
  name: "Search bar",
  args: { type: "search-bar", searchPlaceholder: "Search for your building, area..." },
  render: (args) => {
    const [q, setQ] = useState("");
    return (
      <Phone>
        <PageHeader {...args} searchValue={q} onSearchChangeText={setQ} />
      </Phone>
    );
  },
};

export const Location: Story = {
  args: {
    type: "location",
    addressLabel: "Home",
    subtitle: "Villa 52, Springville, K, VGP Layout",
    trailing: [HEART],
  },
  render: (args) => (
    <Phone>
      <PageHeader {...args} />
    </Phone>
  ),
};

export const Breadcrumb: Story = {
  args: {
    type: "breadcrumb",
    addressLabel: "Home",
    path: "- BDA Complex, 100 Feet Rd Block, Koramangla",
    trailing: [HEART],
  },
  render: (args) => (
    <Phone>
      <PageHeader {...args} />
    </Phone>
  ),
};

export const BackOnly: Story = {
  name: "Back only",
  args: { type: "back-only" },
  render: (args) => (
    <Phone>
      <PageHeader {...args} />
    </Phone>
  ),
};

export const SearchPill: Story = {
  name: "Search pill",
  args: { type: "search-pill", searchPlaceholder: "Search", trailing: [HEART] },
  render: (args) => (
    <Phone>
      <PageHeader {...args} />
    </Phone>
  ),
};

export const Icons: Story = {
  args: {
    type: "icons",
    trailing: [SEARCH, HEART, SHARE],
  },
  render: (args) => (
    <Phone>
      <PageHeader {...args} />
    </Phone>
  ),
};

export const SearchPillWide: Story = {
  name: "Search pill — wide",
  args: {
    type: "search-pill-wide",
    searchPlaceholder: "Search",
    trailing: [HEART, SHARE],
  },
  render: (args) => (
    <Phone>
      <PageHeader {...args} />
    </Phone>
  ),
};

export const LongTitleTruncates: Story = {
  name: "Long title truncates",
  args: {
    type: "title",
    title: "A very long page title that should truncate gracefully on a phone-width header",
    subtitle: "And the subtitle should also truncate cleanly with an ellipsis",
    trailing: [SHARE, HEART, MORE],
  },
  render: (args) => (
    <Phone>
      <PageHeader {...args} />
    </Phone>
  ),
};
