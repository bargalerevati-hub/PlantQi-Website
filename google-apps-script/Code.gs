/**
 * @OnlyCurrentDoc  Limits access to this one spreadsheet, not all of your Google Sheets.
 */

/**
 * Plant Qi orders sheet: receives orders and contact messages from the website's /api functions,
 * adds each one as a row, and emails a notification.
 *
 * Setup: see docs/ORDERS_SETUP.md in the website repository.
 *   Project Settings → Script Properties → add SECRET (same value as SHEET_SECRET in Vercel).
 */

var NOTIFY_EMAIL = "hello@plantqi.com";

var TABS = {
  order: {
    name: "Orders",
    headers: ["Order ID", "Date", "Status", "Items", "Total (₹)", "Name", "Phone (WhatsApp)", "Email", "Address", "City", "State", "PIN", "Note", "Paid", "Shipped", "Tracking"],
  },
  message: {
    name: "Messages",
    headers: ["Date", "Name", "Phone", "Message", "Replied"],
  },
};

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    var secret = PropertiesService.getScriptProperties().getProperty("SECRET");
    if (!secret || body.secret !== secret) return reply({ ok: false, error: "unauthorised" });

    var tab = TABS[body.type];
    if (!tab || !body.record) return reply({ ok: false, error: "bad request" });

    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      var sheet = sheetFor(tab);
      var row = tab.headers.map(function (h) {
        var v = body.record[h];
        return v === undefined ? "" : safe(v);
      });
      sheet.appendRow(row);
    } finally {
      lock.releaseLock();
    }

    notify(body.type, body.record);
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  }
}

// Visiting the web app URL in a browser shows this, which confirms the deployment works.
function doGet() {
  return reply({ ok: true, service: "Plant Qi orders" });
}

function sheetFor(tab) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(tab.name);
  if (!sheet) {
    sheet = ss.insertSheet(tab.name);
    sheet.appendRow(tab.headers);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, tab.headers.length).setFontWeight("bold");
  }
  return sheet;
}

// Stop values like "=HYPERLINK(...)" typed into the form from running as formulas.
function safe(v) {
  return typeof v === "string" && /^[=+\-@]/.test(v) ? "'" + v : v;
}

function notify(type, r) {
  var lines = Object.keys(r).map(function (k) {
    return k + ": " + r[k];
  });
  var subject = type === "order" ? "New order " + r["Order ID"] + " from " + r.Name + " · ₹" + r["Total (₹)"] : "New message from " + r.Name;
  try {
    MailApp.sendEmail({ to: NOTIFY_EMAIL, subject: subject, body: lines.join("\n"), replyTo: r.Email || undefined });
  } catch (err) {
    // The row is already saved; a mail quota error should not fail the order.
    console.error(err);
  }
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
