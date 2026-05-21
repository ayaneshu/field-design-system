import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
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
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { colour, motion, radius, space, textStyles } from "@field-ds/tokens";

import { fieldEasingStandard } from "../fieldMotion";

// Figma: M-InputTextarea (1092:212)
//   Multi-line input with an external label. State derived from focus,
//   value, error, and disabled — never accepted as a prop.

const DEFAULT_MIN_HEIGHT = 180;
const BORDER_RADIUS = radius["12"];
const HELPER_GAP = space["6"];

// Web-only style additions to suppress the browser's default focus outline
// (typed loosely so RN's TS doesn't reject the unknown keys).
const WEB_INPUT_RESET: Record<string, string | number> =
  Platform.OS === "web"
    ? {
        outlineStyle: "none",
        outlineWidth: 0,
        outlineColor: "transparent",
        caretColor: colour.surface["action-bold"],
      }
    : {};

export type InputTextareaProps = {
  value?: string;
  defaultValue?: string;
  onChangeText?: (next: string) => void;

  label?: string;
  required?: boolean;

  helperText?: string;
  showHelperText?: boolean;
  showCounter?: boolean;
  maxLength?: number;

  error?: boolean | string;
  disabled?: boolean;

  numberOfLines?: number;
  minHeight?: number;
  maxHeight?: number;

  placeholder?: string;
  autoFocus?: boolean;
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  returnKeyType?: TextInputProps["returnKeyType"];
  onSubmitEditing?: TextInputProps["onSubmitEditing"];

  accessibilityLabel?: string;
  accessibilityHint?: string;

  style?: StyleProp<ViewStyle>;
};

/**
 * M-InputTextarea — multi-line text input.
 *
 *   <InputTextarea label="Notes" placeholder="Anything for the rider…" />
 *   <InputTextarea label="Review" maxLength={200} showCounter showHelperText
 *                  helperText="Tell us how it went." />
 */
export const InputTextarea = forwardRef<TextInput, InputTextareaProps>(
  function InputTextarea(props, ref) {
    const {
      value: controlledValue,
      defaultValue = "",
      onChangeText,
      label,
      required = false,
      helperText,
      showHelperText = false,
      showCounter = false,
      maxLength,
      error = false,
      disabled = false,
      numberOfLines = 6,
      minHeight = DEFAULT_MIN_HEIGHT,
      maxHeight,
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

    const focusProgress = useSharedValue(isFocused ? 1 : 0);
    const reducedMotion = useReducedMotion();

    useEffect(() => {
      focusProgress.value = withTiming(isFocused ? 1 : 0, {
        duration: reducedMotion ? 0 : motion.duration.sm,
        easing: fieldEasingStandard,
      });
    }, [isFocused, reducedMotion, focusProgress]);

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
          hasError ? colour.surface["error-bold"] : colour.border.medium,
          colour.border.primary,
        ],
      );
      return { borderColor: c };
    });

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

    const a11yLabel =
      accessibilityLabel ??
      (label
        ? errorText
          ? `${label}, error: ${errorText}`
          : label
        : undefined);

    const fieldBg = disabled ? colour.surface.muted : colour.surface.primary;

    const labelColour = hasError
      ? colour["text-n-icon"].error
      : disabled
        ? colour["text-n-icon"].muted
        : isFocused
          ? colour["text-n-icon"].primary
          : colour["text-n-icon"].secondary;

    const valueTextColour = disabled
      ? colour["text-n-icon"].muted
      : colour["text-n-icon"].primary;

    const helperColour = hasError
      ? colour["text-n-icon"].error
      : disabled
        ? colour["text-n-icon"].muted
        : colour["text-n-icon"].tertiary;

    const helperVisible = showHelperText && (!!helperText || !!errorText);
    const counterVisible = showCounter && typeof maxLength === "number";
    const counterText = counterVisible
      ? `${value.length}/${maxLength}`
      : undefined;

    return (
      <View
        style={[styles.root, style]}
        // @ts-expect-error — dataSet on web only
        dataSet={{ component: "InputTextarea" }}
      >
        {!!label && (
          <View style={styles.labelRow}>
            <Text
              style={[textStyles.Body_B12_Medium, { color: labelColour }]}
              numberOfLines={1}
            >
              {label}
            </Text>
            {required && (
              <Text
                style={[
                  textStyles.Body_B12_Medium,
                  {
                    color: colour["text-n-icon"].error,
                    marginLeft: space["2"],
                  },
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
              {
                minHeight,
                maxHeight,
                backgroundColor: fieldBg,
              },
              borderStyle,
            ]}
          >
            <TextInput
              ref={innerRef}
              value={value}
              onChangeText={handleChangeText}
              onFocus={handleFocus}
              onBlur={handleBlur}
              editable={!disabled}
              autoFocus={autoFocus}
              maxLength={maxLength}
              multiline
              numberOfLines={numberOfLines}
              scrollEnabled={!disabled}
              textAlignVertical="top"
              placeholder={placeholder}
              placeholderTextColor={colour["text-n-icon"].muted}
              selectionColor={colour.surface["action-bold"]}
              cursorColor={colour.surface["action-bold"]}
              accessibilityLabel={a11yLabel}
              accessibilityHint={accessibilityHint}
              accessibilityState={{ disabled }}
              style={[
                styles.input,
                hasValue
                  ? textStyles.Body_B14_Medium
                  : textStyles.Body_B14_Regular,
                { color: valueTextColour },
                WEB_INPUT_RESET,
              ]}
              {...inputProps}
            />
          </Animated.View>
        </Pressable>

        {(helperVisible || counterVisible) && (
          <View style={styles.helperRow}>
            {helperVisible ? (
              <Text
                style={[
                  textStyles.Body_B12_Regular,
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
                  textStyles.Body_B11_Regular,
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
  },
);

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
    borderWidth: 1,
    borderRadius: BORDER_RADIUS,
    paddingHorizontal: space["16"],
    paddingVertical: space["14"],
  },
  input: {
    flex: 1,
    padding: 0,
    margin: 0,
    minWidth: 0,
    textAlignVertical: "top",
  },
  helperRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
});
