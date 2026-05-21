import "react-native-gesture-handler";

import { useEffect } from "react";
import { Platform } from "react-native";
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
import { ActionBarScreen } from "./src/screens/ActionBarScreen";
import { BottomSheetScreen } from "./src/screens/BottomSheetScreen";
import { PrimaryButtonScreen } from "./src/screens/PrimaryButtonScreen";
import { SecondaryButtonScreen } from "./src/screens/SecondaryButtonScreen";
import { SecondaryNeutralButtonScreen } from "./src/screens/SecondaryNeutralButtonScreen";
import { NeutralButtonScreen } from "./src/screens/NeutralButtonScreen";
import { RoundButtonScreen } from "./src/screens/RoundButtonScreen";
import { TextButtonScreen } from "./src/screens/TextButtonScreen";
import { NeutralTextButtonScreen } from "./src/screens/NeutralTextButtonScreen";
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
import { linking } from "./src/navigation/linking";
import type { RootStackParamList } from "./src/navigation/types";
import { ThemeProvider, useTheme } from "./src/theme/ThemeContext";

const RootStack = createNativeStackNavigator<RootStackParamList>();

const SITE_TITLE = "Field Design System";
const SITE_DESCRIPTION =
  "One source of truth from Figma to React Native. Production-ready tokens, components, and patterns curated by noon.";

/**
 * Inject the Field DS brand mark as the browser favicon AND the Open Graph
 * preview metadata on web. Expo's `web.favicon` only ships in production
 * builds; in dev the served HTML template carries no `<link rel="icon">` or
 * `<meta property="og:*">` tags. Files in `public/` are served from the dev
 * root, so we point at `/favicon.svg`, `/favicon.png` and `/og-image.png`
 * here. Idempotent — the effect re-uses existing tags rather than appending
 * duplicates.
 */
function useSiteHead() {
  useEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined") return;
    const ensureLink = (rel: string, href: string, type?: string) => {
      let el = document.querySelector(
        `link[rel="${rel}"]`,
      ) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement("link");
        el.rel = rel;
        document.head.appendChild(el);
      }
      if (type) el.type = type;
      el.href = href;
    };
    const ensureMeta = (key: string, value: string, asProperty = false) => {
      const attr = asProperty ? "property" : "name";
      let el = document.querySelector(
        `meta[${attr}="${key}"]`,
      ) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.content = value;
    };
    // Favicons
    ensureLink("icon", "/favicon.svg", "image/svg+xml");
    ensureLink("alternate icon", "/favicon.png", "image/png");
    ensureLink("apple-touch-icon", "/favicon.png");
    // Page title + description (also helps unfurls when og:* is absent)
    document.title = SITE_TITLE;
    ensureMeta("description", SITE_DESCRIPTION);
    // Absolute URL for the OG image — most unfurlers handle relative paths,
    // but Slack and iMessage canonicalise against the page origin, so we
    // resolve to a full URL when one is available.
    const origin =
      typeof window !== "undefined" && window.location?.origin
        ? window.location.origin
        : "";
    const ogImage = `${origin}/og-image.png`;
    // Open Graph
    ensureMeta("og:title", SITE_TITLE, true);
    ensureMeta("og:description", SITE_DESCRIPTION, true);
    ensureMeta("og:type", "website", true);
    ensureMeta("og:image", ogImage, true);
    ensureMeta("og:image:secure_url", ogImage, true);
    ensureMeta("og:image:type", "image/png", true);
    ensureMeta("og:image:width", "1200", true);
    ensureMeta("og:image:height", "675", true);
    ensureMeta("og:image:alt", `${SITE_TITLE} preview`, true);
    if (origin) ensureMeta("og:url", origin + window.location.pathname, true);
    ensureMeta("og:site_name", SITE_TITLE, true);
    // Twitter
    ensureMeta("twitter:card", "summary_large_image");
    ensureMeta("twitter:title", SITE_TITLE);
    ensureMeta("twitter:description", SITE_DESCRIPTION);
    ensureMeta("twitter:image", ogImage);
    ensureMeta("twitter:image:alt", `${SITE_TITLE} preview`);
    // Theme colour for mobile browser chrome
    ensureMeta("theme-color", "#1d2539");
  }, []);
}

export default function App() {
  const [loaded] = useFonts(noontreeFonts);
  useSiteHead();
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
    <NavigationContainer theme={navTheme} linking={linking}>
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
        <RootStack.Screen name="ActionBar" component={ActionBarScreen} />
        <RootStack.Screen name="BottomSheet" component={BottomSheetScreen} />
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
        <RootStack.Screen
          name="NeutralTextButton"
          component={NeutralTextButtonScreen}
        />
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
