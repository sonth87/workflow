import type { Preview } from "@storybook/react";

import "tailwindcss/tailwind.css";
import "../src/styles/global.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    deepControls: { enabled: true },
  },
};

export default preview;
