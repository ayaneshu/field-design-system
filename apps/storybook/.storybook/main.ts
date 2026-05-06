import type { StorybookConfig } from "@storybook/react-native-web-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-native-web-vite",
    options: {
      // Pull pre-bundling rules in for the RN packages we depend on. The
      // framework already aliases `react-native` → `react-native-web` and
      // strips Flow types from the RN source.
      modulesToTranspile: ["react-native-reanimated"],
    },
  },
  typescript: {
    reactDocgen: false,
  },
};

export default config;
