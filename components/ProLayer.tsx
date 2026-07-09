import Link from "next/link";
import { identity, intro, fixtures, project, education } from "@/lib/content";
import Formation from "./Formation";

export default function ProLayer() {
  return (
    <div className="pro" id="pro">
      <nav className="scoreboard">
        <span className="px who">A.BUSHARA</span>
        <a className="px" href="#career">CAREER</a>
        <a className="px" href="#squad">SQUAD</a>
        <a className="px" href="#highlights">HIGHLIGHTS</a>
        <a className="px" href="#education">ACADEMY</a>
        <a className="px" href="#friendlies">CONTACT</a>
        <Link className="coin px" href="/?play=1">&#9679; INSERT COIN</Link>
      </nav>

      <main className="promain">
        <section className="intro">
          <h2>{intro.headline}</h2>
          <p>{intro.body}</p>
          <div className="tags">
            {intro.tags.map((t, i) => (
              <span key={t} className={`tag${i % 2 === 1 ? " alt" : ""}`}>{t}</span>
            ))}
          </div>
        </section>

        <section id="career">
          <div className="sechead">
            <h2 className="px">CAREER MODE</h2>
            <span className="px">FIXTURES &amp; RESULTS</span>
          </div>
          {fixtures.map((f) => (
            <article className="fixture" key={f.club}>
              <header>
                <span className="px club">{f.club}</span>
                <span className="px date">{f.date}</span>
              </header>
              <div className="fixbody">
                <p className="role">{f.role}</p>
                <p className="loc">{f.location}</p>
                <ul>
                  {f.bullets.map((b) => (
                    <li key={b.slice(0, 24)}>{b}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </section>

        <section id="squad">
          <div className="sechead">
            <h2 className="px">SQUAD SELECT</h2>
            <span className="px">FORMATION: 4-3-3</span>
          </div>
          <Formation />
        </section>

        <section id="highlights">
          <div className="sechead">
            <h2 className="px">HIGHLIGHTS</h2>
            <span className="px">MATCH OF THE DAY</span>
          </div>
          <article className="matchcard">
            <header>
              <span className="px club">{project.name}</span>
              <span className="px comp">{project.competition}</span>
            </header>
            <div className="cardbody">
              <div className="statline">
                {project.stats.map((s) => (
                  <div className="stat" key={s.label}>
                    <b>{s.value}</b>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
              <ul>
                {project.bullets.map((b) => (
                  <li key={b.slice(0, 24)}>{b}</li>
                ))}
              </ul>
              <div className="stackchips">
                {project.stack.map((c) => (
                  <span className="chip" key={c}>{c}</span>
                ))}
              </div>
            </div>
          </article>
        </section>

        <section id="education">
          <div className="sechead">
            <h2 className="px">ACADEMY</h2>
            <span className="px">YOUTH DEVELOPMENT</span>
          </div>
          <div className="edu">
            <b>{education.school}</b>, {education.degree}
            <br />
            {education.honors}
          </div>
        </section>

        <section id="friendlies">
          <div className="sechead">
            <h2 className="px">FRIENDLIES</h2>
            <span className="px">ARRANGE A MATCH</span>
          </div>
          <div className="contactrow">
            <a className="btn primary" href={`mailto:${identity.email}`}>EMAIL ME</a>
            <a className="btn" href={identity.github} target="_blank" rel="noopener noreferrer">GITHUB</a>
            <a className="btn" href={identity.linkedin} target="_blank" rel="noopener noreferrer">LINKEDIN</a>
            <a className="btn" href="/resume.pdf" download="AlamBusharaResume.pdf">MATCH PROGRAM (PDF)</a>
          </div>
        </section>
      </main>

      <footer className="sitefooter">
        ALAM BUSHARA &bull; BUILT WITH NEXT.JS
        <br />
        NO SPRITES WERE HARMED &bull; INSPIRED BY 16-BIT FOOTBALL
      </footer>
    </div>
  );
}
