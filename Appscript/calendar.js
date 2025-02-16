const kCalendarSheetName = "GCal Export";
const kCalendarId = "c_a315f6bbc48dc4d65930ac1da9f2b2008cf0bdee2311f00c6bdb25380b8c635d@group.calendar.google.com";
const kCalendarsNamedRange = "Alle_Kalender";
const kProbeTag = "theaterprobe";
const kProbeSaison = "2024";

function parseRecords(range, header_normalizer=(h) => h) {
  var data = range.getValues();
  var header = data[0].map((t) => header_normalizer(t));
  //Logger.log("Headers: [" + header.map((v, i) => "["+i+"]=" + v).join(", ") + "]");
  
  return data.slice(1).map(
    (row) => Object.fromEntries(
      row.map((item, idx) => [header[idx], item])  // make a pair from header and item
      .filter((p) => p[0] != "")                   // keep only pairs with non-empty header name
    )
  );
}

/**
 * Gets a short URL for the calendar ID's embedded page.
 * @param {calendar_id} ID of the calendar.
 * @param {short_url} If true, get a short URL for the link.
 * @return The short URL for the calendar.
 * @customfunction
*/
function EMBEDDED_CALENDAR_URL(calendar_id, short_url=false) {
  var embed_url = "https://calendar.google.com/calendar/u/0/embed?src=" + calendar_id;
  return short_url ? CalendarEventLibrary.shortenThisUrl(embed_url) : embed_url;
}

/**
 * Gets a URL for the rendering of the QR-Code for the given data.
 * @param {data} data to be rendered in the QR Code.
 * @param {size} size of the QR Code to render.
 * @return The URL iseful to plug into an IMAGE() function.
 * @customfunction
*/
function QRCODE_URL_FOR(data, size=160) {
  return "https://quickchart.io/qr?size=160&text=" + encodeURIComponent(data);
}

function convertFields(attrs, {event_prefix="", event_suffix=""}) {
  attrs.start_time = CalendarEventLibrary.combineDateAndTime(attrs.start_date, attrs.start_time);
  delete attrs.start_date;
  attrs.end_time = CalendarEventLibrary.combineDateAndTime(attrs.end_date, attrs.end_time);
  delete attrs.end_date;
  //Logger.log("Color: <" + attrs.color + ">");
  attrs.color = CalendarEventLibrary.parseColor(attrs.color);
  if (event_prefix || event_suffix) {
    attrs.subject = event_prefix + attrs.subject + event_suffix;
  }
  return attrs;
}

function polyHasher(event) {
  var items;
  if ('subject' in event) {
    items = [event.subject, event.start_time, event.end_time, 
             event.description, event.location, event.color];
  } else {
    items = [event.getTitle(), event.getStartTime(), event.getEndTime(),
             event.getDescription(), event.getLocation(), event.getColor()];
  }
  return Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, items.join("@@"), Utilities.Charset.UTF_8);
}

function createProben(calendar, proben) {
  for (var probe of proben) {
    var event = calendar.createEvent(probe.subject, probe.start_time, probe.end_time, {
      location: probe.location,
      description: probe.description,
    });
    if (probe.color) event.setColor(probe.color);
    event.setTag(kProbeTag, kProbeSaison);
    CalendarEventLibrary.logEvent(event);
  }
}

// Options:
//   delete_stale_events: 
//   event_prefix: add this prefix to the event title
//   event_suffix: add this suffix to the event title
function syncProbenInCalendar(calendar, {delete_stale_events=true, event_prefix, event_suffix}) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(kCalendarSheetName);
  var proben = parseRecords(sheet.getDataRange(), (header) => header.toLowerCase().replace(/[^a-z]/i, "_"));
  Logger.log("Found " + proben.length + " Proben in sheet");
  // Keep non-empty and non Ausfall Proben
  proben = proben.filter((p) => p.subject != "" && !p.description.match(/Fällt aus/i)).map((p) => convertFields(p, {event_prefix: event_prefix, event_suffix: event_suffix}));
  Logger.log("Found " + proben.length + " relevant Proben (non-cancelled)");
  //Logger.log(JSON.stringify(proben));
 
  Logger.log("Amending calendar <" + calendar.getName() + ">");
  var events = CalendarEventLibrary.fetchAllEvents(calendar);
  Logger.log("Found " + events.length + " events in calendar");
  // Focus only on actual generated events
  var probe_events = events.filter((e) => e.getTag(kProbeTag) === kProbeSaison);
  Logger.log("Found " + probe_events.length + " generated events in calendar");

  var {onlyInA: stale_proben, onlyInB: new_proben} = CalendarEventLibrary.groupEvents(probe_events, proben, polyHasher);

  Logger.log("Clearing " + stale_proben.length + " stale events");
  if (delete_stale_events) CalendarEventLibrary.clearEvents(calendar, stale_proben);
  Logger.log("Creating " + new_proben.length + " new/updated events");
  createProben(calendar, new_proben);

  var old_events = events.filter((e) => e.getTag(kProbeTag) === "JA");
  Logger.log("Clearing " + old_events.length + " old-tagged events")
  if (delete_stale_events) CalendarEventLibrary.clearEvents(calendar, old_events);
}

function updateAllCalendars() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var calendars = parseRecords(sheet.getRangeByName(kCalendarsNamedRange), (header) => header.toLowerCase().replace(/[^a-z]/i, "_"));
  calendars = calendars.filter((c) => c.calendar_id !== "");

  for (config of calendars) {
    var calendar = CalendarApp.getCalendarById(config.calendar_id);
    Logger.log("Syncing calendar <" + calendar.getName() + "> with " + JSON.stringify(config));
    syncProbenInCalendar(calendar, config);
  }
}
