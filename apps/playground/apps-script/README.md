# I NEED… — Apps Script backend

`Code.gs` is the Google Apps Script Web App that backs the **I need…** request
form/table in the playground (`src/ineed/`). It reads from and appends to a
Google Sheet, so the static web app needs no server of its own.

It is **deployed manually** (Apps Script can't be deployed from CI), so this
file is the source of truth — keep it in sync with the live deployment.

## Deploy / update

1. Open the bound Sheet → **Extensions → Apps Script**.
2. Replace the script contents with `Code.gs`.
3. Set `SHARED_TOKEN` to a long random string.
4. **Deploy → Manage deployments →** edit the Web app deployment (Execute as:
   *Me*, Who has access: *Anyone*) and deploy a new version.
5. Put the Web app `/exec` URL and the same token into
   `apps/playground/.env.local`:

   ```
   EXPO_PUBLIC_APPS_SCRIPT_URL=…/exec
   EXPO_PUBLIC_APPS_SCRIPT_TOKEN=<SHARED_TOKEN>
   ```

## Columns

`Timestamp | Category | Type | Description | Figma Link | Assignee | Status | Target`

`Target` is appended last so existing 7-column rows stay aligned; the header is
backfilled automatically on the next call.
