"use client";

import { useEffect, useRef, useState } from "react";

/* Logical resolution; upscaled by CSS with image-rendering: pixelated */
const W = 320;
const H = 180;
const FIELD = { left: 14, right: 306, top: 16, bottom: 172 };
const GOAL_TOP = 76;
const GOAL_BOT = 104;
const GOAL_DEPTH = 7;
const CX = 160;
const CY = 90;

const MATCH_SPEED = 1.5; // match minutes per real second: 90' in 60s
const HUMAN_SPEED = 64;
const AI_SPEED = 50;
const CAPTURE_R = 5;
const GK_CAPTURE_R = 8;
const TACKLE_R = 11;

const KITS = {
  home: { kit: "#D82800", kit2: "#F8F8F8", shorts: "#F8F8F8" },
  homeGk: { kit: "#F8D800", kit2: "#101040", shorts: "#101040" },
  away: { kit: "#58B8F8", kit2: "#F8F8F8", shorts: "#101040" },
  awayGk: { kit: "#101040", kit2: "#F8D800", shorts: "#101040" },
};
const SKINS = ["#8D5524", "#C68642", "#E0AC69"];

/* Per-team home spots, team 0 attacking right; team 1 is mirrored. Index 0 is the GK. */
const HOMES: [number, number][] = [
  [26, 90],
  [72, 52],
  [72, 128],
  [116, 90],
  [150, 72],
];

interface Man {
  x: number;
  y: number;
  hx: number;
  hy: number;
  team: 0 | 1;
  gk: boolean;
  fx: number;
  fy: number;
  moving: boolean;
  skin: string;
}

type Mode = "kickoff" | "play" | "goal" | "fulltime";

interface World {
  men: Man[];
  ball: { x: number; y: number; vx: number; vy: number };
  owner: number | null;
  lastKicker: number | null;
  kickCooldown: number;
  stealGrace: number;
  gkHold: number;
  controlled: number;
  score: [number, number];
  clock: number;
  mode: Mode;
  phaseT: number;
  kickoffTeam: 0 | 1;
}

