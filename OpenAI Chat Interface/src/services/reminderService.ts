// Reminder Service
export interface ParsedReminder {
  task: string;
  delayMs: number;
  displayTime: string;
}

// Permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
};

// Time unit map
const TIME_UNITS: Record<string, number> = {
  second: 1_000,
  seconds: 1_000,
  sec: 1_000,
  secs: 1_000,
  minute: 60_000,
  minutes: 60_000,
  min: 60_000,
  mins: 60_000,
  hour: 3_600_000,
  hours: 3_600_000,
  hr: 3_600_000,
  hrs: 3_600_000,
};

// Patterns
// Flexible relative: "remind me in 10 minutes to/about/for X"
//                    "set a reminder for 2 hours to X"
//                    "remind me after 30 seconds X"
const RELATIVE_PATTERN =
  /(?:remind\s+me|set\s+(?:a\s+)?reminder)(?:\s+(?:in|after|for))?\s+(\d+(?:\.\d+)?)\s*(seconds?|secs?|minutes?|mins?|hours?|hrs?)\s*(?:to\s+|about\s+|for\s+)?(.+)/i;

// Absolute: "remind me at 5pm to X" / "remind me at 9:30 am to X"
const ABSOLUTE_PATTERN =
  /(?:remind\s+me|set\s+(?:a\s+)?reminder)\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*(?:to\s+|about\s+|for\s+)?(.+)/i;

// Loose detector — catches anything that looks like a reminder intent
// Used only for isReminderRequest(), NOT for parsing
const LOOSE_DETECTOR =
  /(?:remind\s+me|set\s+(?:a\s+)?reminder).{0,60}(?:\d+\s*(?:seconds?|secs?|minutes?|mins?|hours?|hrs?)|at\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i;

// Detector (used in ChatInterface before sending to LLM)

export const isReminderRequest = (input: string): boolean =>
  LOOSE_DETECTOR.test(input);

// Parsers

const parseRelative = (input: string): ParsedReminder | null => {
  const match = input.match(RELATIVE_PATTERN);
  if (!match) return null;

  const amount = parseFloat(match[1]);
  const unit = match[2].toLowerCase();
  const task = match[3]?.trim();
  if (!task) return null;

  const multiplier =
    TIME_UNITS[unit] ??
    (unit.startsWith("s")
      ? 1_000
      : unit.startsWith("h")
        ? 3_600_000
        : 60_000);

  const delayMs = Math.round(amount * multiplier);
  const displayTime = `${amount} ${unit}`;

  return { task, delayMs, displayTime };
};

const parseAbsolute = (input: string): ParsedReminder | null => {
  const match = input.match(ABSOLUTE_PATTERN);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const meridiem = match[3]?.toLowerCase();
  const task = match[4]?.trim();
  if (!task) return null;

  if (meridiem === "pm" && hours < 12) hours += 12;
  if (meridiem === "am" && hours === 12) hours = 0;

  const now = new Date();
  const target = new Date(now);
  target.setHours(hours, minutes, 0, 0);

  // If time already passed today → schedule for tomorrow
  if (target <= now) target.setDate(target.getDate() + 1);

  const delayMs = target.getTime() - now.getTime();
  const displayTime = target.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return { task, delayMs, displayTime };
};

export const parseReminderFromMessage = (input: string): ParsedReminder | null =>
  parseRelative(input) ?? parseAbsolute(input);

// Scheduler

const activeReminders = new Map<string, ReturnType<typeof setTimeout>>();

export const scheduleReminder = async (
  reminder: ParsedReminder,
): Promise<{ success: boolean; message: string }> => {
  const granted = await requestNotificationPermission();

  if (!granted) {
    return {
      success: false,
      message:
        "⚠️ Notification permission was denied. Please allow notifications in your browser settings to use reminders.",
    };
  }

  const id = crypto.randomUUID();

  const timerId = setTimeout(() => {
    new Notification("⏰ Reminder", {
      body: reminder.task,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: id,
    });
    activeReminders.delete(id);
  }, reminder.delayMs);

  activeReminders.set(id, timerId);

  return {
    success: true,
    message: `✅ Reminder set! I'll notify you in **${reminder.displayTime}** to *${reminder.task}*`,
  };
};

// Cancel all (call on chat clear)

export const cancelAllReminders = (): void => {
  activeReminders.forEach((timerId) => clearTimeout(timerId));
  activeReminders.clear();
};
