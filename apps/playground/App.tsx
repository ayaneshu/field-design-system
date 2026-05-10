import "react-native-gesture-handler";

import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer, type Theme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { noontreeFonts } from "@field-ds/fonts";
import { colour } from "@field-ds/tokens";

import { HomeScreen } from "./src/screens/HomeScreen";
import { FoundationsScreen } from "./src/screens/FoundationsScreen";
import { ComponentsListScreen } from "./src/screens/ComponentsListScreen";
import { PatternsScreen } from "./src/screens/PatternsScreen";
import { IllustrationsScreen } from "./src/screens/IllustrationsScreen";
import { AccordionScreen } from "./src/screens/AccordionScreen";
import { PrimaryButtonScreen } from "./src/screens/PrimaryButtonScreen";
import { SecondaryButtonScreen } from "./src/screens/SecondaryButtonScreen";
import { SecondaryNeutralButtonScreen } from "./src/screens/SecondaryNeutralButtonScreen";
import { NeutralButtonScreen } from "./src/screens/NeutralButtonScreen";
import { RoundButtonScreen } from "./src/screens/RoundButtonScreen";
import { TextButtonScreen } from "./src/screens/TextButtonScreen";
import { IconButtonScreen } from "./src/screens/IconButtonScreen";
import { CheckboxScreen } from "./src/screens/CheckboxScreen";
import { DividerScreen } from "./src/screens/DividerScreen";
import { FilterChipScreen } from "./src/screens/FilterChipScreen";
import { InfoBannerScreen } from "./src/screens/InfoBannerScreen";
import { BottomNavScreen } from "./src/screens/BottomNavScreen";
import { InputTextScreen } from "./src/screens/InputTextScreen";
import { InputTextareaScreen } from "./src/screens/InputTextareaScreen";
import { ListItemScreen } from "./src/screens/ListItemScreen";
import { PageHeaderScreen } from "./src/screens/PageHeaderScreen";
import { RadioScreen } from "./src/screens/RadioScreen";
import { RatingInputScreen } from "./src/screens/RatingInputScreen";
import { SearchBarScreen } from "./src/screens/SearchBarScreen";
import { SwitchScreen } from "./src/screens/SwitchScreen";
import { ToggleScreen } from "./src/screens/ToggleScreen";
import type { RootStackParamList } from "./src/navigation/types";
import { ThemeProvider, useTheme } from "./src/theme/ThemeContext";

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [loaded] = useFonts(noontreeFonts);
  if (!loaded) return null;

  return (
    <ThemeProvider initial="light">
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ThemedNavigationShell />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

/** Inner shell: reads the theme so the nav theme + status bar can flip. */
function ThemedNavigationShell() {
  const { mode, shell } = useTheme();

  const navTheme: Theme = {
    dark: mode === "dark",
    colors: {
      primary: colour["text-n-icon"].action,
      background: shell.pageBg,
      card: shell.pageBg,
      text: shell.textPrimary,
      border: shell.border,
      notification: colour["text-n-icon"].error,
    },
    fonts: {
      regular: { fontFamily: "Noontree-Regular", fontWeight: "400" },
      medium: { fontFamily: "Noontree-Medium", fontWeight: "500" },
      bold: { fontFamily: "Noontree-Bold", fontWeight: "700" },
      heavy: { fontFamily: "Noontree-ExtraBold", fontWeight: "800" },
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: shell.pageBg },
        }}
      >
        <RootStack.Screen name="Home" component={HomeScreen} />
        <RootStack.Screen name="Foundations" component={FoundationsScreen} />
        <RootStack.Screen name="Components" component={ComponentsListScreen} />
        <RootStack.Screen name="Patterns" component={PatternsScreen} />
        <RootStack.Screen name="Illustrations" component={IllustrationsScreen} />
        <RootStack.Screen name="Accordion" component={AccordionScreen} />
        <RootStack.Screen
          name="PrimaryButton"
          component={PrimaryButtonScreen}
        />
        <RootStack.Screen
          name="SecondaryButton"
          component={SecondaryButtonScreen}
        />
        <RootStack.Screen
          name="SecondaryNeutralButton"
          component={SecondaryNeutralButtonScreen}
        />
        <RootStack.Screen
          name="NeutralButton"
          component={NeutralButtonScreen}
        />
        <RootStack.Screen name="RoundButton" component={RoundButtonScreen} />
        <RootStack.Screen name="TextButton" component={TextButtonScreen} />
        <RootStack.Screen name="IconButton" component={IconButtonScreen} />
        <RootStack.Screen name="Checkbox" component={CheckboxScreen} />
        <RootStack.Screen name="Divider" component={DividerScreen} />
        <RootStack.Screen name="FilterChip" component={FilterChipScreen} />
        <RootStack.Screen
          name="InfoBanner"
          component={InfoBannerScreen}
        />
        <RootStack.Screen name="BottomNav" component={BottomNavScreen} />
        <RootStack.Screen name="InputText" component={InputTextScreen} />
        <RootStack.Screen
          name="InputTextarea"
          component={InputTextareaScreen}
        />
        <RootStack.Screen name="ListItem" component={ListItemScreen} />
        <RootStack.Screen name="PageHeader" component={PageHeaderScreen} />
        <RootStack.Screen name="Radio" component={RadioScreen} />
        <RootStack.Screen name="RatingInput" component={RatingInputScreen} />
        <RootStack.Screen name="SearchBar" component={SearchBarScreen} />
        <RootStack.Screen name="Switch" component={SwitchScreen} />
        <RootStack.Screen name="Toggle" component={ToggleScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
