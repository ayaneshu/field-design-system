export type FoundationsSection = "colors" | "typography" | "icons";

export type RootStackParamList = {
  Home: undefined;
  Foundations: { section?: FoundationsSection } | undefined;
  Components: undefined;
  Patterns: undefined;
  Illustrations: undefined;
  Accordion: undefined;
  Checkbox: undefined;
  BottomNav: undefined;
};
