import { squad, bench, type Player } from "@/lib/content";
import type { CSSProperties } from "react";

const lines: { key: Player["line"]; label: string }[] = [
  { key: "atk", label: "ATTACK" },
  { key: "mid", label: "MIDFIELD" },
  { key: "def", label: "DEFENSE" },
  { key: "gk", label: "GOALKEEPER" },
];

function PlayerButton({ p }: { p: Player }) {
  const style = {
    "--kit": p.kit,
    "--kit2": p.kit2,
    "--skin": p.skin,
    ...(p.shorts ? { "--shorts": p.shorts } : {}),
  } as CSSProperties;
  return (
    <button className="player" style={style} type="button">
      <svg className="sprite" aria-hidden="true">
        <use href="#footballer" />
      </svg>
      <b>{p.skill}</b>
      <i>{p.position}</i>
      <span className="statcard" role="tooltip">
        <span className="cardname px">{p.skill}</span>
        {p.card}
      </span>
    </button>
  );
}

export default function Formation() {
  return (
    <>
      <div className="pitch">
        {lines.map((line) => (
          <div key={line.key}>
            <p className="rowlabel">{line.label}</p>
            <div className={`pitchrow${line.key === "atk" ? " toprow" : ""}`}>
              {squad
                .filter((p) => p.line === line.key)
                .map((p) => (
                  <PlayerButton key={p.skill} p={p} />
                ))}
            </div>
          </div>
        ))}
      </div>
      <p className="formhint">Hover or tap a player for the scouting report.</p>
      <p className="benchnote">
        <strong>On the bench:</strong> {bench}.
      </p>
    </>
  );
}
