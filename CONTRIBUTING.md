# Contributing — Field Design System

## Branch nomenclature

The Field Design System uses a small set of branch prefixes that scale with versioning. Pick the prefix that matches the *intent* of the change, not the file you're touching.

### Long-lived branches

| Branch              | Purpose                                                                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `main`              | Single integration line. Always green. Every release is cut from here.                                                                      |
| `release/vMAJOR.MINOR` | One per supported minor version (e.g. `release/v0.1`, `release/v0.2`). Created when we cut a minor; receives backports only — no new features. |

### Short-lived branches (open a PR, then delete)

| Prefix             | Use for                                                            | Example                                |
| ------------------ | ------------------------------------------------------------------ | -------------------------------------- |
| `feature/<slug>`   | New components, new public API, new consumer-visible behavior      | `feature/accordion-component`          |
| `fix/<slug>`       | Bug fixes that don't change the public API                         | `fix/checkbox-disabled-tap-target`     |
| `chore/<slug>`     | Tooling, dependency bumps, refactors, internal-only changes        | `chore/upgrade-storybook-9`            |
| `docs/<slug>`      | Documentation-only changes (READMEs, MDX, comments)                | `docs/accordion-readme`                |
| `release/<slug>`   | Release-prep branches that bundle a set of changes for tagging     | `release/v0.2.0-prep`                  |

Slugs are kebab-case, ≤ 4 words, scoped to one thing. If the slug needs more than 4 words, split the work into multiple branches.

### Versioning

Tags follow [SemVer 2.0](https://semver.org):

- `v0.X.Y` — current pre-1.0 cadence. Breaking changes bump the **minor** (`0.1 → 0.2`); fixes and additive changes bump the **patch** (`0.1.0 → 0.1.1`).
- `v1.0.0` and beyond — breaking changes bump the **major**.

Tags are immutable. Hotfixes after a release land on the matching `release/v0.X` branch and get a new patch tag.

### Mapping branches → versions

```
feature/* ──┐
fix/*    ──┼──> main ──┬──> tag v0.X.0  ──> release/v0.X
chore/*  ──┤            │
docs/*   ──┘            └──> tag v0.X.Y  (subsequent patches)
                                          ↑
                              fix/* may also target release/v0.X for backports
```

### PR rules

- One concern per PR. Don't bundle a feature with unrelated tooling.
- The branch name should match the PR title's intent (a `feature/` branch shouldn't ship as a "fix:" PR).
- For new components: include the component folder, its README, the Storybook story, and the export in `packages/components/src/index.ts` — all in one PR.

## Component checklist

When landing a new component (typically on a `feature/<component>-component` branch):

- [ ] `packages/components/src/<Name>/<Name>.tsx` — the component
- [ ] `packages/components/src/<Name>/index.ts` — re-exports the public surface
- [ ] `packages/components/src/<Name>/README.md` — usage, props, tokens, Storybook link
- [ ] `packages/components/src/index.ts` — top-level re-export
- [ ] `apps/storybook/src/stories/<Name>.stories.tsx` — at least Default + variants
- [ ] No hardcoded colors, typography, or SVG paths — go through `@field-ds/tokens` and `@field-ds/icons`
