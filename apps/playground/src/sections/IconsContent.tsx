import { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { Icon, iconNames, iconPaths, type IconName } from "@field-ds/icons";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

import { ViewToggle, type ViewMode } from "../components/ViewToggle";
import { useShell } from "../theme/ThemeContext";

function buildSvgMarkup(name: IconName): string {
  const paths = (iconPaths[name] ?? []) as readonly string[];
  const pathEls = paths
    .map((d) => `  <path fill="currentColor" d="${d}"/>`)
    .join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" aria-label="${name}">\n${pathEls}\n</svg>`;
}

// Keyword aliases — common synonyms users might search for that don't appear
// in the canonical icon name. Each token maps to extra keywords appended to
// that icon's search corpus.
const KEYWORD_ALIASES: Record<string, string[]> = {
  bin: ["trash", "delete", "remove", "garbage"],
  cart: ["shopping", "basket"],
  bag: ["shopping", "purse", "tote"],
  copy: ["duplicate", "clone"],
  edit: ["pencil", "write", "modify", "compose"],
  search: ["magnifier", "find", "lookup", "magnifying"],
  cross: ["close", "x", "dismiss", "cancel"],
  check: ["tick", "done", "success", "confirm", "ok"],
  chevron: ["arrow", "expand", "collapse"],
  caret: ["arrow", "triangle"],
  preferences: ["settings", "gear", "cog", "options"],
  notification: ["bell", "alert", "alarm"],
  message: ["chat", "sms", "comment"],
  messages: ["chat", "comments", "conversation"],
  handset: ["phone", "call", "telephone"],
  call: ["phone", "telephone", "ring"],
  mic: ["microphone", "voice", "audio", "record"],
  volume: ["sound", "audio", "speaker"],
  camera: ["photo", "picture", "image"],
  video: ["film", "movie", "recording", "play"],
  gift: ["present", "reward"],
  heart: ["love", "favorite", "favourite", "like", "wishlist"],
  thumbs: ["like", "vote", "feedback"],
  user: ["person", "profile", "account", "avatar", "people"],
  profile: ["user", "account", "avatar", "person"],
  partners: ["users", "team", "people", "group"],
  world: ["globe", "earth", "internet", "web", "international"],
  country: ["flag", "nation", "region"],
  language: ["translate", "locale", "globe"],
  home: ["house"],
  shop: ["store", "market", "shopping"],
  thunder: ["lightning", "fast", "bolt", "flash", "express"],
  flash: ["thunder", "lightning", "fast", "express"],
  flame: ["fire", "hot", "popular", "trending"],
  discount: ["sale", "offer", "deal", "promo"],
  coupon: ["voucher", "discount", "promo"],
  truck: ["delivery", "shipping", "transport"],
  delivery: ["shipment", "package", "parcel", "ship"],
  locker: ["safe", "storage"],
  lock: ["padlock", "secure", "private", "locked"],
  unlock: ["open", "access", "unlocked"],
  shield: ["security", "protect", "guard", "safe"],
  info: ["information", "help", "details"],
  help: ["question", "support", "faq"],
  warning: ["alert", "caution", "danger", "error"],
  star: ["favorite", "favourite", "rating", "bookmark"],
  invoice: ["receipt", "bill"],
  direction: ["compass", "navigation", "navigate"],
  location: ["pin", "map", "place", "marker", "gps"],
  pin: ["location", "marker", "place"],
  crosshair: ["target", "focus", "aim"],
  power: ["on", "off", "shutdown", "toggle"],
  download: ["save", "import"],
  upload: ["export", "send"],
  refresh: ["reload", "sync", "update"],
  sort: ["order", "filter"],
  mobile: ["phone", "smartphone", "device"],
  mobiles: ["phones", "smartphones", "devices"],
  briefcase: ["work", "business", "job", "office"],
  graduation: ["education", "school", "university", "college", "study"],
  measurement: ["ruler", "measure", "size"],
  ruler: ["measurement", "measure"],
  medal: ["award", "badge", "achievement"],
  water: ["drop", "liquid"],
  combo: ["bundle", "set", "pack"],
  forward: ["next", "skip"],
  previous: ["back", "prev"],
  play: ["start", "video"],
  pause: ["stop", "hold"],
  live: ["broadcast", "streaming", "stream"],
  contact: ["phonebook", "address"],
  notepad: ["note", "document", "memo", "list"],
  hourglass: ["timer", "time", "wait", "loading"],
  clock: ["time", "watch", "schedule"],
  calendar: ["schedule", "date", "event"],
  minus: ["subtract", "less", "remove"],
  plus: ["add", "more", "new"],
  payment: ["card", "credit", "debit", "checkout"],
  bank: ["financial", "finance"],
  wallet: ["money", "balance"],
  cash: ["money", "currency"],
  currency: ["money", "cash", "bills"],
  scan: ["qr", "barcode"],
  link: ["url", "hyperlink", "chain"],
  sign: ["login", "logout", "auth"],
  door: ["entrance", "exit"],
  category: ["categories", "tag", "section"],
  rewind: ["back", "undo", "previous"],
  return: ["back", "undo", "refund"],
  toys: ["games", "play", "kids"],
  installation: ["install", "setup"],
  verified: ["verify", "trusted", "approved"],
  noon: ["brand"],
  filled: ["fill", "solid"],
  // Short symbol aliases
  question: ["help", "ask", "faq"],
  exclaimation: ["alert", "warning"],
  three: ["dots", "more", "menu"],
  menu: ["dots", "more", "hamburger"],
  vetricle: ["vertical", "menu", "more"],
  vertical: ["menu", "more"],
  horizontal: ["menu", "more"],
};

function buildCorpus(name: IconName): string {
  const tokens = name.split("-").filter((t) => t !== "system" && t !== "bottomnav");
  const aliases = tokens.flatMap((t) => KEYWORD_ALIASES[t] ?? []);
  return [name, ...tokens, ...aliases].join(" ").toLowerCase();
}

export function IconsContent({
  copy,
}: {
  copy: (text: string, label?: string) => void;
}) {
  const [view, setView] = useState<ViewMode>("grid");
  const [query, setQuery] = useState("");

  const shell = useShell();

  const searchIndex = useMemo(
    () => iconNames.map((name) => ({ name, corpus: buildCorpus(name) })),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return iconNames;
    const terms = q.split(/\s+/).filter(Boolean);
    return searchIndex
      .filter(({ corpus }) => terms.every((t) => corpus.includes(t)))
      .map(({ name }) => name);
  }, [query, searchIndex]);

  const handleCopy = (n: IconName) => {
    copy(buildSvgMarkup(n), `svg · ${n}`);
  };

  return (
    <View>
      {/* Toolbar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: space["12"],
          flexWrap: "wrap",
          marginBottom: space["20"],
        }}
      >
        <View
          style={{
            flexGrow: 1,
            flexBasis: 280,
            flexDirection: "row",
            alignItems: "center",
            gap: space["10"],
            paddingHorizontal: space["14"],
            paddingVertical: space["10"],
            borderRadius: radius.rounded,
            backgroundColor: colour.surface.secondary,
            borderWidth: 1,
            borderColor: colour.border.subtle,
          }}
        >
          <Icon name="system-search" size={16} color={colour["text-n-icon"].tertiary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search icons by name or keyword (e.g. trash, settings, phone)…"
            placeholderTextColor={colour["text-n-icon"].muted}
            // @ts-expect-error — outlineStyle is web-only
            style={[
              textStyles.B14_Regular,
              {
                flex: 1,
                color: colour["text-n-icon"].primary,
                paddingVertical: 0,
                outlineStyle: "none",
              },
            ]}
          />
        </View>
        <ViewToggle value={view} onChange={setView} />
      </View>

      {/* Count */}
      <Text
        style={[
          textStyles.B11_SemiBold,
          {
            color: shell.textTertiary,
            textTransform: "uppercase",
            letterSpacing: 1.4,
            marginBottom: space["16"],
          },
        ]}
      >
        {filtered.length} {filtered.length === 1 ? "match" : "matches"} · click to copy SVG
      </Text>

      {view === "grid" ? (
        <GridView icons={filtered} onCopy={handleCopy} />
      ) : (
        <ListView icons={filtered} onCopy={handleCopy} />
      )}
    </View>
  );
}