interface Input {
  keys: Set<string>;
  joyOn: boolean;
  joyX: number;
  joyY: number;
  shoot: boolean;
  pass: boolean;
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function makeMen(): Man[] {
  const men: Man[] = [];
  ([0, 1] as const).forEach((team) => {
    HOMES.forEach(([hx, hy], i) => {
      const x = team === 0 ? hx : W - hx;
      men.push({
        x,
        y: hy,
        hx: x,
        hy,
        team,
        gk: i === 0,
        fx: team === 0 ? 1 : -1,
        fy: 0,
        moving: false,
        skin: SKINS[(i + team * 2) % 3],
      });
    });
  });
  return men;
}

function placeKickoff(w: World, team: 0 | 1) {
  w.men.forEach((m) => {
    m.x = m.hx;
    m.y = m.hy;
    m.fx = m.team === 0 ? 1 : -1;
    m.fy = 0;
    m.moving = false;
  });
  const striker = team === 0 ? 4 : 9;
  const s = w.men[striker];
  s.x = CX + (team === 0 ? -8 : 8);
  s.y = CY;
  w.ball = { x: CX, y: CY, vx: 0, vy: 0 };
  w.owner = striker;
  w.lastKicker = null;
  w.kickCooldown = 0;
  w.stealGrace = 1;
  w.gkHold = 0;
  w.controlled = 4;
  w.mode = "kickoff";
  w.phaseT = 1.1;
  w.kickoffTeam = team;
}

function freshWorld(): World {
  const w: World = {
    men: makeMen(),
    ball: { x: CX, y: CY, vx: 0, vy: 0 },
    owner: null,
    lastKicker: null,
    kickCooldown: 0,
    stealGrace: 0,
    gkHold: 0,
    controlled: 4,
    score: [0, 0],
    clock: 0,
    mode: "kickoff",
    phaseT: 1.2,
    kickoffTeam: 0,
  };
  placeKickoff(w, 0);
  return w;
}

function clampMan(m: Man) {
  m.x = clamp(m.x, FIELD.left + 2, FIELD.right - 2);
  m.y = clamp(m.y, FIELD.top + 3, FIELD.bottom - 1);
}

function moveToward(m: Man, tx: number, ty: number, speed: number, dt: number) {
  const dx = tx - m.x;
  const dy = ty - m.y;
  const d = Math.hypot(dx, dy);
  if (d < 1) {
    m.moving = false;
    return;
  }
  const step = Math.min(d, speed * dt);
  m.x += (dx / d) * step;
  m.y += (dy / d) * step;
  m.fx = dx / d;
  m.fy = dy / d;
  m.moving = true;
  clampMan(m);
}

function takeBall(w: World, i: number) {
  w.owner = i;
  w.stealGrace = 0.5;
  w.gkHold = w.men[i].gk ? 0.8 : 0;
}

function kickBall(w: World, from: number, tx: number, ty: number, speed: number) {
  const b = w.ball;
  const dx = tx - b.x;
  const dy = ty - b.y;
  const d = Math.hypot(dx, dy) || 1;
  b.vx = (dx / d) * speed;
  b.vy = (dy / d) * speed;
  const kicker = w.men[from];
  kicker.fx = dx / d;
  kicker.fy = dy / d;
  w.owner = null;
  w.lastKicker = from;
  w.kickCooldown = 0.4;
}

function goal(w: World, team: 0 | 1) {
  w.score[team]++;
  w.mode = "goal";
  w.phaseT = 1.8;
  w.kickoffTeam = team === 0 ? 1 : 0;
  w.ball.vx *= 0.2;
  w.ball.vy *= 0.2;
}

function ballFly(w: World, dt: number, detectGoals: boolean) {
  const b = w.ball;
  b.x += b.vx * dt;
  b.y += b.vy * dt;
  const f = Math.exp(-1.6 * dt);
  b.vx *= f;
  b.vy *= f;
  if (b.y < FIELD.top) {
    b.y = FIELD.top;
    b.vy = -b.vy * 0.65;
  }
  if (b.y > FIELD.bottom) {
    b.y = FIELD.bottom;
    b.vy = -b.vy * 0.65;
  }
  const inMouth = b.y > GOAL_TOP + 1 && b.y < GOAL_BOT - 1;
  if (b.x < FIELD.left) {
    if (inMouth) {
      if (detectGoals && b.x < FIELD.left - 3) {
        goal(w, 1);
        return;
      }
      if (b.x < FIELD.left - GOAL_DEPTH + 2) {
        b.x = FIELD.left - GOAL_DEPTH + 2;
        b.vx = -b.vx * 0.4;
      }
    } else {
      b.x = FIELD.left;
      b.vx = -b.vx * 0.65;
    }
  }
  if (b.x > FIELD.right) {
    if (inMouth) {
      if (detectGoals && b.x > FIELD.right + 3) {
        goal(w, 0);
        return;
      }
      if (b.x > FIELD.right + GOAL_DEPTH - 2) {
        b.x = FIELD.right + GOAL_DEPTH - 2;
        b.vx = -b.vx * 0.4;
      }
    } else {
      b.x = FIELD.right;
      b.vx = -b.vx * 0.65;
    }
  }
}

function tryCapture(w: World) {
  const b = w.ball;
  let best = -1;
  let bd = 1e9;
  w.men.forEach((m, i) => {
    if (i === w.lastKicker && w.kickCooldown > 0) return;
    const r = m.gk ? GK_CAPTURE_R : CAPTURE_R;
    const d = dist(m, b);
    if (d < r && d < bd) {
      best = i;
      bd = d;
    }
  });
  if (best >= 0) takeBall(w, best);
}

function gkAI(w: World, m: Man, i: number, dt: number) {
  if (w.owner === i) return; // holding the ball: stand still until the punt
  const ty = clamp(w.ball.y, GOAL_TOP + 2, GOAL_BOT - 2);
  moveToward(m, m.hx, ty, 42, dt);
}

function carrierAI(w: World, i: number, dt: number) {
  const m = w.men[i];
  const gy = clamp(CY + (m.y - CY) * 0.3, GOAL_TOP, GOAL_BOT);
  moveToward(m, FIELD.left + 4, gy, AI_SPEED - 4, dt);

  // pass when pressed
  let pressure = 1e9;
  for (let j = 0; j < 5; j++) pressure = Math.min(pressure, dist(w.men[j], m));
  if (pressure < 14 && Math.random() < dt * 2.5) {
    let mate = -1;
    let mx = m.x - 5;
    for (let j = 6; j < 10; j++) {
      if (j !== i && w.men[j].x < mx) {
        mate = j;
        mx = w.men[j].x;
      }
    }
    if (mate >= 0) {
      kickBall(w, i, w.men[mate].x, w.men[mate].y, 120);
      return;
    }
  }
  // shoot in range
  if (m.x < 70 || (m.x < 110 && Math.random() < dt * 1.2)) {
    const aim = clamp(CY + (Math.random() * 2 - 1) * 14, GOAL_TOP + 2, GOAL_BOT - 2);
    kickBall(w, i, FIELD.left - 2, aim, 165);
  }
}

function humanShoot(w: World) {
  const c = w.men[w.controlled];
  const aim = clamp(c.y + c.fy * 40 + (Math.random() * 2 - 1) * 5, GOAL_TOP + 3, GOAL_BOT - 3);
  kickBall(w, w.controlled, FIELD.right + 3, aim, 180);
}

function humanPass(w: World) {
  const c = w.men[w.controlled];
  let best = -1;
  let bs = -1e9;
  for (let i = 1; i < 5; i++) {
    if (i === w.controlled) continue;
    const m = w.men[i];
    const d = dist(c, m) || 1;
    const dot = (c.fx * (m.x - c.x)) / d + (c.fy * (m.y - c.y)) / d;
    const score = (m.x - c.x) * 0.6 - d * 0.25 + dot * 30;
    if (score > bs) {
      bs = score;
      best = i;
    }
  }
  if (best >= 0) {
    const m = w.men[best];
    kickBall(w, w.controlled, m.x + m.fx * 6, m.y + m.fy * 6, 120);
  }
}

function step(w: World, inp: Input, dt: number) {
  if (w.mode === "fulltime") return;
  w.kickCooldown = Math.max(0, w.kickCooldown - dt);
  w.stealGrace = Math.max(0, w.stealGrace - dt);

  if (w.mode === "kickoff") {
    w.phaseT -= dt;
    if (w.phaseT <= 0) w.mode = "play";
    inp.shoot = inp.pass = false;
    return;
  }
  if (w.mode === "goal") {
    w.phaseT -= dt;
    if (w.owner === null) ballFly(w, dt, false);
    if (w.phaseT <= 0) placeKickoff(w, w.kickoffTeam);
    inp.shoot = inp.pass = false;
    return;
  }

  // ---- play ----
  w.clock += dt;
  if (w.clock * MATCH_SPEED >= 90) {
    w.mode = "fulltime";
    inp.shoot = inp.pass = false;
    return;
  }

  const { men, ball } = w;

  // which home player the human controls
  if (w.owner !== null && men[w.owner].team === 0 && !men[w.owner].gk) {
    w.controlled = w.owner;
  } else {
    let bd = dist(men[w.controlled], ball);
    for (let i = 1; i < 5; i++) {
      const d = dist(men[i], ball);
      if (d < bd - 8) {
        bd = d;
        w.controlled = i;
      }
    }
  }

  // human movement
  const c = men[w.controlled];
  let ix = 0;
  let iy = 0;
  if (inp.joyOn) {
    ix = inp.joyX;
    iy = inp.joyY;
  } else {
    if (inp.keys.has("ArrowLeft") || inp.keys.has("KeyA")) ix -= 1;
    if (inp.keys.has("ArrowRight") || inp.keys.has("KeyD")) ix += 1;
    if (inp.keys.has("ArrowUp") || inp.keys.has("KeyW")) iy -= 1;
    if (inp.keys.has("ArrowDown") || inp.keys.has("KeyS")) iy += 1;
  }
  const mag = Math.hypot(ix, iy);
  if (mag > 0.2) {
    const nx = ix / mag;
    const ny = iy / mag;
    const throttle = Math.min(mag, 1);
    c.x += nx * HUMAN_SPEED * throttle * dt;
    c.y += ny * HUMAN_SPEED * throttle * dt;
    c.fx = nx;
    c.fy = ny;
    c.moving = true;
    clampMan(c);
  } else {
    c.moving = false;
  }

  // one away player presses the ball whenever they don't have it
  const awayOwns = w.owner !== null && men[w.owner].team === 1;
  let chaser = -1;
  if (!awayOwns) {
    let bd = 1e9;
    for (let i = 6; i < 10; i++) {
      const d = dist(men[i], ball);
      if (d < bd) {
        bd = d;
        chaser = i;
      }
    }
  }

  men.forEach((m, i) => {
    if (i === w.controlled) return;
    if (m.gk) {
      gkAI(w, m, i, dt);
      return;
    }
    if (w.owner === i) {
      if (m.team === 1) carrierAI(w, i, dt);
      return;
    }
    if (i === chaser) {
      moveToward(m, ball.x, ball.y, AI_SPEED, dt);
      if (
        w.owner !== null &&
        men[w.owner].team === 0 &&
        dist(m, ball) < TACKLE_R &&
        w.stealGrace <= 0 &&
        Math.random() < dt * 2.2
      ) {
        takeBall(w, i);
      }
      return;
    }
    // hold formation, stretched toward the ball
    const tx = clamp(m.hx + (ball.x - CX) * 0.35, FIELD.left + 4, FIELD.right - 4);
    const ty = clamp(m.hy + (ball.y - CY) * 0.3, FIELD.top + 4, FIELD.bottom - 4);
    moveToward(m, tx, ty, AI_SPEED * 0.8, dt);
  });

  // human actions
  if (inp.shoot) {
    inp.shoot = false;
    if (w.owner === w.controlled) {
      humanShoot(w);
    } else if (w.owner !== null && men[w.owner].team === 1 && dist(c, ball) < TACKLE_R && w.stealGrace <= 0) {
      takeBall(w, w.controlled);
    }
  }
  if (inp.pass) {
    inp.pass = false;
    if (w.owner === w.controlled) {
      humanPass(w);
    } else {
      // off the ball: force-switch to the man nearest the ball
      let bd = 1e9;
      for (let i = 1; i < 5; i++) {
        const d = dist(men[i], ball);
        if (d < bd) {
          bd = d;
          w.controlled = i;
        }
      }
    }
  }

  // keepers hold, then punt clear
  if (w.owner !== null && men[w.owner].gk) {
    w.gkHold -= dt;
    if (w.gkHold <= 0) {
      const g = men[w.owner];
      kickBall(w, w.owner, g.team === 0 ? 230 : 90, 40 + Math.random() * 100, 150);
    }
  }

  // ball
  if (w.owner !== null) {
    const o = men[w.owner];
    ball.x = clamp(o.x + o.fx * 5, FIELD.left + 2, FIELD.right - 2);
    ball.y = clamp(o.y - 1 + o.fy * 4, FIELD.top + 2, FIELD.bottom - 2);
    ball.vx = 0;
    ball.vy = 0;
  } else {
    ballFly(w, dt, true);
    if (w.owner === null && (w.mode as Mode) === "play") tryCapture(w);
  }
}

/* ---------- rendering ---------- */

function lineRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillRect(x, y, w, 1);
  ctx.fillRect(x, y + h - 1, w, 1);
  ctx.fillRect(x, y, 1, h);
  ctx.fillRect(x + w - 1, y, 1, h);
}

