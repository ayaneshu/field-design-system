/**
 * I NEED… — Field Design System request collector
 * Google Apps Script Web App backing the playground's "I need…" form/table.
 *
 * Deploy this bound to the spreadsheet:
 *   1. Open the sheet → Extensions → Apps Script
 *   2. Paste this file in (replace the default Code.gs)
 *   3. Set SHARED_TOKEN below to your shared write token
 *   4. Deploy → Manage deployments → edit the Web app deployment → New version
 *        - Execute as: Me
 *        - Who has access: Anyone
 *   5. Put the Web app URL + token into apps/playground/.env.local as
 *      EXPO_PUBLIC_APPS_SCRIPT_URL / EXPO_PUBLIC_APPS_SCRIPT_TOKEN.
 *
 * Columns (row 1 is the header):
 *   Timestamp | Category | Type | Target | Description | Figma Link | Assignee | Status
 *
 * "Target" sits next to Type (the specific item an Improvement points at).
 * ensureLayout_() migrates older sheets — where Target was appended last — by
 * moving that column (with its data) into place automatically on the next call.
 */

// ⚠️ Change this to your shared write token, and use the same value as
// EXPO_PUBLIC_APPS_SCRIPT_TOKEN in the app. Guards write access.
var SHARED_TOKEN = "CHANGE_ME_to_a_long_random_string";

var SHEET_NAME = "Requests"; // tab name; created if it doesn't exist
var HEADERS = ["Timestamp", "Category", "Type", "Target", "Description", "Figma Link", "Assignee", "Status"];
var DEFAULT_STATUS = "Yet to start";

// Auto-assignment rule: Icon requests go to Saurabh, everything else to Ayanesh.
var ICON_ASSIGNEE = "sghongade@noon.com";
var DEFAULT_ASSIGNEE = "aybhardwaj@noon.com";

function assigneeFor_(category) {
  return category === "Icon" ? ICON_ASSIGNEE : DEFAULT_ASSIGNEE;
}

/**
 * Make the sheet's columns match HEADERS — in particular, ensure "Target" sits
 * right after "Type". Idempotent and data-preserving:
 *   - fresh sheet → write the header row
 *   - "Target" missing → insert a blank column after Type
 *   - "Target" elsewhere (e.g. appended at the end) → move the whole column
 *     (header + data) into position
 */
function ensureLayout_(sheet) {
  var firstCell = sheet.getRange(1, 1).getValue();
  if (!firstCell) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    return;
  }

  var wantTarget = HEADERS.indexOf("Target"); // 0-based → 3 (after Type)
  var lastCol = Math.max(sheet.getLastColumn(), HEADERS.length);
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

  var curTarget = -1;
  for (var i = 0; i < headers.length; i++) {
    if (String(headers[i]).trim() === "Target") { curTarget = i; break; }
  }

  if (curTarget === -1) {
    // No Target column yet — insert a blank one right after Type.
    sheet.insertColumnBefore(wantTarget + 1);
  } else if (curTarget !== wantTarget) {
    // Move the existing Target column (with its data) next to Type.
    sheet.moveColumns(
      sheet.getRange(1, curTarget + 1, sheet.getMaxRows(), 1),
      wantTarget + 1
    );
  }

  // Normalise the header labels to the canonical order.
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.setFrozenRows(1);
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  ensureLayout_(sheet);
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/** GET ?action=list → all rows as JSON. */
function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) || "list";
    if (action !== "list") {
      return json_({ ok: false, error: "Unknown action: " + action });
    }

    var sheet = getSheet_();
    var lastRow = sheet.getLastRow();
    var rows = [];

    if (lastRow > 1) {
      var values = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
      for (var i = 0; i < values.length; i++) {
        var r = values[i];
        // Skip fully empty rows (description is column index 4 now).
        if (!r[0] && !r[1] && !r[4]) continue;
        rows.push({
          timestamp: r[0] instanceof Date ? r[0].toISOString() : String(r[0] || ""),
          category: String(r[1] || ""),
          type: String(r[2] || ""),
          target: String(r[3] || ""),
          description: String(r[4] || ""),
          figmaLink: String(r[5] || ""),
          assignee: String(r[6] || ""),
          status: String(r[7] || DEFAULT_STATUS),
        });
      }
    }

    // Newest first.
    rows.reverse();
    return json_({ ok: true, rows: rows });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/** POST { action:"create", token, category, type, target, description, figmaLink }. */
function doPost(e) {
  try {
    var body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }

    if (body.action !== "create") {
      return json_({ ok: false, error: "Unknown action." });
    }
    if (String(body.token || "") !== SHARED_TOKEN) {
      return json_({ ok: false, error: "Unauthorized." });
    }

    var category = String(body.category || "").trim();
    var type = String(body.type || "").trim();
    var target = String(body.target || "").trim();
    var description = String(body.description || "").trim();
    var figmaLink = String(body.figmaLink || "").trim();

    if (!category || !type || !description) {
      return json_({ ok: false, error: "Missing required fields." });
    }

    var assignee = assigneeFor_(category);
    var sheet = getSheet_();
    var now = new Date();
    // Column order: Timestamp, Category, Type, Target, Description, Figma, Assignee, Status
    sheet.appendRow([now, category, type, target, description, figmaLink, assignee, DEFAULT_STATUS]);

    return json_({
      ok: true,
      row: {
        timestamp: now.toISOString(),
        category: category,
        type: type,
        target: target,
        description: description,
        figmaLink: figmaLink,
        assignee: assignee,
        status: DEFAULT_STATUS,
      },
    });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}
