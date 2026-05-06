# Storybook — Field Design System

Storybook for `@field-ds/components`. Runs the React Native components in the browser via `react-native-web`, so you can browse, tweak controls, and link to specific stories from each component's README.

## Run

From the repo root:

```bash
pnpm install
pnpm --filter storybook dev
```

Open http://localhost:6006.

## Build static site

```bash
pnpm --filter storybook build
```

Outputs to `storybook-static/`. Deploy that folder anywhere static (Vercel, Netlify, GitHub Pages).

## Adding a story

1. Create `src/stories/<ComponentName>.stories.tsx`.
2. Default export a `Meta`, then export each variant as a named `StoryObj`.
3. Link the story from the component's `README.md` (`packages/components/src/<ComponentName>/README.md`).

## How RN renders here

Vite is configured (in `.storybook/main.ts`) to alias `react-native` → `react-native-web` and pre-bundle `react-native-reanimated` and `react-native-svg`. The same components that run in the playground (and in shipped apps) render here unchanged.
