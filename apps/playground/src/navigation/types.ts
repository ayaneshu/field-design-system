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
  Divider: undefined;
  FilterChip: undefined;
  InfoBanner: undefined;
  BottomNav: undefined;
  PrimaryButton: undefined;
  SecondaryButton: undefined;
  SecondaryNeutralButton: undefined;
  NeutralButton: undefined;
  RoundButton: undefined;
  TextButton: undefined;
  IconButton: undefined;
  InputText: undefined;
  InputTextarea: undefined;
  ListItem: undefined;
  PageHeader: undefined;
  Radio: undefined;
  RatingInput: undefined;
  SearchBar: undefined;
  Switch: undefined;
  Toggle: undefined;
};