function drawPitch(ctx: CanvasRenderingContext2D) {
  for (let x = 0; x < W; x += 32) {
    ctx.fillStyle = (x / 32) % 2 === 0 ? "#1E7A2E" : "#27913A";
    ctx.fillRect(x, 0, 32, H);
  }
  ctx.fillStyle = "rgba(248,248,248,.7)";
  lineRect(ctx, FIELD.left, FIELD.top, FIELD.right - FIELD.left + 1, FIELD.bottom - FIELD.top + 1);
  ctx.fillRect(CX, FIELD.top, 1, FIELD.bottom - FIELD.top);
  lineRect(ctx, FIELD.left, CY - 32, 30, 64);
  lineRect(ctx, FIELD.right - 29, CY - 32, 30, 64);
  ctx.fillRect(FIELD.left + 22, CY, 1, 1);
  ctx.fillRect(FIELD.right - 22, CY, 1, 1);
  ctx.strokeStyle = "rgba(248,248,248,.7)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(CX + 0.5, CY + 0.5, 22, 0, Math.PI * 2);
  ctx.stroke();
  // goals
  ctx.fillStyle = "rgba(10,10,46,.5)";
  ctx.fillRect(FIELD.left - GOAL_DEPTH, GOAL_TOP, GOAL_DEPTH, GOAL_BOT - GOAL_TOP);
  ctx.fillRect(FIELD.right + 1, GOAL_TOP, GOAL_DEPTH, GOAL_BOT - GOAL_TOP);
  ctx.fillStyle = "#F8F8F8";
  ctx.fillRect(FIELD.left - GOAL_DEPTH, GOAL_TOP - 1, GOAL_DEPTH + 1, 1);
  ctx.fillRect(FIELD.left - GOAL_DEPTH, GOAL_BOT, GOAL_DEPTH + 1, 1);
  ctx.fillRect(FIELD.left - GOAL_DEPTH, GOAL_TOP - 1, 1, GOAL_BOT - GOAL_TOP + 2);
  ctx.fillRect(FIELD.right, GOAL_TOP - 1, GOAL_DEPTH + 1, 1);
  ctx.fillRect(FIELD.right, GOAL_BOT, GOAL_DEPTH + 1, 1);
  ctx.fillRect(FIELD.right + GOAL_DEPTH, GOAL_TOP - 1, 1, GOAL_BOT - GOAL_TOP + 2);
}

