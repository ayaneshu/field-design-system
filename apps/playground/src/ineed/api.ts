/**
 * Client-side bridge to the Google Sheet (playground port).
 *
 * Replaces the original app's server route (lib/sheets.ts + app/api/requests).
 * Both calls go straight to the Apps Script Web App from the browser — see
 * config.ts for the CORS/token notes.
 */
import { APPS_SCRIPT_URL, APPS_SCRIPT_TOKEN } from "./config";
import type { DesignRequest, NewRequestInput } from "./types";

/** Read every request from the sheet (newest-first, as the script returns). */
export async function listRequests(): Promise<DesignRequest[]> {
  const url = new URL(APPS_SCRIPT_URL);
  url.searchParams.set("action", "list");

  const res = await fetch(url.toString(), {
    method: "GET",
    cache: "no-store",
    redirect: "follow",
  });
  if (!res.ok) {
    throw new Error(`Apps Script GET failed: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as {
    ok: boolean;
    rows?: DesignRequest[];
    error?: string;
  };
  if (!data.ok) throw new Error(data.error ?? "Apps Script returned an error");
  return data.rows ?? [];
}

/** Append a new request. Returns the created row (with assignee + status). */
export async function createRequest(
  input: NewRequestInput,
): Promise<DesignRequest> {
  const res = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    // text/plain keeps this a "simple" request so the browser skips the CORS
    // preflight (Apps Script doesn't answer OPTIONS).
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    redirect: "follow",
    body: JSON.stringify({
      action: "create",
      token: APPS_SCRIPT_TOKEN,
      ...input,
    }),
  });
  if (!res.ok) {
    throw new Error(`Apps Script POST failed: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as {
    ok: boolean;
    row?: DesignRequest;
    error?: string;
  };
  if (!data.ok) throw new Error(data.error ?? "Apps Script returned an error");
  if (!data.row) throw new Error("Apps Script did not return the created row");
  return data.row;
}
