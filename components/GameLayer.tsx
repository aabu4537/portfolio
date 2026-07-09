"use client";

import { useEffect, useRef, useState } from "react";
import { identity, modes } from "@/lib/content";

const SEEN_KEY = "cc26_seen_intro";

export default function GameLayer({ forcePlay }: { forcePlay: boolean }) {
  // "boot": deciding whether to show; "title" | "menu": game visible; "done": hidden
  const [phase, setPhase] = useState<"boot" | "title" | "menu" | "done">("boot");
  const [sel, setSel] = useState(0);
  const [kicked, setKicked] = useState(false);
  const [wiping, setWiping] = useState(false);
  const phaseRef = useRef(phase);
  const selRef = useRef(sel);
  phaseRef.current = phase;
  selRef.current = sel;

  // Decide on mount: returning visitors skip the intro unless ?play=1
  useEffect(() => {
    let seen = false;
    try {
      seen = window.localStorage.getItem(SEEN_KEY) === "1";
    } catch {}
    if (seen && !forcePlay) {
      setPhase("done");
    } else {
      setPhase("title");
    }
  }, [forcePlay]);

  // Lock body scroll while the game layer is visible
  useEffect(() => {
    document.body.style.overflow =
      phase === "title" || phase === "menu" ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  function markSeen() {
    try {
      window.localStorage.setItem(SEEN_KEY, "1");
    } catch {}
  }

  function kickoff(target: string) {
    markSeen();
    setWiping(true);
    window.setTimeout(() => {
      setPhase("done");
      document.getElementById(target)?.scrollIntoView({ block: "start" });
    }, 300);
    window.setTimeout(() => setWiping(false), 700);
  }

  function skip(e: React.MouseEvent) {
    e.preventDefault();
    markSeen();
    setPhase("done");
    window.scrollTo(0, 0);
  }

  // Keyboard: Enter/Space on title -> menu; arrows + Enter in menu
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const p = phaseRef.current;
      if (p === "title" && (e.key === "Enter" || e.key === " ")) {
        setPhase("menu");
      } else if (p === "menu") {
        if (e.key === "ArrowDown") setSel((s) => (s + 1) % modes.length);
        if (e.key === "ArrowUp") setSel((s) => (s - 1 + modes.length) % modes.length);
        if (e.key === "Enter") kickoff(modes[selRef.current].target);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "boot" || phase === "done") {
    return wiping ? <div className="wipe go" /> : null;
  }

  return (
    <>
      <div className={`game${phase === "menu" ? " mode" : ""}`}>
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
              <button className="px pressstart" onClick={() => setPhase("menu")} type="button">
                PRESS START
              </button>
            </div>
          </>
        )}

        {phase === "menu" && (
          <div className="modeselect">
            <div className="menupanel">
              <h2 className="px">SELECT MODE</h2>
              {modes.map((m, i) => (
                <button
                  key={m.target}
                  className={`menuitem px${i === sel ? " sel" : ""}`}
                  onMouseEnter={() => setSel(i)}
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

        <p className="px copyline">&copy; 2026 BUSHARA SPORTS SOFTWARE</p>
      </div>
      {wiping && <div className="wipe go" />}
    </>
  );
}
