// 試作の画面。スタート → カードのスワイプ → 結果（requirements.md の F-1〜F-3）。
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { CARDS, type FeatureCard } from "../data/cards";
import { DEPARTMENTS } from "../data/departments";
import { DATA_UPDATED, TECHNOLOGIES, type Technology } from "../data/technologies";
import { buildDeck, cardsForLevel, followUpCards } from "../lib/deck";
import { recommend, type Answer, type Ranked } from "../lib/scoring";
import { buildShareUrl, parseSharedIds, parseSharedMatch, shareText, xShareUrl } from "../lib/share";
import PixelSprite from "./PixelSprite";
import TermWindow from "./TermWindow";
import { CARET, CROSS, CUPID, HEART, SMALL_HEART, SMALL_HEART_EMPTY, SPARKLE } from "./sprites";

/** 「結果を見る」を押せるまでの最低枚数（仮の値。requirements.md の 10 章） */
const MIN_ANSWERS = 8;
/** これ以上ドラッグしたら回答とみなす距離（px） */
const SWIPE_THRESHOLD = 100;
/** 経験レベルの初期値 */
const DEFAULT_LEVEL = 5;
/** マッチ度のメーターのハートの数 */
const METER_HEARTS = 5;
/** 結果画面で上に展開する部門の最大数（言語を含む）。残りは折りたたむ */
const MAX_FEATURED = 3;

type Phase = "start" | "swipe" | "result";

