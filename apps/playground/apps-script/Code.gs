/**
 * I NEED… — Field Design System request collector
 * Google Apps Script Web App backing the Next.js app.
 *
 * Deploy this bound to the spreadsheet:
 *   1. Open the sheet → Extensions → Apps Script
 *   2. Paste this file in (replace the default Code.gs)
 *   3. Set SHARED_TOKEN below to a long random string
 *   4. Deploy → New deployment → type "Web app"
 *        - Execute as: Me
 *        - Who has access: Anyone
 *   5. Copy the Web app URL into the Next.js app's .env.local as APPS_SCRIPT_URL
 *      and put the same SHARED_TOKEN value as APPS_SCRIPT_TOKEN.
 *
 * Columns (row 1 is the header, created automatically if missing):
 *   Timestamp | Category | Type | Description | Figma Link | Assignee | Status | Target
 *   ("Target" = the specific item an Improvement points at; appended last so
 *    existing 7-column rows stay aligned.)
 */

// ⚠️ Change this to a long random string, and use the same value as
// APPS_SCRIPT_TOKEN in the Next.js app. Guards write access.
var SHARED_TOKEN = "CHANGE_ME_to_a_long_random_string";

var SHEET_NAME = "Requests"; // tab name; created if it doesn't exist
// "Target" is appended at the END so existing 7-column rows stay aligned.
var HEADERS = ["Timestamp", "Category", "Type", "Description", "Figma Link", "Assignee", "Status", "Target"];
var DEFAULT_STATUS = "Yet to start";

// Auto-assignment rule: Icon requests go to Saurabh, everything else to Ayanesh.
var ICON_ASSIGNEE = "sghongade@noon.com";
var DEFAULT_ASSIGNEE = "aybhardwaj@noon.com";

function assigneeFor_(category) {
  return category === "Icon" ? ICON_ASSIGNEE : DEFAULT_ASSIGNEE;
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  // Ensure the header row exists and matches.
  var firstCell = sheet.getRange(1, 1).getValue();
  if (!firstCell) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  } else {
    // Backfill the trailing "Target" header on older 7-column sheets.
    var lastHeader = sheet.getRange(1, HEADERS.length).getValue();
    if (!lastHeader) {
      sheet.getRange(1, HEADERS.length).setValue(HEADERS[HEADERS.length - 1]);
    }
  }
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
        // Skip fully empty rows.
        if (!r[0] && !r[1] && !r[3]) continue;
        rows.push({
          timestamp: r[0] instanceof Date ? r[0].toISOString() : String(r[0] || ""),
          category: String(r[1] || ""),
          type: String(r[2] || ""),
          description: String(r[3] || ""),
          figmaLink: String(r[4] || ""),
          assignee: String(r[5] || ""),
          status: String(r[6] || DEFAULT_STATUS),
          target: String(r[7] || ""),
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

/** POST { action:"create", token, category, type, description, figmaLink }. */
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
    sheet.appendRow([now, category, type, description, figmaLink, assignee, DEFAULT_STATUS, target]);

    return json_({
      ok: true,
      row: {
        timestamp: now.toISOString(),
        category: category,
        type: type,
        description: description,
        figmaLink: figmaLink,
        assignee: assignee,
        status: DEFAULT_STATUS,
        target: target,
      },
    });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}
