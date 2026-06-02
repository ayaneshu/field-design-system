import { Text, View } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

/**
 * Floating pill that announces a copy. Sits above the bottom tab bar.
 * Pointer-events:none so it never blocks taps.
 */
export function CopyToast({ message }: { message: string | null }) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        bottom: 32,
        left: 0,
        right: 0,
        alignItems: "center",
      }}
    >
      {message ? (
        <Animated.View
          entering={FadeInDown.duration(180)}
          exiting={FadeOutDown.duration(160)}
          style={{
            backgroundColor: colour.surface["primary-inverted"],
            paddingHorizontal: space["16"],
            paddingVertical: space["12"],
            borderRadius: radius.rounded,
            flexDirection: "row",
            alignItems: "center",
            gap: space["6"],
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <Text style={[textStyles.B12_SemiBold, { color: colour["text-n-icon"]["on-surface-bold"] }]}>
            Copied
          </Text>
          <Text
            style={[
              textStyles.B12_SemiBold,
              { color: colour["text-n-icon"]["on-surface-bold"], opacity: 0.7 },
            ]}
          >
            {message}
          </Text>
        </Animated.View>
      ) : null}
    </View>
  );
}
