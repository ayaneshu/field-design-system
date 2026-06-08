# Toast

Transient, non-blocking notification (snackbar). Leading asset (hugs 20–40px),
one-line title, one-line subtitle with an optional trailing chevron, and a
trailing action slot holding a button or a close (✕). Four semantic types.
Slides up + fades on enter, auto-dismisses after 3s (fading while dropping down
a little), swipes **down** to dismiss, and can show a second card peeking behind
to signal a queue (M-Stacked Toast).

> Maps to Figma **M-Toast** (`4227:76702`), **M-Stacked Toast** (`4229:76747`)
> and **M-Toast/ActionContainer** (`4227:76655`) in the Field Design System file.

## Usage

```tsx
import { Toast } from "@field-ds/components";

// Neutral feedback
<Toast type="dark" title="Link copied" subtitle="Paste it anywhere" />

// Status
<Toast type="success" title="Saved" subtitle="Your changes are live" />
<Toast type="error" title="Upload failed" actionLabel="Retry" onActionPress={retry} />

// Close (✕) action instead of a button
<Toast type="dark" title="Link copied" action="close" />

// Queue of 2+ → stacked presentation
<Toast type="dark" title="3 items queued" stacked />

// Controlled visibility; disable the 3s auto-dismiss with null
<Toast
  visible={open}
  onDismiss={() => setOpen(false)}
  autoDismissMs={null}
  title="Added to cart"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `"dark" \| "light" \| "error" \| "success"` | `"dark"` | Semantic type — drives surface and text colours. |
| `title` | `string` | — | One line, truncates with an ellipsis. |
| `subtitle` | `string` | — | One short line, truncates. |
| `showSubtitle` | `boolean` | `true` | Toggle the subtitle row. |
| `showAsset` | `boolean` | `true` | Toggle the leading asset slot. The slot hugs its content between 20×20 and 40×40, so the toast height follows the asset. |
| `icon` | `IconName` | — | Glyph in the asset slot (24px). |
| `asset` | `ReactNode` | — | Custom leading content (icon/svg/image/lottie); overrides `icon`. Sized by you, clamped to 20–40px. |
| `showChevron` | `boolean` | `true` | Toggle the trailing icon (chevron) in the subtitle row. |
| `action` | `"button" \| "close" \| "none"` | `"button"` | What sits in the trailing action slot. |
| `actionLabel` | `string` | `"Button"` | Button label (when `action` is `"button"`). |
| `onActionPress` | `() => void` | — | Action press handler. `close` fires this alongside the dismiss. |
| `onPress` | `() => void` | — | Press handler for the toast body. |
| `stacked` | `boolean` | `false` | Show the stacked (queued 2+) presentation. |
| `visible` | `boolean` | `true` | Controlled visibility; `false` animates out then fires `onDismiss`. |
| `autoDismissMs` | `number \| null` | `3000` | Auto-dismiss delay. `null`/`0` persists the toast. |
| `swipeToDismiss` | `boolean` | `true` | Allow a downward swipe to dismiss. |
| `onDismiss` | `() => void` | — | Fired after exit / swipe / auto-dismiss. |
| `accessibilityLabel` | `string` | `title` + `subtitle` | Screen-reader label override. |
| `style` | `StyleProp<ViewStyle>` | — | Layout escape hatch on the outer container. |

## Tokens

| Concern | Token |
|---------|-------|
| Surface · dark | `colour.surface["secondary-inverted"]` |
| Surface · light | `colour.surface.primary` |
| Surface · error | `colour.surface["error-bold"]` |
| Surface · success | `colour.surface["success-bold"]` |
| Border · light | `colour.border.subtle` |
| Border · dark/error/success | `base.colour["alpha-light"]["8"]` (white 8%) |
| Title | `colour["text-n-icon"]["on-surface-bold"]` / `.primary` (light) |
| Subtitle / chevron | `colour["text-n-icon"]["on-surface-subtle"]` / `.tertiary` (light) |
| Button · dark | `base.colour["alpha-light"]["16"]`, white label, `radius["8"]`, pad `space["8"]` |
| Button · light | `colour.surface.primary` + `colour.border.primary`, ink label, `radius["8"]`, h32 |
| Close · dark | `base.colour["alpha-light"]["8"]`, white ✕, `radius.rounded`, pad `space["4"]` |
| Close · light | `colour.surface.tertiary`, ink ✕, `radius.rounded`, pad `space["4"]` |
| Card radius | `radius["14"]` |
| Padding / gap | `space["12"]` (content), `space["10"]` (action slot), `space["8"]` (gap) |
| Title type | `textStyles.B14_SemiBold` |
| Subtitle type | `textStyles.B12_Regular` |
| Action type | `textStyles.A12_SemiBold` |
| Motion | `motion.spring.springLight` (enter/stack/spring-back), `motion.duration` × `motion.easing` tokens (exit/stack/swipe), `motion.spring.snappy` (action press) |

## Motion

- **Enter** — slides up 16px and fades in on `motion.spring.springLight`.
- **Auto-dismiss** — after `autoDismissMs` (default 3000) the toast fades out while dropping down ~16px on `motion.duration.base` × `easing.accelerate`, then fires `onDismiss`.
- **Exit** — the same fade-and-drop when `visible` flips to `false` or the close (✕) is pressed.
- **Swipe** — a downward drag tracks the finger and fades the toast; past ~72px (or a fast flick) it flings down and dismisses, otherwise it springs back on `springLight`.
- **Stacked** — the present toast shrinks and recedes behind (peeking ~10px above the top) on `motion.duration.emphasized` × `easing.standard`; then, after `motion.delay.beat`, the new toast rises in over it on `easing.decelerate`. Un-stacking reverses on `easing.standard`. Height hugs the content, so a title-only toast is shorter than one with a subtitle and action.
- **Reduced motion** — honours `useReducedMotion()`: snaps to the end state, no fling.

## Accessibility

- `accessibilityRole` is `alert` for `error`/`success`, `summary` otherwise.
- `accessibilityLiveRegion="polite"` so screen readers announce the toast.
- Default `accessibilityLabel` is the title and subtitle joined; override via the prop.
- The action button is a labelled `button`.

## Links

- Storybook: `apps/storybook/src/stories/Toast.stories.tsx`
- Figma: [M-Toast](https://www.figma.com/design/wFRKiKskxZ4vjIHbDVvngJ/Field-Design-System?node-id=4227-76702)
