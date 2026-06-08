import { useState, type ReactNode } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Switch as FieldSwitch } from "@field-ds/components";
import { Icon } from "@field-ds/icons";
import { colour, radius, space } from "@field-ds/tokens";

import { PageScaffold, type SidebarItem } from "../components/PageScaffold";
import { useShell } from "../theme/ThemeContext";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Install">;

const SIDEBAR: SidebarItem[] = [
  { key: "packages", label: "Packages", active: true },
  { key: "peers", label: "Peer dependencies" },
  { key: "setup", label: "Project setup" },
  { key: "usage", label: "Usage" },
];

const MONO =
  Platform.select({
    web: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    ios: "Menlo",
    default: "monospace",
  }) ?? "monospace";

type PM = "pnpm" | "npm" | "yarn";
const PMS: PM[] = ["pnpm", "npm", "yarn"];
function addCmd(pm: PM, pkgs: string): string {
  return pm === "npm" ? `npm install ${pkgs}` : `${pm} add ${pkgs}`;
}

const FIELD_PKGS = "@field-ds/components @field-ds/tokens @field-ds/icons";
const PEER_PKGS =
  "react-native-reanimated react-native-svg react-native-safe-area-context";

const BABEL_SNIPPET = `// babel.config.js
module.exports = {
  presets: ['babel-preset-expo'],
  // Reanimated's plugin MUST be last.
  plugins: ['react-native-reanimated/plugin'],
};`;

const PROVIDERS_SNIPPET = `import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {/* your app */}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}`;

const USAGE_SNIPPET = `import { Toast, PrimaryButton } from '@field-ds/components';
import { colour, space } from '@field-ds/tokens';
import { Icon } from '@field-ds/icons';

export function Example() {
  return (
    <>
      <PrimaryButton label="Save" onPress={save} />
      <Toast type="success" title="Saved" subtitle="Your changes are live" />
    </>
  );
}`;