/** sharedIds: シェア用のページ（/m/...）で開いたときの、友だちの結果の技術の ID */
export default function TecupidApp({ sharedIds }: { sharedIds?: string[] }) {
  const [phase, setPhase] = useState<Phase>("start");
  const [level, setLevel] = useState(DEFAULT_LEVEL);
  const [deck, setDeck] = useState<FeatureCard[]>([]);
  /** 最初の山札の枚数。これより後ろは、関心のある部門の追加カード */
  const [baseCount, setBaseCount] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  /** シェアされた URL（/m/... か、古い形式の ?match=...）で開いたときの、友だちの結果 */
  const [shared, setShared] = useState(() =>
    sharedIds ? parseSharedIds(sharedIds, TECHNOLOGIES) : parseSharedMatch(window.location.search, TECHNOLOGIES),
  );

  const start = () => {
    if (shared) {
      // 自分の結果と混ざらないよう、シェアの表示を消して、URL もトップページに戻す
      setShared(null);
      window.history.replaceState(null, "", "/");
    }
    const initial = buildDeck(cardsForLevel(CARDS, level));
    setDeck(initial);
    setBaseCount(initial.length);
    setAnswers([]);
    setPhase("swipe");
  };

  const answer = useCallback(
    (liked: boolean) => {
      const card = deck[answers.length];
      if (!card) return;
      const next = [...answers, { cardId: card.id, liked }];
      setAnswers(next);
      if (next.length < deck.length) return;
      // 最初の山札を答え終えたら、関心のある部門の専用カードを 1 回だけ追加する
      const extra = deck.length === baseCount ? followUpCards(next, cardsForLevel(CARDS, level)) : [];
      if (extra.length > 0) setDeck([...deck, ...extra]);
      else setPhase("result");
    },
    [deck, answers, baseCount, level],
  );

  const undo = () => setAnswers((a) => a.slice(0, -1));

  useEffect(() => {
    if (phase !== "swipe") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const key = e.key.toLowerCase();
      if (e.key === "ArrowRight" || key === "y") answer(true);
      if (e.key === "ArrowLeft" || key === "n") answer(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, answer]);

  if (phase === "start") {
    return <StartScreen level={level} shared={shared} onLevelChange={setLevel} onStart={start} />;
  }
  if (phase === "result") return <ResultScreen answers={answers} level={level} onRetry={() => setPhase("start")} />;

  const card = deck[answers.length];
  const department = card?.department ? DEPARTMENTS.find((d) => d.id === card.department) : undefined;
  return (
    <main className="screen">
      <div
        className="progress"
        role="progressbar"
        aria-label="回答の進み具合"
        aria-valuemin={0}
        aria-valuemax={deck.length}
        aria-valuenow={answers.length}
      >
        <span aria-hidden="true">[</span>
        <span className="progress-track">
          <span className="progress-bar" style={{ width: `${(answers.length / deck.length) * 100}%` }} />
        </span>
        <span aria-hidden="true">]</span>
        <span className="progress-count" aria-hidden="true">
          {answers.length + 1}/{deck.length}
        </span>
      </div>
      {department && <p className="follow-up">! {department.name} に関心がありそうなので、追加の質問です</p>}

      {/* カードが変わったら、スクリーンリーダーで新しいカードの文を読み上げる */}
      <p className="visually-hidden" aria-live="polite">
        {card ? `${answers.length + 1} 枚目。${card.text}` : ""}
      </p>
      {card && <SwipeCard key={card.id} card={card} onAnswer={answer} />}

      <div className="actions">
        <button className="btn-key nope" onClick={() => answer(false)} aria-keyshortcuts="n ArrowLeft">
          <kbd className="keycap" aria-hidden="true">n</kbd>
          <PixelSprite sprite={CROSS} scale={2} />
          <span>パス</span>
        </button>
        <button className="btn-key like" onClick={() => answer(true)} aria-keyshortcuts="y ArrowRight">
          <kbd className="keycap" aria-hidden="true">y</kbd>
          <PixelSprite sprite={HEART} scale={2} />
          <span>すき</span>
        </button>
      </div>
      <p className="hint">y / n キー、← → キー、左右のスワイプでも答えられます</p>

      <div className="sub-actions">
        <button className="btn-text" onClick={undo} disabled={answers.length === 0}>
          1 枚戻す
        </button>
        <button className="btn-text" onClick={() => setPhase("result")} disabled={answers.length < MIN_ANSWERS}>
          {answers.length < MIN_ANSWERS ? `あと ${MIN_ANSWERS - answers.length} 枚で結果を見られます` : "ここで結果を見る"}
        </button>
      </div>
    </main>
  );
}

/** 技術名のあいだにハートをはさんで並べる */
function MatchNames({ names }: { names: string[] }) {
  return (
    <p className="combo-name">
      {names.map((name, i) => (
        <span key={name} className="combo-part">
          {i > 0 && <PixelSprite sprite={HEART} scale={2} label="と" />}
          <span>{name}</span>
        </span>
      ))}
    </p>
  );
}

function StartScreen({
  level,
  shared,
  onLevelChange,
  onStart,
}: {
  level: number;
  shared: Technology[] | null;
  onLevelChange: (level: number) => void;
  onStart: () => void;
}) {
  return (
    <main className="screen start">
      {shared && (
        <TermWindow title="~/tecupid/shared" className="shared" role="region" aria-label="シェアされた結果">
          <p className="window-label">友だちのマッチング結果</p>
          <MatchNames names={shared.map((t) => t.name)} />
          <p className="shared-cta">あなたにぴったりの技術も見つけよう</p>
        </TermWindow>
      )}
      <div className="mascot" aria-hidden="true">
        <PixelSprite sprite={SPARKLE} scale={3} className="sparkle sparkle-1" />
        <PixelSprite sprite={CUPID} scale={6} className="cupid" />
        <PixelSprite sprite={HEART} scale={3} className="float-heart" />
        <PixelSprite sprite={SPARKLE} scale={2} className="sparkle sparkle-2" />
      </div>
      <p className="eyebrow">// エンジニアのための技術マッチングアプリ</p>
      <h1 className="logo">
        tecupid
        <span className="cursor" aria-hidden="true" />
      </h1>
      <div className="term-lines">
        <p>技術の特徴が書かれたカードが届きます。</p>
        <p>気になったら「すき」、ちがうなら「パス」。</p>
        <p>あなたにぴったりの技術を見つけます。</p>
      </div>

      <LevelPicker level={level} onChange={onLevelChange} />

      <button className="btn-primary" onClick={onStart}>
        <PixelSprite sprite={CARET} scale={3} className="caret" />
        はじめる
      </button>
      <p className="note">
        推薦は学習の参考情報です。回答はこの端末の外に送信されません。
        <br />
        各技術の提供元とは関係のない非公式サービスです。
        <br />
        <a href="/disclaimer/">免責事項</a>・<a href="/privacy/">プライバシーポリシー</a>
      </p>
    </main>
  );
}

function levelLabel(level: number): string {
  if (level <= 2) return "プログラミングはほとんど初めて";
  if (level <= 5) return "入門書やチュートリアルを少し進めた";
  if (level <= 8) return "自分で何か作ったことがある";
  return "チーム開発や大きな開発の経験がある";
}

function LevelPicker({ level, onChange }: { level: number; onChange: (level: number) => void }) {
  return (
    <div className="level panel">
      <div className="level-head">
        <label htmlFor="level">あなたの経験レベル</label>
        <output htmlFor="level" className="level-value">
          LV.{level}
        </output>
      </div>
      <input
        id="level"
        className="level-range"
        type="range"
        min={0}
        max={10}
        step={1}
        value={level}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={`LV.${level}：${levelLabel(level)}`}
        style={{ "--fill": `${level * 10}%` } as CSSProperties}
      />
      <div className="level-scale" aria-hidden="true">
        <span>0 まったくの初心者</span>
        <span>10 自信あり</span>
      </div>
      <p className="level-desc">{levelLabel(level)}</p>
    </div>
  );
}

function SwipeCard({ card, onAnswer }: { card: FeatureCard; onAnswer: (liked: boolean) => void }) {
  const [dx, setDx] = useState(0);
  const startX = useRef<number | null>(null);

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    startX.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (startX.current !== null) setDx(e.clientX - startX.current);
  };
  const onUp = () => {
    if (Math.abs(dx) > SWIPE_THRESHOLD) onAnswer(dx > 0);
    startX.current = null;
    setDx(0);
  };

  const dragging = startX.current !== null;
  const stamp = dx > 40 ? "like" : dx < -40 ? "nope" : null;

  return (
    <TermWindow
      title="~/tecupid"
      className={`card ${dragging ? "dragging" : ""}`}
      style={{ transform: `translateX(${dx}px) rotate(${dx / 20}deg)` }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      {stamp === "like" && (
        <span className="stamp like">
          <PixelSprite sprite={SMALL_HEART} scale={3} />
          すき！
        </span>
      )}
      {stamp === "nope" && (
        <span className="stamp nope">
          <PixelSprite sprite={CROSS} scale={2} />
          パス
        </span>
      )}
      <p className="term-prompt" aria-hidden="true">
        $ tecupid next
      </p>
      <p className="card-text">{card.text}</p>
      {card.example && <p className="card-example">{card.example}</p>}
      <p className="term-ask" aria-hidden="true">
        ? すき [y] / パス [n]
        <span className="cursor" />
      </p>
    </TermWindow>
  );
}

function ResultScreen({ answers, level, onRetry }: { answers: Answer[]; level: number; onRetry: () => void }) {
  const result = useMemo(() => recommend(answers, CARDS, TECHNOLOGIES, { level }), [answers, level]);
  // 関心のある部門のうち、関心度の高い順に最大 MAX_FEATURED 部門（言語を含む）を上に出す
  const featured = result.departments.filter((d) => d.featured).slice(0, MAX_FEATURED);
  const others = result.departments.filter((d) => !featured.includes(d));
  /** マッチ度の基準。すべての部門で最もスコアの高い技術を 100 とする */
  const best = Math.max(0, ...result.departments.map((d) => d.ranked[0]?.score ?? 0));
  /** シェアするのは、おすすめの組み合わせ（なければ言語の 1 位） */
  const shareTechs: Technology[] = result.combination
    ? [result.combination.language.tech, result.combination.framework.tech]
    : [result.languages[0].tech];
  const shareUrl = buildShareUrl(window.location.origin, shareTechs.map((t) => t.id));
  const text = shareText(shareTechs.map((t) => t.name));
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${text}\n${shareUrl}`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="screen result">
      <p className="eyebrow result-eyebrow">$ tecupid match --level {level}</p>
      <div className="result-head">
        <PixelSprite sprite={SPARKLE} scale={3} />
        <h1 className="result-title">あなたにぴったりの技術</h1>
        <PixelSprite sprite={SPARKLE} scale={3} />
      </div>
      {level < 10 && (
        <p className="level-note">
          LV.{level} に合わせて、文法が小さい、すぐ試せるなど、学び始めやすい技術を少し優先しています
        </p>
      )}

      {result.combination && (
        <TermWindow title="~/tecupid/match" className="combo" role="region" aria-label="おすすめの組み合わせ">
          <p className="window-label">おすすめの組み合わせ</p>
          <MatchNames names={[result.combination.language.tech.name, result.combination.framework.tech.name]} />
        </TermWindow>
      )}

      <p className="meter-note">
        <PixelSprite sprite={SMALL_HEART} scale={2} />
        マッチ度は、いちばん合う技術を 100 としたときの値です
      </p>

      {featured.map((d) => (
        <RankSection key={d.department.id} title={`${d.department.name}部門`} ranked={d.ranked} best={best} />
      ))}

      {others.length > 0 && (
        <details className="other-departments">
          <summary>そのほかの部門（{others.map((d) => d.department.name).join("、")}）</summary>
          {others.map((d) => (
            <RankSection key={d.department.id} title={`${d.department.name}部門`} ranked={d.ranked} best={best} />
          ))}
        </details>
      )}

      <div className="sub-actions result-actions">
        <button className="btn-primary" onClick={onRetry}>
          もう一度やる
        </button>
      </div>

      {/* SNS の共有はひとまず X だけ。ロゴ（商標）は使わず、文字だけにする */}
      <div className="share-row" role="group" aria-label="結果をシェア">
        <span className="share-label">// シェア</span>
        <a className="btn-text" href={xShareUrl(text, shareUrl)} target="_blank" rel="noopener noreferrer">
          X でポスト
        </a>
        <button className="btn-text" onClick={copy}>
          {copied ? "コピーしました" : "URL をコピー"}
        </button>
      </div>
      <p className="note">
        推薦は学習の参考情報です。キャリアや就職での成果を保証するものではありません。
        <br />
        技術の情報は {DATA_UPDATED} 時点のものです。最新の情報は公式ドキュメントで確認してください。
      </p>
    </main>
  );
}

function RankSection<T extends Technology>({ title, ranked, best }: { title: string; ranked: Ranked<T>[]; best: number }) {
  return (
    <section className="rank">
      <h2>{title}</h2>
      <ol className="rank-list">
        {ranked.slice(0, 3).map((r, i) => (
          <TechItem key={r.tech.id} ranked={r} place={i + 1} percent={matchPercent(r.score, best)} />
        ))}
      </ol>
      {ranked.length > 3 && (
        <details className="rest">
          <summary>4 位以下を見る</summary>
          <ol start={4}>
            {ranked.slice(3).map((r) => (
              <li key={r.tech.id}>
                {r.tech.name} <span className="score">{matchPercent(r.score, best)}</span>
              </li>
            ))}
          </ol>
        </details>
      )}
    </section>
  );
}

/** マッチ度。いちばん合う技術（best）を 100 とした値。マイナスは 0 にする */
function matchPercent(score: number, best: number): number {
  return best > 0 ? Math.max(0, Math.round((score / best) * 100)) : 0;
}

function HeartMeter({ percent }: { percent: number }) {
  const filled = Math.round((percent / 100) * METER_HEARTS);
  return (
    <span className="meter" role="img" aria-label={`マッチ度 ${percent}`}>
      {Array.from({ length: METER_HEARTS }, (_, i) => (
        <PixelSprite key={i} sprite={i < filled ? SMALL_HEART : SMALL_HEART_EMPTY} scale={2} />
      ))}
      <span className="meter-value">{percent}</span>
    </span>
  );
}

/** 各部門の 1 位には推薦理由まで出し、2 位以下は概要とリンクだけにして画面を短くする */
function TechItem({ ranked, place, percent }: { ranked: Ranked<Technology>; place: number; percent: number }) {
  const { tech, reasons } = ranked;
  return (
    <li className="tech panel">
      <div className="tech-head">
        <span className={`place place-${place}`}>{place}</span>
        <span className="tech-name">{tech.name}</span>
        <HeartMeter percent={percent} />
      </div>
      <p className="tech-summary">{tech.summary}</p>
      {place === 1 && reasons.length > 0 && (
        <ul className="reasons" aria-label="推薦理由">
          {reasons.map((r) => (
            <li key={r.card.id}>
              <PixelSprite sprite={SMALL_HEART} scale={2} className="reason-icon" />
              <span>{r.card.text}</span>
            </li>
          ))}
        </ul>
      )}
      {tech.resources.map((res) => (
        <a key={res.url} className="resource" href={res.url} target="_blank" rel="noopener noreferrer">
          {res.title} →
        </a>
      ))}
    </li>
  );
}
