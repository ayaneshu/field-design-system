import { Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Icon } from "@field-ds/icons";
import { colour, radius, space } from "@field-ds/tokens";

import { PageScaffold, type SidebarItem } from "../components/PageScaffold";
import { useShell } from "../theme/ThemeContext";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Patterns">;

const SIDEBAR: SidebarItem[] = [
  { key: "all", label: "All Patterns", active: true },
  { key: "empty-states", label: "Empty states" },
  { key: "onboarding", label: "Onboarding" },
  { key: "checkout", label: "Checkout" },
  { key: "errors", label: "Error recovery" },
];

export function PatternsScreen(_: Props) {
  const shell = useShell();
  return (
    <PageScaffold
      topNavActive="Patterns"
      title="patterns"
      subtitle="Composed flows and layouts that recur across noon's screens. Coming soon — we're capturing the first set now."
      sidebar={SIDEBAR}
    >
      <View
        style={{
          alignItems: "center",
          paddingVertical: space["48"],
        }}
      >
        <View
          style={{
            width: 88,
            height: 88,
            borderRadius: 44,
            backgroundColor: shell.sidebarBg,
            borderWidth: 1,
            borderColor: shell.border,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="system-clock" size={32} color={shell.textTertiary} />
        </View>
        <Text
          style={{
            fontFamily: "Noontree-Bold",
            fontSize: 28,
            lineHeight: 32,
            letterSpacing: -0.4,
            color: shell.textPrimary,
            marginTop: space["20"],
          }}
        >
          Patterns are on the way
        </Text>
        <Text
          style={{
            fontFamily: "Noontree-Medium",
            fontSize: 16,
            lineHeight: 24,
            color: shell.textSecondary,
            marginTop: space["8"],
            maxWidth: 480,
            textAlign: "center",
          }}
        >
          We're documenting recurring flows — empty states, onboarding, checkout, error recovery —
          so teams can compose screens from primitives without re-inventing the layout.
        </Text>
        <View
          style={{
            marginTop: space["20"],
            paddingHorizontal: space["12"],
            paddingVertical: space["6"],
            borderRadius: radius.rounded,
            backgroundColor: colour.surface["yellow-subtle"],
            borderWidth: 1,
            borderColor: colour.surface["brand-primary"],
          }}
        >
          <Text
            style={{
              fontFamily: "Noontree-SemiBold",
              fontSize: 11,
              lineHeight: 16,
              textTransform: "uppercase",
              letterSpacing: 0.6,
              // The yellow-subtle chip stays light-toned in both themes, so
              // its text is always anchored to the light-mode primary token.
              color: colour["text-n-icon"].primary,
            }}
          >
            In progress
          </Text>
        </View>
      </View>
    </PageScaffold>
  );
}
