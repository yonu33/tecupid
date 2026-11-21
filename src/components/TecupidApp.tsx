// 試作の画面。スタート → カードのスワイプ → 結果（requirements.md の F-1〜F-3）。
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { CARDS, type FeatureCard } from "../data/cards";
import { DEPARTMENTS } from "../data/departments";
import { TECHNOLOGIES, type Technology } from "../data/technologies";
import { buildDeck, followUpCards } from "../lib/deck";
import { recommend, type Answer, type Ranked } from "../lib/scoring";

/** 「結果を見る」を押せるまでの最低枚数（仮の値。requirements.md の 10 章） */
const MIN_ANSWERS = 8;
/** これ以上ドラッグしたら回答とみなす距離（px） */
const SWIPE_THRESHOLD = 100;

type Phase = "start" | "swipe" | "result";

export default function TecupidApp() {
  const [phase, setPhase] = useState<Phase>("start");
  const [deck, setDeck] = useState<FeatureCard[]>([]);
  /** 最初の山札の枚数。これより後ろは、関心のある部門の追加カード */
  const [baseCount, setBaseCount] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const start = () => {
    const initial = buildDeck(CARDS);
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
      const extra = deck.length === baseCount ? followUpCards(next, CARDS) : [];
      if (extra.length > 0) setDeck([...deck, ...extra]);
      else setPhase("result");
    },
    [deck, answers, baseCount],
  );

  const undo = () => setAnswers((a) => a.slice(0, -1));

  useEffect(() => {
    if (phase !== "swipe") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") answer(true);
      if (e.key === "ArrowLeft") answer(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, answer]);

  if (phase === "start") return <StartScreen onStart={start} />;
  if (phase === "result") return <ResultScreen answers={answers} onRetry={start} />;

  const card = deck[answers.length];
  return (
    <main className="screen">
      <div className="progress" aria-label={`${answers.length + 1} / ${deck.length} 枚目`}>
        <div className="progress-bar" style={{ width: `${(answers.length / deck.length) * 100}%` }} />
      </div>
      <p className="progress-text">
        {answers.length + 1} / {deck.length}
      </p>
      {card?.department && (
        <p className="follow-up">
          {DEPARTMENTS.find((d) => d.id === card.department)?.name} に関心がありそうなので、追加の質問です
        </p>
      )}

      {card && <SwipeCard key={card.id} card={card} onAnswer={answer} />}

      <div className="actions">
        <button className="btn-round nope" onClick={() => answer(false)} aria-label="✕ 興味なし（←キー）">
          ✕
        </button>
        <button className="btn-round like" onClick={() => answer(true)} aria-label="❤ いいね（→キー）">
          ❤
        </button>
      </div>
      <p className="hint">ボタン、左右のスワイプ、← → キーで答えられます</p>

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

function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <main className="screen start">
      <p className="eyebrow">エンジニアのための技術マッチングアプリ</p>
      <h1 className="logo">tecupid</h1>
      <p className="lead">
        技術の「特徴」だけが書かれたカードが届きます。
        <br />
        気になったら ❤、ピンとこなければ ✕。
        <br />
        あなたにぴったりの言語とフレームワークを見つけます。
      </p>
      <button className="btn-primary" onClick={onStart}>
        はじめる
      </button>
      <p className="note">
        推薦は学習の参考情報です。回答はこの端末の外に送信されません。
        <br />
        各技術の提供元とは関係のない非公式サービスです。
      </p>
    </main>
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
    <div
      className={`card ${dragging ? "dragging" : ""}`}
      style={{ transform: `translateX(${dx}px) rotate(${dx / 20}deg)` }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      {stamp && <span className={`stamp ${stamp}`}>{stamp === "like" ? "❤ LIKE" : "✕ NOPE"}</span>}
      <p className="card-text">{card.text}</p>
      {card.example && <p className="card-example">{card.example}</p>}
    </div>
  );
}

function ResultScreen({ answers, onRetry }: { answers: Answer[]; onRetry: () => void }) {
  const result = useMemo(() => recommend(answers, CARDS, TECHNOLOGIES), [answers]);
  const featured = result.departments.filter((d) => d.featured);
  const others = result.departments.filter((d) => !d.featured);
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const top = result.combination
      ? `${result.combination.language.tech.name} ＋ ${result.combination.framework.tech.name}`
      : result.languages[0].tech.name;
    try {
      await navigator.clipboard.writeText(`tecupid で私にぴったりの技術は ${top} でした`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="screen result">
      <h1 className="result-title">あなたにぴったりの技術</h1>

      {result.combination && (
        <section className="combo">
          <p className="eyebrow">おすすめの組み合わせ</p>
          <p className="combo-name">
            {result.combination.language.tech.name} <span>＋</span> {result.combination.framework.tech.name}
          </p>
        </section>
      )}

      {featured.map((d) => (
        <RankSection key={d.department.id} title={`${d.department.name}部門`} ranked={d.ranked} />
      ))}

      {others.length > 0 && (
        <details className="other-departments">
          <summary>そのほかの部門（{others.map((d) => d.department.name).join("、")}）</summary>
          {others.map((d) => (
            <RankSection key={d.department.id} title={`${d.department.name}部門`} ranked={d.ranked} />
          ))}
        </details>
      )}

      <div className="sub-actions">
        <button className="btn-primary" onClick={onRetry}>
          もう一度やる
        </button>
        <button className="btn-text" onClick={share}>
          {copied ? "コピーしました" : "結果をコピー"}
        </button>
      </div>
      <p className="note">推薦は学習の参考情報です。キャリアや就職での成果を保証するものではありません。</p>
    </main>
  );
}

function RankSection<T extends Technology>({ title, ranked }: { title: string; ranked: Ranked<T>[] }) {
  return (
    <section className="rank">
      <h2>{title}</h2>
      <ol className="rank-list">
        {ranked.slice(0, 3).map((r, i) => (
          <TechItem key={r.tech.id} ranked={r} place={i + 1} />
        ))}
      </ol>
      <details className="rest">
        <summary>4 位以下を見る</summary>
        <ol start={4}>
          {ranked.slice(3).map((r) => (
            <li key={r.tech.id}>
              {r.tech.name} <span className="score">{Math.round(r.score * 100)}</span>
            </li>
          ))}
        </ol>
      </details>
    </section>
  );
}

function TechItem({ ranked, place }: { ranked: Ranked<Technology>; place: number }) {
  const { tech, score, reasons } = ranked;
  return (
    <li className="tech">
      <div className="tech-head">
        <span className="place">{place}</span>
        <span className="tech-name">{tech.name}</span>
        <span className="score">マッチ度 {Math.max(0, Math.round(score * 100))}</span>
      </div>
      <p className="tech-summary">{tech.summary}</p>
      {reasons.length > 0 && (
        <ul className="reasons">
          {reasons.map((r) => (
            <li key={r.card.id}>❤ {r.card.text}</li>
          ))}
        </ul>
      )}
      {tech.resources.map((res) => (
        <a key={res.url} className="resource" href={res.url} target="_blank" rel="noopener noreferrer">
          {res.title} ↗
        </a>
      ))}
    </li>
  );
}
