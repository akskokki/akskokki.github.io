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
const pictures: readonly Picture[] = [
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
  zone: string;
  latitude: number;
  longitude: number;
  /** The zone has no city to go by, such as UTC. */
  guessed: boolean;
}

/** Where the visitor is, as far as their time zone tells. */
export function here(): Place {
  // Temporal knows the zone at once, while Intl first loads its formatting data, which costs a
  // slow phone some 50 ms before the first view. Not every browser has Temporal yet.
  const zone =
    typeof Temporal === 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : Temporal.Now.timeZoneId();
  const city = zones[zone];
  if (city) return { zone, latitude: city[0], longitude: city[1], guessed: false };
  // The sun's timing from the offset, 15° to the hour, at a latitude of middling days.
  return { zone, latitude: 45, longitude: -new Date().getTimezoneOffset() / 4, guessed: true };
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

/** The moments from a day before `date` to a day after, in order. */
export function keyframesAround(date: Date, place: Place): Keyframe[] {
  const keyframes: Keyframe[] = [];
  // Two minutes at a time, finding each moment between two steps.
  const step = 2 * MINUTE;
  const start = date.getTime() - DAY;
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

const RAD = Math.PI / 180;

/**
 * The sun's height above the horizon, in degrees. The usual
 * low-precision formulas, good to a fraction of a degree, which is a minute or two of the day.
 */
function sun(date: Date, { latitude, longitude }: Place): number {
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
