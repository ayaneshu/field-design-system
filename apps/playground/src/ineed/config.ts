/**
 * I NEED… — backend config (playground port).
 *
 * The original app proxied these through a Next.js API route so the Apps
 * Script URL + write token stayed server-side. The playground is a static
 * Expo-web app with no server, so the form talks to the Google Apps Script
 * Web App directly from the browser.
 *
 * Trade-off: the shared write token is now visible in client code. That's
 * acceptable for this internal, low-stakes design-system tool — the token only
 * guards appends to a Google Sheet. To override without editing this file, set
 * EXPO_PUBLIC_APPS_SCRIPT_URL / EXPO_PUBLIC_APPS_SCRIPT_TOKEN in the env.
 *
 * The Apps Script deployment returns `access-control-allow-origin: *` on both
 * the redirect and the final response, so cross-origin GET (list) and POST
 * (create, sent as text/plain to dodge the CORS preflight) both work.
 */
export const APPS_SCRIPT_URL =
  process.env.EXPO_PUBLIC_APPS_SCRIPT_URL ??
  "https://script.google.com/a/macros/noon.com/s/AKfycbx_Ceooer-3L2MFPl_SOL9O8tmHEoC8N7hFD2-Z1Qssl_q5zkb51mtoHxG3YadU660aHg/exec";

export const APPS_SCRIPT_TOKEN =
  process.env.EXPO_PUBLIC_APPS_SCRIPT_TOKEN ??
  "3b1a84d19644fc5643873c816b943ec8188d611ef6a731bf";

export function isConfigured(): boolean {
  return Boolean(APPS_SCRIPT_URL);
}
