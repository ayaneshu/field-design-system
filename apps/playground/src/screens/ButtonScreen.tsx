import { useState, type ReactNode } from "react";
import { View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from "@field-ds/components";
import type { IconName } from "@field-ds/icons";
import { space } from "@field-ds/tokens";

import { DetailSection, PageScaffold } from "../components/PageScaffold";
import { IconPicker } from "../components/IconPicker";
import {
  PreviewSurface,
  PropLabel,
  PropList,
  PropRow,
  SectionLabel,
  SegmentedControl,
  Toggle,
} from "../components/playground-controls";
import { componentsSidebar } from "../navigation/sidebars";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Button">;

const VARIANTS: ButtonVariant[] = [
  "primary",
  "secondary",
  "secondary-neutral",
  "neutral",
];
const SIZES: ButtonSize[] = ["H56", "H52", "H48", "H40", "H36", "H32"];

/**
 * Rectangular text+icon Button — Primary, Secondary, Secondary-Neutral,
 * Neutral. Owns its own playground; the round / text / icon button families
 * live on their own dedicated screens so each one gets a focused doc page.
 */
export function ButtonScreen({ navigation }: Props) {
  const [variant, setVariant] = useState<ButtonVariant>("primary");
  const [size, setSize] = useState<ButtonSize>("H56");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [iconLeft, setIconLeft] = useState<IconName | null>(null);
  const [iconRight, setIconRight] = useState<IconName | null>(null);

  const playgroundPreview = (
    <PreviewSurface tall>
      <Button
        label="Continue"
        variant={variant}
        size={size}
        loading={loading}
        disabled={disabled}
        iconLeft={iconLeft ?? undefined}
        iconRight={iconRight ?? undefined}
      />
    </PreviewSurface>
  );

  const variantsPreview = (
    <View style={{ gap: space["20"] }}>
      {VARIANTS.map((v) => (
        <PreviewSurface key={v}>
          <SectionLabel>{v}</SectionLabel>
          <Row>
            <Button label="Default" variant={v} />
            <Button label="With icon" variant={v} iconLeft="system-plus" />
            <Button label="Loading" variant={v} loading />
            <Button label="Disabled" variant={v} disabled />
          </Row>
        </PreviewSurface>
      ))}
    </View>
  );

  const sizesPreview = (
    <View style={{ gap: space["20"] }}>
      {SIZES.map((s) => {
        // H32 only ships on the neutral variant per Figma.
        const v: ButtonVariant = s === "H32" ? "neutral" : "primary";
        return (
          <PreviewSurface key={s}>
            <SectionLabel>{s}</SectionLabel>
            <Row>
              <Button label="Continue" variant={v} size={s} />
              <Button
                label="Continue"
                variant={v}
                size={s}
                iconLeft="system-plus"
              />
              <Button label="Continue" variant={v} size={s} loading />
              <Button label="Continue" variant={v} size={s} disabled />
            </Row>
          </PreviewSurface>
        );
      })}
    </View>
  );

  return (
    <PageScaffold
      topNavActive="Components"
      title="button"
      subtitle="Rectangular text+icon CTAs for primary, secondary, and supportive actions across noon flows. Four variants × six heights × default / pressed / loader / disabled states."
      version="V0.1"
      repoUrl="https://github.com/ayaneshu/field-design-system/tree/main/packages/components/src/Button/Button.tsx"
      sidebar={componentsSidebar("Button")}
      onSidebarSelect={(key) => {
        if (key === "all") navigation.navigate("Components" as never);
        else navigation.navigate(key as never);
      }}
    >
      <DetailSection
        heading="Playground"
        preview={playgroundPreview}
        spacingTop={0}
      >
        <PropList>
          <PropRow>
            <PropLabel>Variant</PropLabel>
            <SegmentedControl
              options={VARIANTS}
              value={variant}
              onChange={setVariant}
            />
          </PropRow>
          <PropRow>
            <PropLabel>Size</PropLabel>
            <SegmentedControl options={SIZES} value={size} onChange={setSize} />
          </PropRow>
          <PropRow>
            <PropLabel>Icon left</PropLabel>
            <IconPicker value={iconLeft} onChange={setIconLeft} />
          </PropRow>
          <PropRow>
            <PropLabel>Icon right</PropLabel>
            <IconPicker value={iconRight} onChange={setIconRight} />
          </PropRow>
          <PropRow>
            <PropLabel>Loading</PropLabel>
            <Toggle value={loading} onValueChange={setLoading} />
          </PropRow>
          <PropRow last>
            <PropLabel>Disabled</PropLabel>
            <Toggle value={disabled} onValueChange={setDisabled} />
          </PropRow>
        </PropList>
      </DetailSection>

      <DetailSection heading="Variants" preview={variantsPreview} />
      <DetailSection heading="Sizes" preview={sizesPreview} />
    </PageScaffold>
  );
}

function Row({ children }: { children: ReactNode }) {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: space["12"],
        alignItems: "center",
      }}
    >
      {children}
    </View>
  );
}
