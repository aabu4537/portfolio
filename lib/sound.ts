// Genesis-style PSG sound effects, synthesized with the Web Audio API.
// No audio files: square waves and a noise burst, like the real console.

let ctx: AudioContext | null = null;
let enabled = true;
let loaded = false;

const KEY = "cc26_sound";

function ensureLoaded() {
  if (loaded) return;
  loaded = true;
  try {
    enabled = window.localStorage.getItem(KEY) !== "0";
  } catch {}
}

export function soundEnabled(): boolean {
  ensureLoaded();
  return enabled;
}

export function setSoundEnabled(on: boolean) {
  ensureLoaded();
  enabled = on;
  try {
    window.localStorage.setItem(KEY, on ? "1" : "0");
  } catch {}
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(
  freq: number,
  start: number,
  dur: number,
  opts: { type?: OscillatorType; vol?: number; slideTo?: number } = {}
) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = opts.type ?? "square";
  const t0 = c.currentTime + start;
  osc.frequency.setValueAtTime(freq, t0);
  if (opts.slideTo) osc.frequency.exponentialRampToValueAtTime(opts.slideTo, t0 + dur);
  const v = opts.vol ?? 0.05;
  gain.gain.setValueAtTime(v, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

/** Cursor move: short single blip. */
export function sfxBlip() {
  ensureLoaded();
  if (!enabled) return;
  tone(760, 0, 0.055, { vol: 0.035 });
}

/** Confirm / press start: rising two-tone. */
export function sfxConfirm() {
  ensureLoaded();
  if (!enabled) return;
  tone(660, 0, 0.07);
  tone(990, 0.075, 0.09);
}

/** Kickoff: referee peep-peep. */
export function sfxWhistle() {
  ensureLoaded();
  if (!enabled) return;
  tone(2150, 0, 0.11, { vol: 0.04, slideTo: 2350 });
  tone(2150, 0.16, 0.2, { vol: 0.04, slideTo: 2450 });
}

/** Ball kick: low thump. */
export function sfxKick() {
  ensureLoaded();
  if (!enabled) return;
  tone(150, 0, 0.16, { type: "sine", vol: 0.09, slideTo: 45 });
}