function drawMan(ctx: CanvasRenderingContext2D, m: Man, i: number, controlled: boolean, t: number) {
  const kit = m.gk ? (m.team === 0 ? KITS.homeGk : KITS.awayGk) : m.team === 0 ? KITS.home : KITS.away;
  const px = Math.round(m.x) - 3;
  const py = Math.round(m.y) - 11;
  ctx.fillStyle = "rgba(0,0,0,.3)";
  ctx.fillRect(px, Math.round(m.y) - 1, 6, 2);
  if (controlled) {
    ctx.fillStyle = "#F8D800";
    ctx.fillRect(px + 1, py - 6, 5, 1);
    ctx.fillRect(px + 2, py - 5, 3, 1);
    ctx.fillRect(px + 3, py - 4, 1, 1);
  }
  ctx.fillStyle = "#2A1608";
  ctx.fillRect(px + 1, py, 4, 1);
  ctx.fillStyle = m.skin;
  ctx.fillRect(px + 1, py + 1, 4, 2);
  ctx.fillStyle = kit.kit;
  ctx.fillRect(px, py + 3, 6, 4);
  ctx.fillStyle = kit.kit2;
  ctx.fillRect(px + 2, py + 3, 2, 4);
  ctx.fillStyle = kit.shorts;
  ctx.fillRect(px + 1, py + 7, 4, 1);
  const lift = m.moving ? Math.floor(t * 9 + i * 3) % 2 : -1;
  const la = lift === 0 ? 1 : 0;
  const lb = lift === 1 ? 1 : 0;
  ctx.fillStyle = m.skin;
  ctx.fillRect(px + 1, py + 8 - la, 1, 2);
  ctx.fillRect(px + 4, py + 8 - lb, 1, 2);
  ctx.fillStyle = "#141414";
  ctx.fillRect(px, py + 10 - la, 2, 1);
  ctx.fillRect(px + 4, py + 10 - lb, 2, 1);
}

