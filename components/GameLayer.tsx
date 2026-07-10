"use client";

import { useEffect, useRef, useState } from "react";
import { identity, modes } from "@/lib/content";
import {
  sfxBlip,
  sfxConfirm,
  sfxWhistle,
  sfxKick,
  soundEnabled,
  setSoundEnabled,
} from "@/lib/sound";
import MatchGame from "./MatchGame";

const MATCH_TARGET = "__match__";
const menuItems = [
  { label: "KICK OFF", sub: "PLAY MATCH", target: MATCH_TARGET },
  ...modes,
];

export default function GameLayer() {
  const [phase, setPhase] = useState<"title" | "menu" | "match" | "done">("title");
  const [sel, setSel] = useState(0);
  const [kicked, setKicked] = useState(false);
  const [wiping, setWiping] = useState(false);
  const [sound, setSound] = useState(true);
  const phaseRef = useRef(phase);
  const selRef = useRef(sel);
  phaseRef.current = phase;
  selRef.current = sel;

  // Read persisted sound preference after mount (avoids hydration mismatch)
  useEffect(() => {
    setSound(soundEnabled());
  }, []);

  // Lock body scroll while the game layer is visible
  useEffect(() => {
    document.body.style.overflow = phase === "done" ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  function toggleSound() {
    const next = !sound;
    setSound(next);
    setSoundEnabled(next);
    if (next) sfxBlip();
  }

  function openMenu() {
    sfxConfirm();
    setPhase("menu");
  }

  function moveSel(i: number) {
    if (i !== selRef.current) sfxBlip();
    setSel((i + menuItems.length) % menuItems.length);
  }

  function kickoff(target: string) {
    sfxWhistle();
    setWiping(true);
    window.setTimeout(() => {
      if (target === MATCH_TARGET) {
        setPhase("match");
      } else {
        setPhase("done");
        document.getElementById(target)?.scrollIntoView({ block: "start" });
      }
    }, 300);
    window.setTimeout(() => setWiping(false), 700);
  }

  function skip(e: React.MouseEvent) {
    e.preventDefault();
    setPhase("done");
    window.scrollTo(0, 0);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const p = phaseRef.current;
      if (p === "title" && (e.key === "Enter" || e.key === " ")) {
        openMenu();
      } else if (p === "menu") {
        if (e.key === "ArrowDown") moveSel(selRef.current + 1);
        if (e.key === "ArrowUp") moveSel(selRef.current - 1);
        if (e.key === "Enter") kickoff(menuItems[selRef.current].target);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "done") {
    return wiping ? <div className="wipe go" /> : null;
  }

  return (
    <>
      <div className={`game${phase === "menu" ? " mode" : ""}`}>
        <button className="soundtoggle px" onClick={toggleSound} type="button">
          SOUND: {sound ? "ON" : "OFF"}
        </button>
        <a className="skiplink px" href="#pro" onClick={skip}>
          SKIP TO RESUME &raquo;
        </a>
        <div className="pitchlines">
          <div className="midline" />
          <div className="circle" />
        </div>

        {phase === "title" && (
          <>
            <button
              className={`kickball${kicked ? " kicked" : ""}`}
              onClick={() => {
                sfxKick();
                setKicked(true);
                window.setTimeout(() => setKicked(false), 1400);
              }}
              aria-label="Kick the ball"
              type="button"
            >
              <svg>
                <use href="#pixelball" />
              </svg>
            </button>
            <div className="titlebox">
              <p className="px title-eyebrow">CAREER CHAMPIONSHIP &rsquo;26</p>
              <h1 className="px gametitle">
                ALAM
                <br />
                BUSHARA
              </h1>
              <p className="px subtitle">{identity.role}</p>
              <button className="px pressstart" onClick={openMenu} type="button">
                PRESS START
              </button>
            </div>
          </>
        )}

        {phase === "menu" && (
          <div className="modeselect">
            <div className="menupanel">
              <h2 className="px">SELECT MODE</h2>
              {menuItems.map((m, i) => (
                <button
                  key={m.target}
                  className={`menuitem px${i === sel ? " sel" : ""}`}
                  onMouseEnter={() => moveSel(i)}
                  onClick={() => kickoff(m.target)}
                  type="button"
                >
                  <span className="ball" />
                  {m.label}
                  <small>{m.sub}</small>
                </button>
              ))}
              <p className="menuhint px">&uarr;&darr; SELECT &nbsp; ENTER CONFIRM</p>
            </div>
          </div>
        )}

        {phase === "match" && (
          <MatchGame
            onExit={() => setPhase("menu")}
            onViewResume={() => kickoff("pro")}
          />
        )}

        {phase !== "match" && (
          <p className="px copyline">&copy; 2026 BUSHARA SPORTS SOFTWARE</p>
        )}
      </div>
      {wiping && <div className="wipe go" />}
    </>
  );
}
