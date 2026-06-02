import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type StyleProp,
  type TextInputFocusEventData,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { colour, motion, radius, space, textStyles } from "@field-ds/tokens";

import { fieldEasingStandard } from "../fieldMotion";

// Figma: M-InputText (1102:164105)
//   Three label modes × six derived states. State is derived from focus,
//   value, error, and disabled — never accepted as a prop.

const FIELD_HEIGHT = 48;
const INLINE_FIELD_HEIGHT = 56;
const BORDER_RADIUS = radius["12"];
const HELPER_GAP = space["6"];

// Inline-mode geometry — used to centre the label-as-placeholder at rest
// (lift=0) and lift it to the top of the field on focus / fill (lift=1).
const INLINE_PADDING_Y = space["8"]; // 8 + 8 = 16 vertical padding
const INLINE_CONTENT_HEIGHT = INLINE_FIELD_HEIGHT - INLINE_PADDING_Y * 2; // 40
const INLINE_LABEL_REST_TOP = (INLINE_CONTENT_HEIGHT - 18) / 2; // 11
const INLINE_LABEL_LIFT_TOP = 0;
const INLINE_INPUT_HEIGHT = 18;

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

// Web-only style additions used to suppress the browser's default focus
// outline (typed loosely so RN's TS doesn't reject the unknown keys).
const WEB_INPUT_RESET: Record<string, string | number> =
  Platform.OS === "web"
    ? {
        outlineStyle: "none",
        outlineWidth: 0,
        outlineColor: "transparent",
        caretColor: colour.surface["action-bold"],
      }
    : {};

export type InputTextLabelMode = "external" | "inline" | "none";

export type InputTextProps = {
  value?: string;
  defaultValue?: string;
  onChangeText?: (next: string) => void;

  label?: string;
  labelMode?: InputTextLabelMode;
  required?: boolean;

  helperText?: string;
  showHelperText?: boolean;
  showCounter?: boolean;
  maxLength?: number;

  leftSlot?: ReactNode;
  rightSlot?: ReactNode;

  error?: boolean | string;
  disabled?: boolean;

  placeholder?: string;
  autoFocus?: boolean;
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  autoCorrect?: TextInputProps["autoCorrect"];
  secureTextEntry?: TextInputProps["secureTextEntry"];
  returnKeyType?: TextInputProps["returnKeyType"];
  onSubmitEditing?: TextInputProps["onSubmitEditing"];

  accessibilityLabel?: string;
  accessibilityHint?: string;

  style?: StyleProp<ViewStyle>;
};

/**
 * M-InputText — single-line text input.
 *
 *   <InputText label="Email" placeholder="you@noon.com" />
 *   <InputText labelMode="inline" label="Phone" />
 *   <InputText label="Password" secureTextEntry showHelperText
 *              helperText="At least 8 characters" />
 *
 * State (Resting / Active / Typing / Filled / Error / Disabled) is derived
 * from focus + value + the `error` / `disabled` props — never set directly.
 * Tapping anywhere in the field focuses the input.
 */
