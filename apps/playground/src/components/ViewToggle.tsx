import { View } from "react-native";

import { Switch as FieldSwitch } from "@field-ds/components";

export type ViewMode = "grid" | "list";

/**
 * Grid / List segmented control. Reuses the Field DS `Switch` component
 * (M-Switch) so the playground stays in lockstep with the live design system.
 */
export function ViewToggle({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  return (
    <View style={{ width: 160 }}>
      <FieldSwitch<ViewMode>
        size="H40"
        options={[
          { value: "grid", label: "Grid" },
          { value: "list", label: "List" },
        ]}
        value={value}
        onChange={onChange}
        accessibilityLabel="Switch between grid and list view"
      />
    </View>
  );
}
