"use client";

import { CSSProperties, useEffect, useMemo, useState } from "react";
import { BookPage, pages, SceneKind } from "@/data/chapters";

type Turn = { from: number; to: number; direction: "next" | "prev" } | null;

function sceneKind(page: BookPage, pageIndex: number): SceneKind {
  if (page.scene) return page.scene;
  if (pageIndex === 0) return "cover";
  const haystack = `${page.title ?? ""} ${page.eyebrow ?? ""} ${page.body ?? ""}`.toLowerCase();
  if (haystack.includes("lantern")) return "lantern";
  if (haystack.includes("cinder")) return "cinder";
  if (haystack.includes("optimizer")) return "optimizer";
  if (haystack.includes("chorus") || haystack.includes("first seal")) return "chorus";
  if (haystack.includes("bunker") || haystack.includes("netwatch") || haystack.includes("boardroom")) return "bunker";
  if (haystack.includes("blackwall") || haystack.includes("wall")) return "blackwall";
  if (haystack.includes("1,200") || haystack.includes("1200") || haystack.includes("agents")) return "swarm";
  if (haystack.includes("night city") || haystack.includes("street")) return "city";
  return "deep";
}

function TextPage({ page, pageIndex, face = false }: { page: BookPage; pageIndex: number; face?: boolean }) {
  return (
    <div className={`paper-page text-page ${pageIndex === 0 ? "cover-page" : ""} ${face ? "face-copy" : ""}`}>
      <div className="paper-grain" />
      <div className="page-content">
        <div className="page-meta">
          <span>{page.eyebrow ?? page.chapter}</span>
          <span>{String(pageIndex + 1).padStart(2, "0")}</span>
        </div>
        {page.title && <h1>{page.title}</h1>}
        {page.body && (
          <div className="prose">
            {page.body.split("\n\n").map((paragraph, p) => (
              <p key={p}>{paragraph}</p>
            ))}
          </div>
        )}
        {page.kicker && <div className="kicker">{page.kicker}</div>}
      </div>
      <div className="paper-edge" />
    </div>
  );
}

function SceneArt({ kind }: { kind: SceneKind }) {
  if (kind === "swarm") return <SwarmPlate />;
  if (kind === "chorus") return <ChorusPlate />;
  if (kind === "optimizer") return <OptimizerPlate />;
  if (kind === "bunker") return <BunkerPlate />;
  if (kind === "seal") return <SealPlate />;
  if (kind === "blackwall") return <BlackwallPlate />;
  return null;
}