function GridView({
  icons,
  onCopy,
}: {
  icons: IconName[];
  onCopy: (n: IconName) => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        borderWidth: 1,
        borderColor: colour.border.subtle,
        borderRadius: radius["16"],
        overflow: "hidden",
        backgroundColor: colour.surface.primary,
      }}
    >
      {icons.map((n) => (
        <Pressable
          key={n}
          onPress={() => onCopy(n)}
          accessibilityRole="button"
          accessibilityLabel={`Copy ${n}`}
          // @ts-expect-error — hover
          style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => ({
            width: 144,
            height: 144,
            alignItems: "center",
            justifyContent: "center",
            gap: space["12"],
            borderRightWidth: 1,
            borderBottomWidth: 1,
            borderRightColor: colour.border.subtle,
            borderBottomColor: colour.border.subtle,
            backgroundColor: hovered ? colour.surface.secondary : "transparent",
            opacity: pressed ? 0.85 : 1,
          })}
        >
          {/* Preview is 40×40; the underlying glyph is the 24×24 production
              icon scaled up so it stays crisp without changing the SVG that
              gets copied to the clipboard. */}
          <Icon name={n} size={40} color={colour["text-n-icon"].primary} />
          <Text
            numberOfLines={2}
            style={[
              textStyles.B11_Regular,
              {
                color: colour["text-n-icon"].tertiary,
                textAlign: "center",
                paddingHorizontal: space["6"],
              },
            ]}
          >
            {n.replace(/^system-/, "")}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function ListView({
  icons,
  onCopy,
}: {
  icons: IconName[];
  onCopy: (n: IconName) => void;
}) {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: colour.border.subtle,
        borderRadius: radius["12"],
        overflow: "hidden",
      }}
    >
      {icons.map((n, i) => (
        <Pressable
          key={n}
          onPress={() => onCopy(n)}
          accessibilityRole="button"
          accessibilityLabel={`Copy ${n}`}
          // @ts-expect-error — hover
          style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => ({
            flexDirection: "row",
            alignItems: "center",
            gap: space["16"],
            paddingHorizontal: space["16"],
            paddingVertical: space["12"],
            borderTopWidth: i === 0 ? 0 : 1,
            borderTopColor: colour.border.subtle,
            backgroundColor: hovered ? colour.surface.secondary : colour.surface.primary,
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: radius["8"],
              backgroundColor: colour.surface.tertiary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name={n} size={20} color={colour["text-n-icon"].primary} />
          </View>
          <Text
            style={[
              textStyles.B14_SemiBold,
              { color: colour["text-n-icon"].primary, flex: 1 },
            ]}
          >
            {n}
          </Text>
          <Text
            style={[
              textStyles.B11_SemiBold,
              {
                color: colour["text-n-icon"].tertiary,
                textTransform: "uppercase",
                letterSpacing: 0.6,
              },
            ]}
          >
            copy svg
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