export const InputText = forwardRef<TextInput, InputTextProps>(function InputText(
  props,
  ref,
) {
  const {
    value: controlledValue,
    defaultValue = "",
    onChangeText,
    label,
    labelMode = "external",
    required = false,
    helperText,
    showHelperText = false,
    showCounter = false,
    maxLength,
    leftSlot,
    rightSlot,
    error = false,
    disabled = false,
    placeholder,
    autoFocus,
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
  const hasError = !!error;
  const errorText = typeof error === "string" ? error : undefined;
  const hasValue = value.length > 0;
  const isInline = labelMode === "inline";

  const focusProgress = useSharedValue(isFocused ? 1 : 0);
  // Inline label "lift" is driven by focus OR value (so a filled inline input
  // keeps its label on top after blur).
  const liftProgress = useSharedValue(isFocused || hasValue ? 1 : 0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    focusProgress.value = withTiming(isFocused ? 1 : 0, {
      duration: reducedMotion ? 0 : motion.duration.sm,
      easing: fieldEasingStandard,
    });
  }, [isFocused, reducedMotion, focusProgress]);

  useEffect(() => {
    liftProgress.value = withTiming(isFocused || hasValue ? 1 : 0, {
      duration: reducedMotion ? 0 : motion.duration.base,
      easing: fieldEasingStandard,
    });
  }, [isFocused, hasValue, reducedMotion, liftProgress]);

  // Border colour: error > disabled > active (focus) > resting.
  const borderDriver = useDerivedValue(() => {
    if (hasError) return 1;
    if (disabled) return 2;
    return focusProgress.value;
  }, [hasError, disabled]);

  const borderStyle = useAnimatedStyle(() => {
    const c = interpolateColor(
      borderDriver.value,
      [0, 1, 2],
      [
        colour.border.primary,
        hasError
          ? colour.surface["error-bold"]
          : colour.border.medium,
        colour.border.primary,
      ],
    );
    return { borderColor: c };
  });

  // Inline floating label — animates fontSize + top in tandem.
  const inlineLabelStyle = useAnimatedStyle(() => {
    const fontSize = interpolate(liftProgress.value, [0, 1], [14, 11]);
    const lineHeight = interpolate(liftProgress.value, [0, 1], [18, 14]);
    const top = interpolate(
      liftProgress.value,
      [0, 1],
      [INLINE_LABEL_REST_TOP, INLINE_LABEL_LIFT_TOP],
    );
    return { fontSize, lineHeight, top };
  });

  // Input is invisible at rest in inline mode — fades in as the label lifts.
  const inlineInputContainerStyle = useAnimatedStyle(() => ({
    opacity: liftProgress.value,
  }));

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

  const focusInput = () => {
    if (!disabled) innerRef.current?.focus();
  };

  // ─────────── Derived visuals ───────────

  const a11yLabel =
    accessibilityLabel ??
    (label ? (errorText ? `${label}, error: ${errorText}` : label) : undefined);

  const fieldBg = disabled ? colour.surface.muted : colour.surface.primary;
  const fieldHeight = isInline ? INLINE_FIELD_HEIGHT : FIELD_HEIGHT;
  const fieldPaddingY = isInline ? INLINE_PADDING_Y : space["12"];

  const externalLabelColour = hasError
    ? colour["text-n-icon"].error
    : disabled
      ? colour["text-n-icon"].muted
      : isFocused
        ? colour["text-n-icon"].primary
        : colour["text-n-icon"].secondary;

  const inlineLabelColour = hasError
    ? colour["text-n-icon"].error
    : disabled
      ? colour["text-n-icon"].muted
      : isFocused || hasValue
        ? colour["text-n-icon"].secondary
        : colour["text-n-icon"].muted;

  const valueTextColour = disabled
    ? colour["text-n-icon"].muted
    : colour["text-n-icon"].primary;

  const helperColour = hasError
    ? colour["text-n-icon"].error
    : disabled
      ? colour["text-n-icon"].muted
      : colour["text-n-icon"].tertiary;

  const showLabelRow = labelMode === "external" && !!label;
  const showInlineLabel = isInline && !!label;
  const helperVisible = showHelperText && (!!helperText || !!errorText);
  const counterVisible = showCounter && typeof maxLength === "number";
  const counterText = counterVisible ? `${value.length}/${maxLength}` : undefined;

  // Inline mode swallows the native placeholder — the floating label IS the
  // placeholder until it lifts.
  const effectivePlaceholder = isInline ? "" : placeholder;

  // ─────────── Render ───────────

  return (
    <View
      style={[styles.root, style]}
      // @ts-expect-error — dataSet on web only
      dataSet={{ component: "InputText", labelMode }}
    >
      {showLabelRow && (
        <View style={styles.labelRow}>
          <Text
            style={[
              textStyles.B12_Medium,
              { color: externalLabelColour },
            ]}
            numberOfLines={1}
          >
            {label}
          </Text>
          {required && (
            <Text
              style={[
                textStyles.B12_Medium,
                { color: colour["text-n-icon"].error, marginLeft: space["2"] },
              ]}
            >
              *
            </Text>
          )}
        </View>
      )}

      <Pressable
        onPress={focusInput}
        disabled={disabled}
        accessible={false}
        // @ts-expect-error — web-only style hook on Pressable
        style={Platform.OS === "web" ? { cursor: disabled ? "default" : "text" } : undefined}
      >
        <Animated.View
          style={[
            styles.field,
            isInline ? styles.fieldInline : styles.fieldRow,
            {
              height: fieldHeight,
              paddingVertical: fieldPaddingY,
              backgroundColor: fieldBg,
            },
            borderStyle,
          ]}
        >
          {leftSlot ? <View style={styles.slot}>{leftSlot}</View> : null}

          {isInline ? (
            <View style={styles.inlineContent}>
              {showInlineLabel && (
                <Animated.Text
                  numberOfLines={1}
                  style={[
                    styles.inlineFloatLabel,
                    {
                      fontFamily: "Noontree-Medium",
                      fontWeight: "500",
                      letterSpacing: -0.1,
                      color: inlineLabelColour,
                    },
                    inlineLabelStyle,
                  ]}
                >
                  {label}
                  {required ? (
                    <Text style={{ color: colour["text-n-icon"].error }}>
                      {" "}*
                    </Text>
                  ) : null}
                </Animated.Text>
              )}

              <Animated.View
                style={[styles.inlineInputWrapper, inlineInputContainerStyle]}
                pointerEvents={isFocused || hasValue ? "auto" : "none"}
              >
                <AnimatedTextInput
                  ref={innerRef}
                  value={value}
                  onChangeText={handleChangeText}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  editable={!disabled}
                  autoFocus={autoFocus}
                  maxLength={maxLength}
                  placeholder={effectivePlaceholder}
                  placeholderTextColor={colour["text-n-icon"].muted}
                  selectionColor={colour.surface["action-bold"]}
                  cursorColor={colour.surface["action-bold"]}
                  accessibilityLabel={a11yLabel}
                  accessibilityHint={accessibilityHint}
                  accessibilityState={{ disabled }}
                  style={[
                    styles.input,
                    { height: INLINE_INPUT_HEIGHT },
                    hasValue
                      ? textStyles.B14_SemiBold
                      : textStyles.B14_Regular,
                    { color: valueTextColour },
                    WEB_INPUT_RESET,
                  ]}
                  {...inputProps}
                />
              </Animated.View>
            </View>
          ) : (
            <AnimatedTextInput
              ref={innerRef}
              value={value}
              onChangeText={handleChangeText}
              onFocus={handleFocus}
              onBlur={handleBlur}
              editable={!disabled}
              autoFocus={autoFocus}
              maxLength={maxLength}
              placeholder={effectivePlaceholder}
              placeholderTextColor={colour["text-n-icon"].muted}
              selectionColor={colour.surface["action-bold"]}
              cursorColor={colour.surface["action-bold"]}
              accessibilityLabel={a11yLabel}
              accessibilityHint={accessibilityHint}
              accessibilityState={{ disabled }}
              style={[
                styles.input,
                hasValue
                  ? textStyles.B14_Medium
                  : textStyles.B14_Regular,
                { color: valueTextColour, textAlignVertical: "center" },
                WEB_INPUT_RESET,
              ]}
              {...inputProps}
            />
          )}

          {rightSlot ? <View style={styles.slot}>{rightSlot}</View> : null}
        </Animated.View>
      </Pressable>

      {(helperVisible || counterVisible) && (
        <View style={styles.helperRow}>
          {helperVisible ? (
            <Text
              style={[
                textStyles.B12_Regular,
                { color: helperColour, flex: 1 },
              ]}
            >
              {errorText ?? helperText}
            </Text>
          ) : (
            <View style={{ flex: 1 }} />
          )}
          {counterVisible && (
            <Text
              style={[
                textStyles.B11_Regular,
                {
                  color: colour["text-n-icon"].muted,
                  marginLeft: space["8"],
                },
              ]}
            >
              {counterText}
            </Text>
          )}
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    width: "100%",
    minWidth: 320,
    gap: HELPER_GAP,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  field: {
    flexDirection: "row",
    gap: space["8"],
    borderWidth: 1,
    borderRadius: BORDER_RADIUS,
    paddingHorizontal: space["16"],
  },
  fieldRow: {
    alignItems: "center",
  },
  fieldInline: {
    alignItems: "stretch",
  },
  inlineContent: {
    flex: 1,
    minWidth: 0,
    position: "relative",
  },
  inlineFloatLabel: {
    position: "absolute",
    left: 0,
    right: 0,
    // Don't intercept taps — the parent Pressable / inner TextInput should
    // receive them so a click anywhere in the field focuses the input.
    pointerEvents: "none",
  },
  inlineInputWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  input: {
    flex: 1,
    padding: 0,
    margin: 0,
    minWidth: 0,
  },
  slot: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  helperRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
});
