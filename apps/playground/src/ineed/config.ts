/**
 * I NEED… — backend config (playground port).
 *
 * The playground is a static Expo-web app with no server, so the form talks to
 * the Google Apps Script Web App directly from the browser. The deployment URL
 * and shared write token come from the environment so **no secret lives in the
 * repo** — set them in `apps/playground/.env.local` (gitignored) for local dev,
 * or as `EXPO_PUBLIC_*` vars at build time:
 *
 *   EXPO_PUBLIC_APPS_SCRIPT_URL   — the Web app "/exec" URL
 *   EXPO_PUBLIC_APPS_SCRIPT_TOKEN — shared write token (matches SHARED_TOKEN in
 *                                   apps-script/Code.gs)
 *
 * Note: `EXPO_PUBLIC_*` values are inlined into the client bundle, so treat the
 * token as low-trust — it only guards appends to the Google Sheet. If it leaks,
 * rotate SHARED_TOKEN in Code.gs and update the env value.
 *
 * The Apps Script deployment returns `access-control-allow-origin: *` on both
 * the redirect and the final response, so cross-origin GET (list) and POST
 * (create, sent as text/plain to dodge the CORS preflight) both work.
 */
export const APPS_SCRIPT_URL = process.env.EXPO_PUBLIC_APPS_SCRIPT_URL ?? "";

export const APPS_SCRIPT_TOKEN = process.env.EXPO_PUBLIC_APPS_SCRIPT_TOKEN ?? "";

export function isConfigured(): boolean {
  return Boolean(APPS_SCRIPT_URL);
}
