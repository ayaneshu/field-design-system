import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";

import { noontreeFonts } from "@field-ds/fonts";
import { Icon, iconNames, type IconName } from "@field-ds/icons";
import {
  base,
  colour,
  space,
  textStyles,
  type TextStyleName,
} from "@field-ds/tokens";

type Tab = "Colors" | "Typography" | "Icons";

export default function App() {
  const [loaded] = useFonts(noontreeFonts);
  const [tab, setTab] = useState<Tab>("Colors");

  if (!loaded) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colour.surface.primary, paddingTop: 56 }}>
      <StatusBar style="dark" />
      <Text style={[textStyles.Heading_H24_Bold, { paddingHorizontal: space["20"], color: colour["text-n-icon"].primary }]}>
        Field DS Playground
      </Text>
      <View style={{ flexDirection: "row", padding: space["12"], gap: space["8"] }}>
        {(["Colors", "Typography", "Icons"] as Tab[]).map((t) => {
          const active = tab === t;
          return (
            <Pressable
              key={t}
              onPress={() => setTab(t)}
              style={{
                paddingHorizontal: space["12"],
                paddingVertical: space["8"],
                borderRadius: 999,
                backgroundColor: active ? colour["text-n-icon"].primary : colour.surface.secondary,
              }}
            >
              <Text
                style={[
                  textStyles.Action_A14_SemiBold,
                  { color: active ? colour["text-n-icon"]["on-surface-bold"] : colour["text-n-icon"].primary },
                ]}
              >
                {t}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <ScrollView contentContainerStyle={{ padding: space["20"], paddingBottom: 80 }}>
        {tab === "Colors" && <ColorsView />}
        {tab === "Typography" && <TypographyView />}
        {tab === "Icons" && <IconsView />}
      </ScrollView>
    </View>
  );
}

function ColorsView() {
  const palettes = Object.entries(base.colour);
  return (
    <View style={{ gap: space["20"] }}>
      {palettes.map(([name, shades]) => (
        <View key={name}>
          <Text style={[textStyles.Heading_H16_Bold, { color: colour["text-n-icon"].primary, marginBottom: space["8"] }]}>
            {name}
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space["6"] }}>
            {Object.entries(shades).map(([shade, hex]) => (
              <View key={shade} style={{ width: 64, alignItems: "center" }}>
                <View style={{ width: 56, height: 56, borderRadius: 8, backgroundColor: hex as string, borderWidth: 1, borderColor: colour.border.primary }} />
                <Text style={[textStyles.Body_B11_Regular, { color: colour["text-n-icon"].secondary, marginTop: 2 }]}>{shade}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

function TypographyView() {
  const samples: TextStyleName[] = [
    "Heading_H40_Bold",
    "Heading_H32_Bold",
    "Heading_H24_Bold",
    "Heading_H18_Bold",
    "Body_B16_Regular",
    "Body_B14_Regular",
    "Action_A16_SemiBold",
    "Action_A14_Bold",
  ];
  return (
    <View style={{ gap: space["16"] }}>
      {samples.map((name) => (
        <View key={name}>
          <Text style={[textStyles.Body_B11_Regular, { color: colour["text-n-icon"].tertiary, marginBottom: 2 }]}>{name}</Text>
          <Text style={[textStyles[name], { color: colour["text-n-icon"].primary }]}>The quick brown fox</Text>
        </View>
      ))}
    </View>
  );
}

function IconsView() {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space["12"] }}>
      {iconNames.map((n: IconName) => (
        <View key={n} style={{ alignItems: "center", width: 84 }}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 8,
              backgroundColor: colour.surface.secondary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name={n} size={24} color={colour["text-n-icon"].primary} />
          </View>
          <Text
            style={[
              textStyles.Body_B11_Regular,
              { color: colour["text-n-icon"].tertiary, textAlign: "center", marginTop: 4 },
            ]}
            numberOfLines={2}
          >
            {n}
          </Text>
        </View>
      ))}
    </View>
  );
}
