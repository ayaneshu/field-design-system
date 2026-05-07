export type FoundationsSection =
  | "colors"
  | "icons"
  | "radius"
  | "spacing"
  | "typography";

export type RootStackParamList = {
  Home: undefined;
  Foundations: { section?: FoundationsSection } | undefined;
  Components: undefined;
  Patterns: undefined;
  Illustrations: undefined;
  Accordion: undefined;
  Checkbox: undefined;
  BottomNav: undefined;
  Button: undefined;
  RoundButton: undefined;
  TextButton: undefined;
  IconButton: undefined;
};
