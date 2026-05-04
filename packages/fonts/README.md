# @field-ds/fonts

The Noontree font family — Light → Black, in OTF / WOFF / WOFF2.

## Why named `Noontree-{Weight}`?

React Native registers each font weight as its own family. The token text styles emitted by `@field-ds/tokens` set `fontFamily: "Noontree-Bold"`, etc. — this package follows the same naming so the two line up automatically.

## Usage

### Expo / React Native

```tsx
import { useFonts } from "expo-font";
import { noontreeFonts } from "@field-ds/fonts";

const [loaded] = useFonts(noontreeFonts);
if (!loaded) return null;
```

### Web

```ts
import { noontreeWebFontFace } from "@field-ds/fonts";

const css = noontreeWebFontFace("/fonts"); // public URL where files are served
```

Or copy `src/files/*.woff2` to your static assets and write your own `@font-face` rules.

## Files

```
src/files/
├── Noontree-Light.{otf,woff,woff2}
├── Noontree-Regular.{otf,woff,woff2}
├── Noontree-Medium.{otf,woff,woff2}
├── Noontree-SemiBold.{otf,woff,woff2}
├── Noontree-Bold.{otf,woff,woff2}
├── Noontree-ExtraBold.{otf,woff,woff2}
└── Noontree-Black.{otf,woff,woff2}
```
