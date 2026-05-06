import type { Preview } from "@storybook/react";
import React from "react";

import { colour } from "@field-ds/tokens";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "surface",
      values: [
        { name: "surface", value: colour.surface.primary },
        { name: "secondary", value: colour.surface.secondary ?? "#F5F5F5" },
        { name: "dark", value: "#0E0E0E" },
      ],
    },
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div
        style={{
          padding: 24,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;
