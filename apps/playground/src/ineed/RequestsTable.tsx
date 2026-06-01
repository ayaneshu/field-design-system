/**
 * I NEED… requests table — presentational, matching the Figma "Active requests"
 * design: a rounded grey header row, hairline-divided rows, plain text cells,
 * an "@username" assignee and a subtle status pill. Full-width flex columns.
 */
import { Linking, Pressable, Text, View } from "react-native";

import { colour, radius, space, textStyles } from "@field-ds/tokens";

import type { DesignRequest } from "./types";

const HEADER = textStyles.Body_B16_Bold;
const CELL = textStyles.Body_B16_Regular; // Noontree-Medium look in design ≈ Regular weight token

// Column sizing — fixed widths for the short columns, flex for the long ones,
// mirroring the Figma layout (# · Category · Type · Description · Figma · Assignee · Status).
const COL = {
  num: { width: 48 },
  category: { width: 132 },
  type: { width: 96 },
  target: { width: 146 },
  description: { flex: 1.3, minWidth: 0 },
  figma: { flex: 1, minWidth: 0 },
  assignee: { width: 150 },
  status: { width: 168 },
} as const;

const statusPill: Record<string, { bg: string; fg: string }> = {
  "Yet to start": { bg: colour.surface.tertiary, fg: colour["text-n-icon"].tertiary },
  "In progress": { bg: "#fff0e6", fg: "#e5641a" },
  Done: { bg: colour.surface["success-subtle"], fg: colour["text-n-icon"].success },
};

export function RequestsTable({ rows }: { rows: DesignRequest[] }) {
  return (
    <View style={{ width: "100%" }}>
      {/* Header row — rounded grey bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colour.surface.secondary,
          borderRadius: radius["12"],
        }}
      >
        <HeaderCell col={COL.num}>#</HeaderCell>
        <HeaderCell col={COL.category}>Category</HeaderCell>
        <HeaderCell col={COL.type}>Type</HeaderCell>
        <HeaderCell col={COL.target}>Target</HeaderCell>
        <HeaderCell col={COL.description}>Description</HeaderCell>
        <HeaderCell col={COL.figma}>Figma Link</HeaderCell>
        <HeaderCell col={COL.assignee}>Assignee</HeaderCell>
        <HeaderCell col={COL.status}>Status</HeaderCell>
      </View>

      {rows.length === 0 ? (
        <View style={{ paddingVertical: 56, alignItems: "center" }}>
          <Text style={[textStyles.Body_B16_Regular, { color: colour["text-n-icon"].muted }]}>
            No requests match these filters.
          </Text>
        </View>
      ) : (
        rows.map((r, i) => (
          <View
            key={`${r.timestamp}-${i}`}
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: colour.border.subtle,
            }}
          >
            <BodyCell col={COL.num}>{String(i + 1)}</BodyCell>
            <BodyCell col={COL.category}>{r.category || "—"}</BodyCell>
            <BodyCell col={COL.type}>{r.type || "—"}</BodyCell>
            <BodyCell col={COL.target}>{r.target || "—"}</BodyCell>
            <BodyCell col={COL.description}>{r.description || "—"}</BodyCell>
            <View style={[cellPad, COL.figma]}>
              {r.figmaLink ? (
                <Pressable onPress={() => Linking.openURL(r.figmaLink)}>
                  <Text
                    numberOfLines={1}
                    style={[CELL, { color: colour["text-n-icon"].action }]}
                  >
                    {prettyLink(r.figmaLink)}
                  </Text>
                </Pressable>
              ) : (
                <Text style={[CELL, { color: colour["text-n-icon"].muted }]}>—</Text>
              )}
            </View>
            <BodyCell col={COL.assignee}>{atName(r.assignee)}</BodyCell>
            <View style={[cellPad, COL.status]}>
              <StatusPill status={r.status} />
            </View>
          </View>
        ))
      )}
    </View>
  );
}

const cellPad = {
  paddingTop: 24,
  paddingBottom: 20,
  paddingHorizontal: space["20"],
} as const;

function HeaderCell({ col, children }: { col: object; children: string }) {
  return (
    <View style={[{ padding: space["20"] }, col]}>
      <Text numberOfLines={1} style={[HEADER, { color: colour["text-n-icon"].primary }]}>
        {children}
      </Text>
    </View>
  );
}

function BodyCell({ col, children }: { col: object; children: React.ReactNode }) {
  return (
    <View style={[cellPad, col]}>
      <Text style={[CELL, { color: colour["text-n-icon"].primary }]}>{children}</Text>
    </View>
  );
}

function StatusPill({ status }: { status: string }) {
  const s = statusPill[status] ?? statusPill["Yet to start"];
  return (
    <View
      style={{
        alignSelf: "flex-start",
        backgroundColor: s.bg,
        borderRadius: radius.rounded,
        paddingTop: 6,
        paddingBottom: 8,
        paddingHorizontal: 14,
      }}
    >
      <Text numberOfLines={1} style={[textStyles.Body_B16_Bold, { color: s.fg }]}>
        {(status || "—").toLowerCase()}
      </Text>
    </View>
  );
}

function atName(email: string): string {
  if (!email) return "—";
  return "@" + email.split("@")[0];
}

function prettyLink(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}