function drawBall(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const bx = Math.round(x);
  const by = Math.round(y);
  ctx.fillStyle = "rgba(0,0,0,.3)";
  ctx.fillRect(bx - 1, by - 1, 3, 1);
  ctx.fillStyle = "#F8F8F8";
  ctx.fillRect(bx - 1, by - 4, 3, 3);
  ctx.fillStyle = "#101040";
  ctx.fillRect(bx, by - 3, 1, 1);
}

function draw(ctx: CanvasRenderingContext2D, w: World, t: number) {
  drawPitch(ctx);
  const order = w.men.map((_, i) => i).sort((a, b) => w.men[a].y - w.men[b].y);
  let ballDrawn = false;
  order.forEach((i) => {
    const m = w.men[i];
    if (!ballDrawn && w.ball.y < m.y - 1) {
      drawBall(ctx, w.ball.x, w.ball.y);
      ballDrawn = true;
    }
    drawMan(ctx, m, i, i === w.controlled && w.mode !== "fulltime", t);
  });
  if (!ballDrawn) drawBall(ctx, w.ball.x, w.ball.y);
}

/* ---------- component ---------- */

export default function MatchGame({
  onExit,
  onViewResume,
}: {
  onExit: () => void;
  onViewResume: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const worldRef = useRef<World | null>(null);
  if (worldRef.current === null) worldRef.current = freshWorld();
  const inputRef = useRef<Input>({ keys: new Set(), joyOn: false, joyX: 0, joyY: 0, shoot: false, pass: false });
  const cbs = useRef({ onExit, onViewResume });
  cbs.current = { onExit, onViewResume };
  const joyPad = useRef<HTMLDivElement | null>(null);
  const joyThumb = useRef<HTMLDivElement | null>(null);
  const [hud, setHud] = useState({ home: 0, away: 0, minute: 0, mode: "kickoff" as Mode });

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const GAME_KEYS = [
      "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
      "KeyW", "KeyA", "KeyS", "KeyD", "KeyX", "KeyZ", "Space",
    ];
    function onKeyDown(e: KeyboardEvent) {
      if (e.code === "Escape") {
        cbs.current.onExit();
        return;
      }
      if (!GAME_KEYS.includes(e.code)) return;
      e.preventDefault();
      if (!e.repeat) {
        if (e.code === "KeyX" || e.code === "Space") inputRef.current.shoot = true;
        if (e.code === "KeyZ") inputRef.current.pass = true;
      }
      inputRef.current.keys.add(e.code);
    }
    function onKeyUp(e: KeyboardEvent) {
      inputRef.current.keys.delete(e.code);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    let raf = 0;
    let last = performance.now();
    let lastHud = "";
    function frame(now: number) {
      const w = worldRef.current!;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      step(w, inputRef.current, dt);
      draw(ctx!, w, now / 1000);
      const minute = Math.min(90, Math.floor(w.clock * MATCH_SPEED));
      const key = `${w.score[0]}-${w.score[1]}-${minute}-${w.mode}`;
      if (key !== lastHud) {
        lastHud = key;
        setHud({ home: w.score[0], away: w.score[1], minute, mode: w.mode });
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  function restart() {
    worldRef.current = freshWorld();
    setHud({ home: 0, away: 0, minute: 0, mode: "kickoff" });
  }

  function joyUpdate(e: React.PointerEvent) {
    const pad = joyPad.current;
    if (!pad) return;
    const r = pad.getBoundingClientRect();
    let dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    let dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    const m = Math.hypot(dx, dy);
    if (m > 1) {
      dx /= m;
      dy /= m;
    }
    inputRef.current.joyX = dx;
    inputRef.current.joyY = dy;
    if (joyThumb.current) joyThumb.current.style.transform = `translate(${dx * 26}px, ${dy * 26}px)`;
  }
  function joyDown(e: React.PointerEvent) {
    joyPad.current?.setPointerCapture(e.pointerId);
    inputRef.current.joyOn = true;
    joyUpdate(e);
  }
  function joyMove(e: React.PointerEvent) {
    if (inputRef.current.joyOn) joyUpdate(e);
  }
  function joyUp() {
    inputRef.current.joyOn = false;
    inputRef.current.joyX = 0;
    inputRef.current.joyY = 0;
    if (joyThumb.current) joyThumb.current.style.transform = "translate(0,0)";
  }

  const result =
    hud.home > hud.away
      ? "BUSHARA FC WIN! WHAT A SIGNING."
      : hud.home < hud.away
        ? "DEADLINE UTD EDGE IT. THE RESUME REMAINS UNDEFEATED."
        : "ALL SQUARE. SETTLE IT ON THE RESUME.";

  return (
    <div className="matchwrap" onContextMenu={(e) => e.preventDefault()}>
      <canvas ref={canvasRef} width={W} height={H} className="matchcanvas" />

      <div className="matchhud px" aria-live="polite">
        <span className="teamname">BUSHARA FC</span>
        <span className="matchscore">
          {hud.home} - {hud.away}
        </span>
        <span className="teamname">DEADLINE UTD</span>
        <span className="matchclock">{hud.minute}&rsquo;</span>
      </div>

      <button className="px matchquit" onClick={onExit} type="button">
        &laquo; MENU
      </button>

      {hud.mode === "kickoff" && <div className="matchbanner px">KICK OFF</div>}
      {hud.mode === "goal" && <div className="matchbanner px">GOAL!</div>}

      {hud.mode === "fulltime" && (
        <div className="fulltime">
          <div className="ftpanel">
            <p className="px ftlabel">FULL TIME</p>
            <p className="px ftscore">
              {hud.home} - {hud.away}
            </p>
            <p className="px ftresult">{result}</p>
            <div className="ftbtns">
              <button className="px ftbtn" onClick={restart} type="button">
                REMATCH
              </button>
              <button className="px ftbtn" onClick={onViewResume} type="button">
                VIEW RESUME
              </button>
              <button className="px ftbtn" onClick={onExit} type="button">
                MODE SELECT
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="px matchhint kb">ARROWS/WASD MOVE &middot; X SHOOT+TACKLE &middot; Z PASS &middot; ESC MENU</p>

      <div className="touchpads">
        <div
          ref={joyPad}
          className="joy"
          onPointerDown={joyDown}
          onPointerMove={joyMove}
          onPointerUp={joyUp}
          onPointerCancel={joyUp}
        >
          <div ref={joyThumb} className="joythumb" />
        </div>
        <div className="padbtns">
          <button
            className="px padbtn b"
            onPointerDown={() => {
              inputRef.current.pass = true;
            }}
            type="button"
          >
            B
          </button>
          <button
            className="px padbtn"
            onPointerDown={() => {
              inputRef.current.shoot = true;
            }}
            type="button"
          >
            A
          </button>
        </div>
      </div>
    </div>
  );
}