export function InstallScreen({ navigation }: Props) {
  const shell = useShell();
  const [pm, setPm] = useState<PM>("pnpm");

  return (
    <PageScaffold
      topNavActive="Install"
      title="install"
      subtitle="Field DS ships as three workspace packages — components, tokens and icons — built for React Native (and React Native Web). Add them to any Expo or bare RN app in a couple of minutes."
      sidebar={SIDEBAR}
    >
      <View style={{ gap: space["40"], maxWidth: 760 }}>
        {/* Package manager selector */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: space["12"],
            flexWrap: "wrap",
          }}
        >
          <Text
            style={[styleLabel(shell), { textTransform: "uppercase", letterSpacing: 0.6 }]}
          >
            Package manager
          </Text>
          <View style={{ minWidth: 240 }}>
            <FieldSwitch<PM>
              options={PMS.map((p) => ({ value: p, label: p }))}
              value={pm}
              onChange={setPm}
            />
          </View>
        </View>

        {/* 1 — Packages */}
        <Section
          shell={shell}
          step="01"
          heading="Install the packages"
          body="Add the three Field DS packages. tokens and icons are dependencies of components, but installing them explicitly lets you import design tokens and icons directly."
        >
          <CommandBlock shell={shell} command={addCmd(pm, FIELD_PKGS)} />
        </Section>

        {/* 2 — Peers */}
        <Section
          shell={shell}
          step="02"
          heading="Install the peer dependencies"
          body="Components are animated with Reanimated, draw with react-native-svg, and respect safe-area insets — install these peers in your app."
        >
          <CommandBlock shell={shell} command={addCmd(pm, PEER_PKGS)} />
        </Section>

        {/* 3 — Setup */}
        <Section
          shell={shell}
          step="03"
          heading="Wire up your project"
          body="Add the Reanimated Babel plugin, mount the gesture + safe-area providers, and load the Noontree font family the text styles reference."
        >
          <Sub shell={shell}>Babel</Sub>
          <CodeBlock shell={shell} code={BABEL_SNIPPET} />
          <Sub shell={shell}>Providers</Sub>
          <CodeBlock shell={shell} code={PROVIDERS_SNIPPET} />
          <Sub shell={shell}>Fonts</Sub>
          <Text style={styleBody(shell)}>
            Load <Mono shell={shell}>Noontree-Regular / Medium / SemiBold / Bold</Mono>{" "}
            via <Mono shell={shell}>expo-font</Mono> (or asset linking in bare RN) so the
            text styles render in the right typeface.
          </Text>
        </Section>

        {/* 4 — Usage */}
        <Section
          shell={shell}
          step="04"
          heading="Use a component"
          body="Everything is a named export. Import a component, a token, or an icon and you're done."
        >
          <CodeBlock shell={shell} code={USAGE_SNIPPET} />
          <Pressable
            onPress={() => navigation.navigate("Components")}
            style={({ pressed }) => ({
              alignSelf: "flex-start",
              flexDirection: "row",
              alignItems: "center",
              gap: space["6"],
              marginTop: space["4"],
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text
              style={{
                fontFamily: "Noontree-SemiBold",
                fontSize: 15,
                color: colour["text-n-icon"].action,
              }}
            >
              Browse all components
            </Text>
            <Icon name="system-chevron-right-bold" size={16} color={colour["text-n-icon"].action} />
          </Pressable>
        </Section>
      </View>
    </PageScaffold>
  );
}

// ─────────── building blocks ───────────

type Shell = ReturnType<typeof useShell>;

function styleLabel(shell: Shell) {
  return {
    fontFamily: "Noontree-SemiBold",
    fontSize: 11,
    lineHeight: 16,
    color: shell.textTertiary,
  } as const;
}
function styleBody(shell: Shell) {
  return {
    fontFamily: "Noontree-Medium",
    fontSize: 15,
    lineHeight: 23,
    color: shell.textSecondary,
  } as const;
}

function Section({
  shell,
  step,
  heading,
  body,
  children,
}: {
  shell: Shell;
  step: string;
  heading: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <View style={{ gap: space["12"] }}>
      <View style={{ flexDirection: "row", alignItems: "baseline", gap: space["10"] }}>
        <Text
          style={{
            fontFamily: "Noontree-SemiBold",
            fontSize: 13,
            color: shell.textTertiary,
          }}
        >
          {step}
        </Text>
        <Text
          style={{
            fontFamily: "Noontree-Bold",
            fontSize: 22,
            lineHeight: 28,
            letterSpacing: -0.3,
            color: shell.textPrimary,
          }}
        >
          {heading}
        </Text>
      </View>
      <Text style={styleBody(shell)}>{body}</Text>
      <View style={{ gap: space["10"], marginTop: space["4"] }}>{children}</View>
    </View>
  );
}

function Sub({ shell, children }: { shell: Shell; children: ReactNode }) {
  return (
    <Text
      style={{
        fontFamily: "Noontree-SemiBold",
        fontSize: 12,
        lineHeight: 16,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        color: shell.textTertiary,
        marginTop: space["6"],
      }}
    >
      {children}
    </Text>
  );
}

function Mono({ shell, children }: { shell: Shell; children: ReactNode }) {
  return (
    <Text style={{ fontFamily: MONO, fontSize: 13.5, color: shell.textPrimary }}>
      {children}
    </Text>
  );
}

/** A single shell command with a leading `$` and a copy button. */
function CommandBlock({ shell, command }: { shell: Shell; command: string }) {
  return (
    <CodeSurface shell={shell} copyText={command}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space["8"], flex: 1, minWidth: 0 }}>
        <Text style={{ fontFamily: MONO, fontSize: 14, color: colour["text-n-icon"].muted }}>$</Text>
        <Text
          style={{ fontFamily: MONO, fontSize: 14, lineHeight: 22, color: colour["text-n-icon"].primary, flex: 1 }}
        >
          {command}
        </Text>
      </View>
    </CodeSurface>
  );
}

/** A multi-line code snippet with a copy button. */
function CodeBlock({ shell, code }: { shell: Shell; code: string }) {
  return (
    <CodeSurface shell={shell} copyText={code} align="flex-start">
      <Text
        style={{
          fontFamily: MONO,
          fontSize: 13,
          lineHeight: 21,
          color: colour["text-n-icon"].primary,
          flex: 1,
        }}
      >
        {code}
      </Text>
    </CodeSurface>
  );
}

function CodeSurface({
  shell: _shell,
  copyText,
  align = "center",
  children,
}: {
  shell: Shell;
  copyText: string;
  align?: "center" | "flex-start";
  children: ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      navigator.clipboard.writeText
    ) {
      navigator.clipboard.writeText(copyText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      });
    }
  };
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: align,
        gap: space["12"],
        backgroundColor: colour.surface.tertiary,
        borderRadius: radius["12"],
        borderWidth: 1,
        borderColor: colour.border.primary,
        paddingVertical: space["14"],
        paddingHorizontal: space["16"],
      }}
    >
      {children}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={copied ? "Copied" : "Copy to clipboard"}
        onPress={onCopy}
        style={({ pressed }) => ({
          alignItems: "center",
          justifyContent: "center",
          padding: space["8"],
          borderRadius: radius["8"],
          borderWidth: 1,
          backgroundColor: copied
            ? colour.surface["success-subtle"]
            : colour.surface.primary,
          borderColor: copied ? colour.border.success : colour.border.primary,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Icon
          name={copied ? "system-check-circle-filled" : "system-copy"}
          size={24}
          color={copied ? colour["text-n-icon"].success : colour["text-n-icon"].secondary}
        />
      </Pressable>
    </View>
  );
}
