import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type StyleProp,
  type TextInputFocusEventData,
  type TextInputProps,
  type TextInputSubmitEditingEventData,
  type ViewStyle,
} from "react-native";

import { Icon } from "@field-ds/icons";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

// Figma: M-SearchBar (892:244)
//   H48 (full-size, 24px icons) for home/category screens; H44 (compact,
//   20px icons) for PDP back-headers. Visual state (Placeholder / Active /
//   Typing / Typed) is derived from focus + value — matches InputText.

export type SearchBarSize = "H48" | "H44";

export type SearchBarProps = {
  value?: string;
  defaultValue?: string;
  onChangeText?: (next: string) => void;

  onSubmit?: (value: string) => void;
  onClear?: () => void;
  showClearButton?: boolean;

  size?: SearchBarSize;
  elevation?: boolean;
  placeholder?: string;

  iconLeft?: ReactNode | null;
  iconRight?: ReactNode;
  iconRightTwo?: ReactNode;

  autoFocus?: boolean;
  editable?: boolean;
  returnKeyType?: TextInputProps["returnKeyType"];
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  autoCorrect?: TextInputProps["autoCorrect"];
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;

  accessibilityLabel?: string;
  accessibilityHint?: string;

  style?: StyleProp<ViewStyle>;
};

export type SearchBarRef = TextInput;

const DEFAULT_PLACEHOLDER = "Search for your building, area...";

const SIZE_SPEC = {
  H48: {
    height: 48,
    minWidth: 320,
    paddingVertical: space["12"],
    paddingHorizontal: space["12"],
    iconSize: 24,
    textStyle: textStyles.Body_B14_Medium,
  },
  H44: {
    height: 44,
    minWidth: 280,
    paddingVertical: space["10"],
    paddingHorizontal: space["12"],
    iconSize: 20,
    textStyle: textStyles.Body_B12_Medium,
  },
} as const;

// Sm elevation from Figma: 0 1px 1.5px rgba(14,14,14,0.07).
const ELEVATION_STYLE = Platform.select<ViewStyle>({
  ios: {
    shadowColor: "#0E0E0E",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1.5,
  },
  android: {
    elevation: 1,
  },
  default: {
    // Web — RN-Web maps shadow* to box-shadow.
    shadowColor: "#0E0E0E",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1.5,
  },
});

// Suppress the browser's default focus outline on web (matches InputText).
const WEB_INPUT_RESET: Record<string, string | number> =
  Platform.OS === "web"
    ? {
        outlineStyle: "none",
        outlineWidth: 0,
        outlineColor: "transparent",
        caretColor: colour.surface["action-bold"],
      }
    : {};

/**
 * M-SearchBar — single-line search input.
 *
 *   <SearchBar onSubmit={runSearch} />
 *   <SearchBar size="H44" iconLeft={<Icon name="system-arrow-left" size={20} />}
 *              iconRight={<Icon name="system-camera" size={20} />} />
 *   <SearchBar elevation iconRight={<FilterIcon />} iconRightTwo={<MicIcon />} />
 *
 * Visual state is derived from focus + value — never accepted as a prop.
 */
