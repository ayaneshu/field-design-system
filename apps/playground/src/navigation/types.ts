export type FoundationsSection =
  | "colors"
  | "icons"
  | "motion"
  | "radius"
  | "spacing"
  | "typography";

export type RootStackParamList = {
  Home: undefined;
  Foundations: { section?: FoundationsSection } | undefined;
  Components: undefined;
  Patterns: undefined;
  Install: undefined;
  INeed: undefined;
  INeedRequests: undefined;
  Illustrations: undefined;
  Accordion: undefined;
  ActionBar: undefined;
  BottomSheet: undefined;
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
  NeutralTextButton: undefined;
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
  Toast: undefined;
};
