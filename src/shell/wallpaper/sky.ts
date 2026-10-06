/// <reference lib="esnext.temporal" />
// The time of day where the visitor is, which picks the wallpaper: a period of the day, by how high
// the sun is there now. Where that is comes from their time zone, as asking for their location
// would interrupt them with a permission prompt.
import { imageUrl } from '../../art';
import duskPreview from './dusk-preview.webp';
import dusk from './dusk.webp';
import eveningBlueHourPreview from './evening-blue-hour-preview.webp';
import eveningBlueHour from './evening-blue-hour.webp';
import goldenHourPreview from './golden-hour-preview.webp';
import goldenHour from './golden-hour.webp';
import morningBlueHourPreview from './morning-blue-hour-preview.webp';
import morningBlueHour from './morning-blue-hour.webp';
import morningPreview from './morning-preview.webp';
import morning from './morning.webp';
import nightPreview from './night-preview.webp';
import night from './night.webp';
import predawnPreview from './predawn-preview.webp';
import predawn from './predawn.webp';
import sunsetPreview from './sunset-preview.webp';
import sunset from './sunset.webp';
import { zones } from './zones';

export type Period =
  | 'morning-blue-hour'
  | 'predawn'
  | 'morning'
  | 'day'
  | 'golden-hour'
  | 'sunset'
  | 'dusk'
  | 'evening-blue-hour'
  | 'night';

export interface Picture {
  period: Period;
  name: string;
  url: string;
  /** A tiny version, which comes with the page and shows blurred until the picture has loaded. */
  preview: string;
}

/** In the order of a day, from before sunrise. */
export const pictures: readonly Picture[] = [
  {
    period: 'morning-blue-hour',
    name: 'Morning blue hour',
    url: morningBlueHour,
    preview: morningBlueHourPreview,
  },
  { period: 'predawn', name: 'Predawn', url: predawn, preview: predawnPreview },
  { period: 'morning', name: 'Morning', url: morning, preview: morningPreview },
  { period: 'day', name: 'Day', url: imageUrl('bliss'), preview: imageUrl('blissPreview') },
  { period: 'golden-hour', name: 'Golden hour', url: goldenHour, preview: goldenHourPreview },
  { period: 'sunset', name: 'Sunset', url: sunset, preview: sunsetPreview },
  { period: 'dusk', name: 'Dusk', url: dusk, preview: duskPreview },
  {
    period: 'evening-blue-hour',
    name: 'Evening blue hour',
    url: eveningBlueHour,
    preview: eveningBlueHourPreview,
  },
  { period: 'night', name: 'Night', url: night, preview: nightPreview },
];

export function pictureOf(period: Period): Picture {
  const picture = pictures.find((each) => each.period === period);
  if (!picture) throw new Error(`There's no picture for ${period}.`);
  return picture;
}

export interface Place {
  name: string;
  zone: string;
  latitude: number;
  longitude: number;
  /** The zone has no city to go by, such as UTC. */
  guessed: boolean;
  /** The visitor's own, whose clock is the browser's. */
  local: boolean;
}

let home: Place | undefined;

/** Where the visitor is, as far as their time zone tells. */
export function here(): Place {
  home ??= findHome();
  return home;
}

function findHome(): Place {
  // Temporal knows the zone at once, while Intl first loads its formatting data, which costs a
  // slow phone some 50 ms before the first view. Not every browser has Temporal yet.
  const zone =
    typeof Temporal === 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : Temporal.Now.timeZoneId();
  const city = zones[zone];
  const name = zone.split('/').pop()?.replaceAll('_', ' ') ?? zone;
  if (city) {
    return { name, zone, latitude: city[0], longitude: city[1], guessed: false, local: true };
  }
  // The sun's timing from the offset, 15° to the hour, at a latitude of middling days.
  const longitude = -new Date().getTimezoneOffset() / 4;
  return { name, zone, latitude: 45, longitude, guessed: true, local: true };
}