export const SearchBar = forwardRef<SearchBarRef, SearchBarProps>(
  function SearchBar(props, ref) {
    const {
      value: controlledValue,
      defaultValue = "",
      onChangeText,
      onSubmit,
      onClear,
      showClearButton = true,
      size = "H48",
      elevation = false,
      placeholder = DEFAULT_PLACEHOLDER,
      iconLeft,
      iconRight,
      iconRightTwo,
      autoFocus,
      editable = true,
      returnKeyType = "search",
      autoCapitalize = "none",
      autoCorrect = false,
      onFocus,
      onBlur,
      accessibilityLabel,
      accessibilityHint,
      style,
      ...inputProps
    } = props;

    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const value = isControlled ? controlledValue : internalValue;

    const innerRef = useRef<TextInput>(null);
    useImperativeHandle(ref, () => innerRef.current as TextInput);

    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value.length > 0;
    const spec = SIZE_SPEC[size];

    const handleFocus = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setIsFocused(true);
        onFocus?.(e);
      },
      [onFocus],
    );

    const handleBlur = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setIsFocused(false);
        onBlur?.(e);
      },
      [onBlur],
    );

    const handleChangeText = useCallback(
      (next: string) => {
        if (!isControlled) setInternalValue(next);
        onChangeText?.(next);
      },
      [isControlled, onChangeText],
    );

    const handleSubmit = useCallback(
      (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
        onSubmit?.(e.nativeEvent.text);
      },
      [onSubmit],
    );

    const handleClear = useCallback(() => {
      if (!isControlled) setInternalValue("");
      onChangeText?.("");
      onClear?.();
      innerRef.current?.focus();
    }, [isControlled, onChangeText, onClear]);

    const focusInput = () => {
      if (editable) innerRef.current?.focus();
    };

    // ─────────── Slot resolution ───────────

    const resolvedIconLeft =
      iconLeft === null
        ? null
        : iconLeft ?? (
            <Icon
              name="system-search"
              size={spec.iconSize}
              color={
                hasValue || isFocused
                  ? colour["text-n-icon"].primary
                  : colour["text-n-icon"].tertiary
              }
            />
          );

    const showAutoClear =
      iconRight === undefined && hasValue && showClearButton && editable;

    const resolvedIconRight = showAutoClear ? (
      <Pressable
        onPress={handleClear}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Clear search"
        style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
      >
        <Icon
          name="system-cross"
          size={spec.iconSize}
          color={colour["text-n-icon"].tertiary}
        />
      </Pressable>
    ) : (
      iconRight
    );

    const showDivider = !!iconRightTwo;

    // ─────────── Text colour ───────────

    const textColour = hasValue
      ? colour["text-n-icon"].primary
      : isFocused
        ? colour["text-n-icon"].tertiary
        : colour["text-n-icon"].primary;

    return (
      <Pressable
        onPress={focusInput}
        accessible={false}
        // @ts-expect-error — web-only style hook on Pressable
        style={Platform.OS === "web" ? { cursor: editable ? "text" : "default" } : undefined}
      >
        <View
          style={[
            styles.container,
            {
              height: spec.height,
              minWidth: spec.minWidth,
              paddingVertical: spec.paddingVertical,
              paddingHorizontal: spec.paddingHorizontal,
            },
            elevation ? ELEVATION_STYLE : null,
            style,
          ]}
          // @ts-expect-error — dataSet on web only
          dataSet={{ component: "SearchBar", size }}
        >
          {resolvedIconLeft != null && (
            <View
              style={[
                styles.slot,
                { width: spec.iconSize, height: spec.iconSize },
              ]}
            >
              {resolvedIconLeft}
            </View>
          )}

          <TextInput
            ref={innerRef}
            value={value}
            onChangeText={handleChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onSubmitEditing={handleSubmit}
            editable={editable}
            autoFocus={autoFocus}
            placeholder={placeholder}
            placeholderTextColor={
              isFocused
                ? colour["text-n-icon"].tertiary
                : colour["text-n-icon"].primary
            }
            selectionColor={colour.surface["action-bold"]}
            cursorColor={colour.surface["action-bold"]}
            returnKeyType={returnKeyType}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            accessibilityLabel={accessibilityLabel ?? placeholder}
            accessibilityHint={accessibilityHint}
            accessibilityRole="search"
            accessibilityState={{ disabled: !editable }}
            style={[
              styles.input,
              spec.textStyle,
              { color: textColour, textAlignVertical: "center" },
              WEB_INPUT_RESET,
            ]}
            {...inputProps}
          />

          {resolvedIconRight != null && (
            <View
              style={[
                styles.slot,
                { width: spec.iconSize, height: spec.iconSize },
              ]}
            >
              {resolvedIconRight}
            </View>
          )}

          {showDivider && <View style={styles.divider} />}

          {iconRightTwo != null && (
            <View
              style={[
                styles.slot,
                { width: spec.iconSize, height: spec.iconSize },
              ]}
            >
              {iconRightTwo}
            </View>
          )}
        </View>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: space["8"],
    backgroundColor: colour.surface.primary,
    borderWidth: 1,
    borderColor: colour.border.subtle,
    borderRadius: radius["12"],
  },
  slot: {
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    minWidth: 0,
    padding: 0,
    margin: 0,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: colour.border.subtle,
  },
});
