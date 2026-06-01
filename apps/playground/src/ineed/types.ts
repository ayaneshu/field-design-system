// Shared domain types for I NEED… requests. Ported verbatim from the original
// Next.js app (lib/types.ts) — pure TypeScript, no runtime deps.

export const CATEGORIES = ["Components", "Icon", "Colour", "Typography"] as const;
export type Category = (typeof CATEGORIES)[number];

export const TYPES = ["New", "Improvement needed"] as const;
export type RequestType = (typeof TYPES)[number];

export const STATUSES = ["Yet to start", "In progress", "Done"] as const;
export type Status = (typeof STATUSES)[number];

// Auto-assignment rule: anything in the Icon category goes to Saurabh,
// everything else goes to Ayanesh. Mirrored in the Apps Script (the writer).
export const ICON_ASSIGNEE = "sghongade@noon.com";
export const DEFAULT_ASSIGNEE = "aybhardwaj@noon.com";

export function assigneeFor(category: string): string {
  return category === "Icon" ? ICON_ASSIGNEE : DEFAULT_ASSIGNEE;
}

/** A single improvement request, as stored in the sheet. */
export interface DesignRequest {
  timestamp: string; // ISO string
  category: Category | string;
  type: RequestType | string;
  /** The specific existing item being improved (component/icon/colour/type
   *  style). Empty for "New" requests. */
  target: string;
  description: string;
  figmaLink: string;
  assignee: string;
  status: Status | string;
}

/** Payload sent from the form when creating a new request. */
export interface NewRequestInput {
  category: string;
  type: string;
  target: string;
  description: string;
  figmaLink: string;
}

export const DESCRIPTION_WORD_LIMIT = 200;

export function wordCount(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}
