function partsAt(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value);
  return { year: value("year"), month: value("month"), day: value("day"), hour: value("hour"), minute: value("minute"), second: value("second") };
}

export function isValidTimeZone(timeZone: string) {
  try { new Intl.DateTimeFormat("en", { timeZone }).format(); return true; } catch { return false; }
}

export function instantToZonedLocal(value: string, timeZone: string) {
  const parts = partsAt(new Date(value), timeZone);
  const pad = (number: number) => String(number).padStart(2, "0");
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}T${pad(parts.hour)}:${pad(parts.minute)}`;
}

export function zonedLocalToIso(value: string, timeZone: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match || !isValidTimeZone(timeZone)) throw new Error("Enter a valid date, time, and IANA timezone.");
  const desired = { year: +match[1], month: +match[2], day: +match[3], hour: +match[4], minute: +match[5] };
  const wallUtc = Date.UTC(desired.year, desired.month - 1, desired.day, desired.hour, desired.minute);
  let instant = wallUtc;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const actual = partsAt(new Date(instant), timeZone);
    const actualWall = Date.UTC(actual.year, actual.month - 1, actual.day, actual.hour, actual.minute);
    instant += wallUtc - actualWall;
  }
  const verified = partsAt(new Date(instant), timeZone);
  if (verified.year !== desired.year || verified.month !== desired.month || verified.day !== desired.day || verified.hour !== desired.hour || verified.minute !== desired.minute) {
    throw new Error("That local time does not exist in the selected timezone.");
  }
  return new Date(instant).toISOString();
}