/** Somewhere else to see the sky, each for something the sun does differently there. */
export const places: readonly Place[] = [
  // The midnight sun in summer, the polar night in winter.
  elsewhere('Tromsø', 'Europe/Oslo', 70, 19),
  // Long, slow twilights.
  elsewhere('Reykjavík', 'Atlantic/Reykjavik', 64, -22),
  elsewhere('London', 'Europe/London', 52, 0),
  elsewhere('New York', 'America/New_York', 41, -74),
  // On the equator: twelve-hour days all year, and the quickest twilights.
  elsewhere('Quito', 'America/Guayaquil', 0, -78),
  elsewhere('Tokyo', 'Asia/Tokyo', 36, 140),
  // The seasons the other way round.
  elsewhere('Sydney', 'Australia/Sydney', -34, 151),
  elsewhere('Cape Town', 'Africa/Johannesburg', -34, 18),
];

function elsewhere(name: string, zone: string, latitude: number, longitude: number): Place {
  return { name, zone, latitude, longitude, guessed: false, local: false };
}

const formats = new Map<string, Intl.DateTimeFormat>();

/** The time of day at `date` where `place` is, in minutes since its midnight. */
export function minutesOfDay(date: Date, place: Place): number {
  if (place.local) return date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;
  // Another place's clock takes Intl, loaded only once someone asks for it.
  let format = formats.get(place.zone);
  if (!format) {
    format = new Intl.DateTimeFormat('en-GB', {
      timeZone: place.zone,
      hourCycle: 'h23',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
    formats.set(place.zone, format);
  }
  const parts = format.formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((each) => each.type === type)?.value ?? 0);
  return part('hour') * 60 + part('minute') + part('second') / 60;
}

/** The midnight before `date` where `place` is, in ms. */
export function midnightOf(date: Date, place: Place): number {
  return date.getTime() - date.getMilliseconds() - minutesOfDay(date, place) * MINUTE;
}

/** The clock at `date` where `place` is, as 18:55. */
export function clockAt(date: Date, place: Place): string {
  const minutes = Math.floor(minutesOfDay(date, place));
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
}

/**
 * Where each picture shows alone, by the sun's height on its way up or down. Between two of these
 * moments, the wallpaper mixes the two pictures. Day and night are stretches: day while the sun is
 * above 20°, night while it's below −12°.
 */
const MOMENTS: readonly { period: Period; altitude: number; rising: boolean }[] = [
  { period: 'night', altitude: -12, rising: true },
  { period: 'morning-blue-hour', altitude: -8, rising: true },
  { period: 'predawn', altitude: -4, rising: true },
  { period: 'morning', altitude: 5, rising: true },
  { period: 'day', altitude: 20, rising: true },
  { period: 'day', altitude: 20, rising: false },
  { period: 'golden-hour', altitude: 10, rising: false },
  { period: 'sunset', altitude: 0, rising: false },
  { period: 'dusk', altitude: -5, rising: false },
  { period: 'evening-blue-hour', altitude: -8, rising: false },
  { period: 'night', altitude: -12, rising: false },
];

/** On a day the sun doesn't reach 20°, day still shows at noon if it gets this high. */
const LOW_DAY = 12;

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

interface Keyframe {
  period: Period;
  /** In ms, as `Date.getTime`. */
  at: number;
}

const HOUR = 60 * MINUTE;

// The last moments found, which serve every frame of the same hour while the day plays.
let cached: { key: string; keyframes: Keyframe[] } | undefined;

/** The moments from about a day before `date` to a day after, in order. */
export function keyframesAround(date: Date, place: Place): Keyframe[] {
  const hour = Math.floor(date.getTime() / HOUR) * HOUR;
  const key = `${place.latitude} ${place.longitude} ${hour}`;
  if (cached?.key !== key) cached = { key, keyframes: findKeyframes(hour - DAY, place) };
  return cached.keyframes;
}

function findKeyframes(start: number, place: Place): Keyframe[] {
  const keyframes: Keyframe[] = [];
  // Two minutes at a time, finding each moment between two steps.
  const step = 2 * MINUTE;
  let before = sun(new Date(start - step), place);
  let at = start;
  let altitude = sun(new Date(at), place);
  while (at < start + 2 * DAY) {
    const next = sun(new Date(at + step), place);
    for (const moment of MOMENTS) {
      const level = moment.altitude;
      const crossed = moment.rising
        ? altitude < level && next >= level
        : altitude > level && next <= level;
      if (crossed) {
        keyframes.push({
          period: moment.period,
          at: at + ((level - altitude) / (next - altitude)) * step,
        });
      }
    }
    const noon = before < altitude && altitude >= next;
    if (noon && altitude >= LOW_DAY && altitude < 20) keyframes.push({ period: 'day', at });
    before = altitude;
    altitude = next;
    at += step;
  }
  return keyframes.toSorted((a, b) => a.at - b.at);
}

export interface Blend {
  /** Shown in full, with `to` over it. */
  from: Period;
  to: Period;
  /** How much of `to` shows, from 0 to 1. */
  mix: number;
  /** The picture after `to`, to load before it's needed. */
  next?: Period;
}

/** The wallpaper at `date`: the two pictures it's between, and how far from one to the other. */
export function blendAt(date: Date, place: Place): Blend {
  const time = date.getTime();
  const keyframes = keyframesAround(date, place);
  const after = keyframes.findIndex((keyframe) => keyframe.at > time);
  const from = keyframes[after === -1 ? keyframes.length - 1 : after - 1];
  const to = keyframes[after];
  // No moments for days, as in the midnight sun or the polar night.
  if (!from || !to) {
    const period = sun(date, place) > 0 ? 'day' : 'night';
    return { from: period, to: period, mix: 0 };
  }
  const next = keyframes.slice(after).find((keyframe) => keyframe.period !== to.period)?.period;
  if (from.period === to.period) return { from: from.period, to: to.period, mix: 0, next };
  // Steadily, from one moment to the next: the pictures are made to crossfade, so none lingers.
  return { from: from.period, to: to.period, mix: (time - from.at) / (to.at - from.at), next };
}

/** How fast playing the day goes while the sky is changing, the same everywhere, so a slow sunset
 * takes longer than a quick one, as it does: 20 minutes a second. */
const TWILIGHT = (20 * MINUTE) / 1000;
/** On a stretch of one picture, as day or night: long enough to get up to speed and back gently. */
const STRETCH = 3000;

/**
 * Playing through a day from `start`: given the ms since it began, the time to show, until it's
 * back at `start` a day later. Wherever the sky is changing, it goes at one steady pace, the same
 * everywhere, so a long northern sunset plays for longer than a quick one on the equator. Night
 * and day, when nothing changes, are fast-forwarded, picking up speed from the pace before and
 * slowing to the one after, so the clock and the sun glide into and out of them.
 */
export function tour(start: Date, place: Place): (elapsed: number) => Date | undefined {
  const begin = start.getTime();
  const end = begin + DAY;
  const keyframes = keyframesAround(new Date(begin + DAY / 2), place);
  const points = [
    begin,
    ...keyframes.filter(({ at }) => at > begin && at < end).map(({ at }) => at),
    end,
  ];
  const legs: { from: number; to: number; ms: number; stretch: boolean }[] = [];
  for (let i = 0; i + 1 < points.length; i++) {
    const from = points[i] ?? begin;
    const to = points[i + 1] ?? end;
    // The stretch between the moments around this leg, of which it may be only a part.
    const before = keyframes.findLast(({ at }) => at <= from);
    const after = keyframes.find(({ at }) => at >= to);
    const stretch = !before || !after || before.period === after.period;
    // Every night or day gets the same time, the part where playing starts or ends too, so it has
    // room to ease in or out.
    const ms = stretch ? STRETCH : (to - from) / TWILIGHT;
    legs.push({ from, to, ms, stretch });
  }
  // The pace of a change, which a stretch next to it picks up from or slows to; at the start and
  // end of playing, a standstill.
  const pace = (leg: (typeof legs)[number] | undefined) =>
    leg && !leg.stretch ? (leg.to - leg.from) / leg.ms : 0;
  // A stretch may come out shorter than planned, which leaves its neighbours' paces as they are.
  const ways = legs.map((leg, index) => {
    if (!leg.stretch) return (share: number) => (leg.to - leg.from) * share;
    const a = pace(legs[index - 1]);
    const b = pace(legs[index + 1]);
    const { ms, along } = glide(leg.to - leg.from, leg.ms, a, b);
    leg.ms = ms;
    return along;
  });
  return (elapsed) => {
    elapsed = Math.max(elapsed, 0);
    for (const [index, leg] of legs.entries()) {
      if (elapsed < leg.ms) return new Date(leg.from + (ways[index]?.(elapsed / leg.ms) ?? 0));
      elapsed -= leg.ms;
    }
    return undefined;
  };
}

/**
 * Crossing `distance` of the day in about `ms`, from pace `a` to pace `b`: how long it takes, and
 * how far it's got `share` of the way through. The smoothest way across, the "minimum jerk"
 * curve: it leaves and arrives at exactly its neighbours' paces with no sudden change in
 * acceleration, building up and settling down gradually in between. A distance too short for its
 * neighbours' pace, where it would have to double back to use all the time, takes less.
 */
function glide(
  distance: number,
  ms: number,
  a: number,
  b: number,
): { ms: number; along: (share: number) => number } {
  for (let time = ms; time > ms / 20; time *= 0.9) {
    const start = a * time;
    const end = b * time;
    const along = (u: number) =>
      distance * (10 * u ** 3 - 15 * u ** 4 + 6 * u ** 5) +
      start * (u - 6 * u ** 3 + 8 * u ** 4 - 3 * u ** 5) +
      end * (-4 * u ** 3 + 7 * u ** 4 - 3 * u ** 5);
    let forwards = true;
    for (let step = 1; step <= 64 && forwards; step++) {
      forwards = along(step / 64) >= along((step - 1) / 64);
    }
    if (forwards) return { ms: time, along: (share) => along(Math.min(Math.max(share, 0), 1)) };
  }
  return { ms, along: (share) => distance * share };
}

const RAD = Math.PI / 180;

/**
 * The sun's height above the horizon, in degrees. The usual
 * low-precision formulas, good to a fraction of a degree, which is a minute or two of the day.
 */
export function sun(date: Date, { latitude, longitude }: Place): number {
  // Days since noon UTC on 1 January 2000.
  const days = date.getTime() / 86_400_000 - 10_957.5;
  const anomaly = (357.529 + 0.985_600_28 * days) * RAD;
  const meanLongitude = 280.459 + 0.985_647_36 * days;
  const eclipticLongitude =
    (meanLongitude + 1.915 * Math.sin(anomaly) + 0.02 * Math.sin(2 * anomaly)) * RAD;
  const obliquity = (23.439 - 0.000_000_36 * days) * RAD;
  const rightAscension = Math.atan2(
    Math.cos(obliquity) * Math.sin(eclipticLongitude),
    Math.cos(eclipticLongitude),
  );
  const declination = Math.asin(Math.sin(obliquity) * Math.sin(eclipticLongitude));
  const siderealTime = (280.460_618_37 + 360.985_647_366_29 * days) * RAD;
  const hourAngle = siderealTime + longitude * RAD - rightAscension;
  const lat = latitude * RAD;
  const altitude = Math.asin(
    Math.sin(lat) * Math.sin(declination) +
      Math.cos(lat) * Math.cos(declination) * Math.cos(hourAngle),
  );
  return altitude / RAD;
}