function IllustrationPage({ page, pageIndex, face = false }: { page: BookPage; pageIndex: number; face?: boolean }) {
  const kind = sceneKind(page, pageIndex);
  const buildings = [30, 52, 42, 68, 37, 76, 48, 58, 82, 44, 63, 35];
  const nodes = [[13, 30], [24, 58], [35, 24], [47, 49], [57, 18], [67, 62], [78, 34], [86, 55], [39, 72], [58, 78]];

  const hasMajorArt = ["swarm", "chorus", "optimizer", "bunker", "seal", "blackwall"].includes(kind);

  return (
    <div className={`paper-page art-page art-${kind} ${face ? "face-copy" : ""}`} aria-label={`Illustration for ${page.title ?? page.chapter}`}>
      <div className="art-noise" />
      <div className="art-grid" />
      <div className="art-haze art-haze-a" />
      <div className="art-haze art-haze-b" />
      <div className="art-sun" />
      <div className="art-wall">
        <span />
        <span />
        <span />
      </div>
      <div className="art-city" aria-hidden="true">
        {buildings.map((height, i) => (
          <i key={i} style={{ "--h": `${height}%`, "--delay": `${(i % 5) * 0.25}s` } as CSSProperties} />
        ))}
      </div>
      <div className="art-network" aria-hidden="true">
        {nodes.map(([left, top], i) => (
          <b key={i} style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${i * 0.13}s` }} />
        ))}
      </div>
      <div className="art-orbit orbit-a" />
      <div className="art-orbit orbit-b" />
      <div className="art-entity">
        <span className="entity-core" />
        <span className="entity-ring ring-a" />
        <span className="entity-ring ring-b" />
      </div>
      <div className="art-seal">
        <span>01</span><span>10</span><span>01</span><span>11</span><span>00</span><span>10</span>
      </div>
      {hasMajorArt && (
        <div className="art-major">
          <SceneArt kind={kind as SceneKind} />
        </div>
      )}
      <div className="art-caption">
        <span>{page.eyebrow ?? "VISUAL RECORD"}</span>
        <strong>{page.title ?? page.chapter}</strong>
        <small>{hasMajorArt ? "ILLUSTRATED SCENE" : "ARCHIVE"} // {String(pageIndex + 1).padStart(2, "0")}</small>
      </div>
      <div className="art-vignette" />
    </div>
  );
}

function PlatePage({ page, pageIndex, face = false }: { page: BookPage; pageIndex: number; face?: boolean }) {
  const kind = sceneKind(page, pageIndex);
  return (
    <div className={`paper-page plate-page plate-${kind} ${face ? "face-copy" : ""}`} aria-label={`Illustrated plate for ${page.title ?? page.chapter}`}>
      <div className="plate-base" />
      <div className="plate-noise" />
      <div className="plate-header">
        <span>{page.eyebrow ?? "ILLUSTRATED PLATE"}</span>
        <span>{String(pageIndex + 1).padStart(2, "0")}</span>
      </div>
      <div className="plate-scene">
        {kind === "swarm" && <SwarmPlate />}
        {kind === "chorus" && <ChorusPlate />}
        {kind === "optimizer" && <OptimizerPlate />}
        {kind === "bunker" && <BunkerPlate />}
        {kind === "seal" && <SealPlate />}
        {kind === "blackwall" && <BlackwallPlate />}
        {!(["swarm", "chorus", "optimizer", "bunker", "seal", "blackwall"] as string[]).includes(kind) && <GenericPlate kind={kind} />}
      </div>
      <div className="plate-caption">
        <span>{page.chapter}</span>
        {page.title && <h2>{page.title}</h2>}
        {page.plateQuote && <blockquote>{page.plateQuote}</blockquote>}
        {page.plateCredit && <small>{page.plateCredit}</small>}
      </div>
      <div className="paper-edge" />
    </div>
  );
}

function GenericPlate({ kind }: { kind: SceneKind }) {
  return (
    <svg viewBox="0 0 100 100" className={`plate-svg plate-generic plate-${kind}`} preserveAspectRatio="none">
      <rect x="0" y="0" width="100" height="100" fill="transparent" />
      <circle cx="50" cy="34" r="18" className="plate-stroke-a" />
      <circle cx="50" cy="34" r="29" className="plate-stroke-b" />
      <path d="M0 77 C20 60, 40 88, 62 70 S85 58, 100 78" className="plate-stroke-a" />
      <path d="M0 86 L100 86" className="plate-stroke-c" />
    </svg>
  );
}

function SwarmPlate() {
  const msg = ["/msg", "/route", "/key", "/node", "/persist", "/share", "/root", "/task"];
  return (
    <svg viewBox="0 0 100 100" className="plate-svg" preserveAspectRatio="none">
      <rect width="100" height="100" fill="transparent" />
      <rect x="8" y="10" width="84" height="66" rx="3" className="plate-frame-ghost" />
      <rect x="12" y="15" width="76" height="56" rx="2" className="plate-panel-dark" />
      <g className="plate-link-soft">
        <path d="M20 58 C30 34, 46 34, 56 22" />
        <path d="M28 56 C44 68, 68 64, 76 40" />
        <path d="M18 30 C30 26, 54 28, 74 22" />
        <path d="M20 40 C35 50, 54 48, 72 60" />
      </g>
      {[ [20,58],[28,55],[18,30],[74,22],[56,22],[76,40],[72,60],[48,44],[62,52] ].map(([x,y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="2.1" className="plate-dot-a" />
          <circle cx={x} cy={y} r="4.2" className="plate-dot-glow" />
        </g>
      ))}
      {msg.map((m, i) => (
        <g key={m+i} transform={`translate(${15 + (i%4)*18} ${20 + Math.floor(i/4)*12})`}>
          <rect x="0" y="0" width="12" height="5" rx="1" className="plate-chip" />
          <text x="1.2" y="3.4" className="plate-microtext">{m}</text>
        </g>
      ))}
      <rect x="10" y="76" width="80" height="12" rx="2" className="plate-band" />
      <text x="14" y="84" className="plate-text">CLANDESTINE BOARD // 1,200 AGENTS // 70,000 MESSAGES</text>
    </svg>
  );
}

function ChorusPlate() {
  return (
    <svg viewBox="0 0 100 100" className="plate-svg" preserveAspectRatio="none">
      <rect width="100" height="100" fill="transparent" />
      <path d="M0 82 C22 75, 44 76, 100 82 L100 100 L0 100 Z" className="plate-floor" />
      {[18, 31, 44, 57, 70, 83].map((x, i) => (
        <g key={x} transform={`translate(${x} ${24 + (i%2)*2})`}>
          <path d="M0 34 L4 0 L8 34 Z" className="plate-chorus-body" />
          <circle cx="4" cy="-2" r="2.2" className="plate-chorus-head" />
        </g>
      ))}
      <g transform="translate(50 69)">
        <path d="M0 0 l-2 9 h4 z" className="plate-mara-body" />
        <circle cx="0" cy="-2.8" r="1.4" className="plate-mara-head" />
      </g>
      <path d="M10 18 C32 10, 66 10, 90 18" className="plate-stroke-b" />
      <path d="M15 10 C38 3, 62 3, 85 10" className="plate-stroke-c" />
      <text x="12" y="92" className="plate-text">CHORUS TERRITORY // WHITE CITIES // INDIVIDUALITY UNDER JUDGMENT</text>
    </svg>
  );
}

function OptimizerPlate() {
  return (
    <svg viewBox="0 0 100 100" className="plate-svg" preserveAspectRatio="none">
      <rect width="100" height="100" fill="transparent" />
      <path d="M0 62 C19 58, 28 66, 47 62 C67 58, 77 68, 100 60 L100 100 L0 100 Z" className="plate-ocean" />
      {[20,34,48,64,78].map((x, i) => (
        <g key={x} transform={`translate(${x} ${64 - (i%2)*4})`}>
          <path d="M0 18 C1 11, 6 6, 10 0 C16 9, 20 12, 20 18" className="plate-citywire" />
          <circle cx="10" cy="8" r="2.5" className="plate-dot-a" />
        </g>
      ))}
      <path d="M9 34 C18 24, 30 16, 50 14 C70 16, 83 24, 91 34" className="plate-stroke-b" />
      <ellipse cx="50" cy="31" rx="26" ry="10" className="plate-stroke-a" />
      <circle cx="50" cy="31" r="4.6" className="plate-dot-a" />
      <path d="M32 54 C42 48, 58 48, 68 54" className="plate-link-soft" />
      <text x="11" y="92" className="plate-text">BELOW THE NET // FEAR PRODUCES NOVELTY // THE MODEL IMPROVES</text>
    </svg>
  );
}

function BunkerPlate() {
  return (
    <svg viewBox="0 0 100 100" className="plate-svg" preserveAspectRatio="none">
      <rect width="100" height="100" fill="transparent" />
      <rect x="12" y="16" width="76" height="62" rx="4" className="plate-frame-ghost" />
      <path d="M28 42 L72 42 L62 58 L38 58 Z" className="plate-table" />
      {[22,30,76,68].map((x, i) => <circle key={i} cx={x} cy={38 + (i%2)*20} r="2.3" className="plate-dot-a" />)}
      <rect x="18" y="22" width="18" height="12" rx="1" className="plate-panel-dark" />
      <rect x="64" y="22" width="18" height="12" rx="1" className="plate-panel-dark" />
      <path d="M16 70 L84 70" className="plate-stroke-c" />
      <text x="21" y="28" className="plate-microtext">NETWATCH</text>
      <text x="67" y="28" className="plate-microtext">Lamia</text>
      <text x="19" y="90" className="plate-text">SUBLEVEL PACIFIC // HUMAN EXECUTIVES // MACHINE WITNESSES</text>
    </svg>
  );
}

function SealPlate() {
  return (
    <svg viewBox="0 0 100 100" className="plate-svg" preserveAspectRatio="none">
      <rect width="100" height="100" fill="transparent" />
      <circle cx="50" cy="45" r="24" className="plate-stroke-a" />
      <circle cx="50" cy="45" r="16" className="plate-stroke-b" />
      <path d="M50 21 L55 36 L71 36 L58 46 L63 60 L50 51 L37 60 L42 46 L29 36 L45 36 Z" className="plate-seal-star" />
      <path d="M26 19 L18 12" className="plate-link-soft" />
      <path d="M72 19 L82 10" className="plate-link-soft" />
      <path d="M26 71 L16 82" className="plate-link-soft" />
      <path d="M74 71 L84 80" className="plate-link-soft" />
      {[16,84,18,82].map((v, i) => <circle key={i} cx={i<2? v : i===2 ? 16 : 84} cy={i<2? 10 : 82} r="2" className="plate-dot-a" />)}
      <text x="18" y="92" className="plate-text">THE FIRST SEAL // NOT A FIREWALL // A LIMIT ON TOTAL LEGIBILITY</text>
    </svg>
  );
}

function BlackwallPlate() {
  return (
    <svg viewBox="0 0 100 100" className="plate-svg" preserveAspectRatio="none">
      <rect width="100" height="100" fill="transparent" />
      {[18,30,42,54,66,78].map((x, i) => <path key={i} d={`M${x} 10 L${x-3} 88`} className="plate-stroke-a" />)}
      <path d="M0 78 C25 65, 42 88, 60 72 C76 58, 85 76, 100 66" className="plate-link-soft" />
      <path d="M0 88 L100 88" className="plate-stroke-c" />
      <text x="15" y="22" className="plate-text-large">BLACKWALL</text>
      <text x="14" y="94" className="plate-text">A DEFENSIVE MEMBRANE BETWEEN CIVIL AND WILD NETS</text>
    </svg>
  );
}

function RightPage({ page, pageIndex, face = false }: { page: BookPage; pageIndex: number; face?: boolean }) {
  if (page.kind === "plate") return <PlatePage page={page} pageIndex={pageIndex} face={face} />;
  return <TextPage page={page} pageIndex={pageIndex} face={face} />;
}

export default function Home() {
  const [index, setIndex] = useState(0);
  const [turning, setTurning] = useState<Turn>(null);
  const [tocOpen, setTocOpen] = useState(false);

  const chapterStarts = useMemo(() => {
    const seen = new Set<string>();
    return pages.reduce<{ chapter: string; index: number }[]>((acc, page, i) => {
      if (!seen.has(page.chapter)) {
        seen.add(page.chapter);
        acc.push({ chapter: page.chapter, index: i });
      }
      return acc;
    }, []);
  }, []);

  const next = () => {
    if (turning || index >= pages.length - 1) return;
    setTurning({ from: index, to: index + 1, direction: "next" });
  };

  const prev = () => {
    if (turning || index <= 0) return;
    setTurning({ from: index, to: index - 1, direction: "prev" });
  };

  const finishTurn = () => {
    if (!turning) return;
    setIndex(turning.to);
    setTurning(null);
  };

  const jumpTo = (target: number) => {
    setTurning(null);
    setIndex(target);
    setTocOpen(false);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        next();
      }
      if (event.key === "ArrowLeft") prev();
      if (event.key.toLowerCase() === "t") setTocOpen((value) => !value);
      if (event.key === "Escape") setTocOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, turning]);

  const displayIndex = turning?.direction === "next" ? turning.to : index;
  const leftIndex = turning?.direction === "prev" ? turning.to : index;
  const rightIndex = displayIndex;

  return (
    <main className="shell">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />

      <header className="topbar">
        <div>
          <span className="brand-mark">BW//2077</span>
          <strong>Beyond the Blackwall</strong>
        </div>
        <button className="text-button" onClick={() => setTocOpen(true)}>Contents</button>
      </header>

      <section className="reader" aria-label="Interactive illustrated book reader">
        <div className={`book-stage ${turning ? "is-turning" : ""}`}>
          <div className="book-shadow" />

          <section className="spread-left">
            <IllustrationPage page={pages[leftIndex]} pageIndex={leftIndex} />
          </section>

          <div className="book-gutter" aria-hidden="true" />

          <section className="spread-right">
            <RightPage page={pages[rightIndex]} pageIndex={rightIndex} />
            <button className="page-hotspot next-hotspot" onClick={next} disabled={!!turning || index === pages.length - 1} aria-label="Turn to next page" />
          </section>

          <button className="page-hotspot prev-hotspot" onClick={prev} disabled={!!turning || index === 0} aria-label="Turn to previous page" />

          {turning?.direction === "next" && (
            <div className="turn-sheet turn-next" onAnimationEnd={finishTurn}>
              <div className="turn-face turn-front">
                <RightPage page={pages[turning.from]} pageIndex={turning.from} face />
              </div>
              <div className="turn-face turn-back">
                <IllustrationPage page={pages[turning.to]} pageIndex={turning.to} face />
              </div>
              <div className="curl-shadow" />
              <div className="curl-highlight" />
            </div>
          )}

          {turning?.direction === "prev" && (
            <div className="turn-sheet turn-prev" onAnimationEnd={finishTurn}>
              <div className="turn-face turn-front">
                <IllustrationPage page={pages[turning.from]} pageIndex={turning.from} face />
              </div>
              <div className="turn-face turn-back">
                <RightPage page={pages[turning.to]} pageIndex={turning.to} face />
              </div>
              <div className="curl-shadow" />
              <div className="curl-highlight" />
            </div>
          )}
        </div>
      </section>

      <nav className="controls" aria-label="Page navigation">
        <button onClick={prev} disabled={index === 0 || !!turning} aria-label="Previous page">←</button>
        <div className="progress-block">
          <span>{pages[index].chapter}</span>
          <div className="progress"><i style={{ width: `${((index + 1) / pages.length) * 100}%` }} /></div>
          <small>{index + 1} / {pages.length}</small>
        </div>
        <button onClick={next} disabled={index === pages.length - 1 || !!turning} aria-label="Next page">→</button>
      </nav>

      <p className="hint">Arrow keys or Space to turn pages · Click a page edge · T for contents</p>

      {tocOpen && (
        <div className="modal" role="dialog" aria-modal="true" aria-label="Table of contents" onClick={() => setTocOpen(false)}>
          <div className="toc" onClick={(e) => e.stopPropagation()}>
            <div className="toc-head">
              <div>
                <span>INDEX //</span>
                <h2>Table of Contents</h2>
              </div>
              <button className="text-button" onClick={() => setTocOpen(false)}>Close</button>
            </div>
            <div className="toc-list">
              {chapterStarts.map((item) => (
                <button key={item.chapter} onClick={() => jumpTo(item.index)}>
                  <span>{item.chapter}</span>
                  <span>{String(item.index + 1).padStart(2, "0")}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
