import { useState } from 'react';
import { ArrowRight, Check, Gamepad2, Trophy, X, Zap, Brain, Target, Timer } from 'lucide-react';

interface MinigamesProps {
  accent: string;
  headingColor: string;
  textColor: string;
  onComplete: (sessionId: string, xp: number) => void;
  attended: string[];
}

type GameType = 'quiz' | 'memory' | 'reaction';
type GamePhase = 'menu' | 'playing' | 'result';

export default function Minigames({ accent, headingColor, textColor, onComplete, attended }: MinigamesProps) {
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  const [phase, setPhase] = useState<GamePhase>('menu');
  const [score, setScore] = useState(0);

  function startGame(type: GameType) {
    setActiveGame(type);
    setPhase('playing');
    setScore(0);
  }

  function finishGame(xp: number) {
    setPhase('result');
    setScore(xp);
    const sessionId = `minigame-${activeGame}-${xp}`;
    if (!attended.includes(sessionId)) {
      onComplete(sessionId, xp);
    }
  }

  function backToMenu() {
    setActiveGame(null);
    setPhase('menu');
    setScore(0);
  }

  const doneSessionId = `minigame-${activeGame}-${score}`;

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center gap-3"><Gamepad2 className="h-5 w-5" style={{ color: accent }} /><div><h2 className="text-xl font-extrabold" style={{ color: headingColor }}>XP Minigames</h2><p className="text-sm text-slate-500">Play quick games to earn bonus XP. Each game can be played once for XP.</p></div></div>

      {phase === 'menu' && (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <GameCard icon={<Brain className="h-8 w-8" />} title="Knowledge Quiz" description="Answer 5 rapid-fire questions across all courses. Earn XP for each correct answer." xpRange="5-25 XP" accent={accent} textColor={textColor} onPlay={() => startGame('quiz')} completed={attended.some((id) => id.startsWith('minigame-quiz-'))} />
          <GameCard icon={<Target className="h-8 w-8" />} title="Reaction Test" description="Click as fast as you can when the signal appears. Faster reactions earn more XP." xpRange="5-20 XP" accent={accent} textColor={textColor} onPlay={() => startGame('reaction')} completed={attended.some((id) => id.startsWith('minigame-reaction-'))} />
          <GameCard icon={<Timer className="h-8 w-8" />} title="Memory Match" description="Match pairs of tech and science icons. Complete faster to earn more XP." xpRange="5-20 XP" accent={accent} textColor={textColor} onPlay={() => startGame('memory')} completed={attended.some((id) => id.startsWith('minigame-memory-'))} />
        </div>
      )}

      {phase === 'playing' && activeGame === 'quiz' && <QuizGame onFinish={finishGame} accent={accent} />}
      {phase === 'playing' && activeGame === 'reaction' && <ReactionGame onFinish={finishGame} accent={accent} />}
      {phase === 'playing' && activeGame === 'memory' && <MemoryGame onFinish={finishGame} accent={accent} />}

      {phase === 'result' && (
        <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-8 text-center animate-bounce-in">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/20"><Trophy className="h-8 w-8 text-emerald-300" /></div>
          <p className="text-xl font-extrabold text-emerald-200">Game complete!</p>
          <p className="text-sm text-slate-400">You earned <span className="font-bold text-amber-300">+{score} XP</span></p>
          {attended.includes(doneSessionId) ? (
            <p className="text-xs text-slate-500">XP already claimed for this round.</p>
          ) : (
            <div className="flex items-center gap-2 rounded-full bg-amber-400/10 px-4 py-2 text-sm font-bold text-amber-300"><Zap className="h-4 w-4" /> XP added to your profile</div>
          )}
          <div className="flex gap-3">
            <button onClick={backToMenu} className="flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-2.5 text-sm font-extrabold text-slate-950 transition hover:opacity-90">Back to games <ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
}

function GameCard({ icon, title, description, xpRange, accent, textColor, onPlay, completed }: { icon: React.ReactNode; title: string; description: string; xpRange: string; accent: string; textColor: string; onPlay: () => void; completed: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-cyan-300/40">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: `${accent}25`, color: accent }}>{icon}</div>
      <h3 className="font-bold text-white">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed" style={{ color: textColor }}>{description}</p>
      <p className="mt-3 text-xs font-bold text-amber-300">{xpRange}</p>
      <button onClick={onPlay} disabled={completed} className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-extrabold transition disabled:cursor-not-allowed ${completed ? 'bg-emerald-400/15 text-emerald-300' : 'text-slate-950 hover:opacity-90'}`} style={!completed ? { background: accent } : undefined}>
        {completed ? <><Check className="h-4 w-4" /> XP claimed</> : <>Play now <ArrowRight className="h-4 w-4" /></>}
      </button>
    </div>
  );
}

// === Knowledge Quiz Game ===
const QUIZ_QUESTIONS = [
  { question: 'What does CPU stand for?', options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Core Power Unit'], correct: 0 },
  { question: 'Which is a primary colour in light?', options: ['Green', 'Brown', 'Pink', 'Orange'], correct: 0 },
  { question: 'What is the chemical symbol for gold?', options: ['Go', 'Gd', 'Au', 'Ag'], correct: 2 },
  { question: 'What does GDP stand for in economics?', options: ['General Daily Product', 'Gross Domestic Product', 'Global Demand Price', 'Group Development Plan'], correct: 1 },
  { question: 'Which organ pumps blood around the body?', options: ['Lungs', 'Liver', 'Heart', 'Kidney'], correct: 2 },
  { question: 'What is 15 x 12?', options: ['170', '180', '190', '200'], correct: 1 },
  { question: 'Which planet is known as the Red Planet?', options: ['Venus', 'Jupiter', 'Mars', 'Saturn'], correct: 2 },
  { question: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyper Transfer Mark Language'], correct: 0 },
  { question: 'What is the capital of France?', options: ['Berlin', 'Madrid', 'Rome', 'Paris'], correct: 3 },
  { question: 'Which vitamin is produced when skin is exposed to sunlight?', options: ['Vitamin A', 'Vitamin B12', 'Vitamin C', 'Vitamin D'], correct: 3 },
];

function QuizGame({ onFinish, accent }: { onFinish: (xp: number) => void; accent: string }) {
  const [questions] = useState(() => {
    const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  });
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  function answer(idx: number) {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === questions[current].correct) setCorrectCount((c) => c + 1);
  }

  function next() {
    if (current === questions.length - 1) {
      onFinish(correctCount * 5);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    }
  }

  const q = questions[current];
  const progress = ((current + (showResult ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-1 flex items-center justify-between text-xs text-slate-500"><span>Question {current + 1} of {questions.length}</span><span className="font-bold" style={{ color: accent }}>{Math.round(progress)}%</span></div>
      <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: accent }} /></div>

      <div key={current} className="animate-fade-in-up rounded-2xl border border-white/10 bg-slate-950/30 p-5">
        <p className="text-lg font-bold text-white">{q.question}</p>
        <div className="mt-4 grid gap-3">
          {q.options.map((opt, i) => {
            const showCorrect = showResult && i === q.correct;
            const showWrong = showResult && selected === i && i !== q.correct;
            return (
              <button key={i} onClick={() => answer(i)} disabled={showResult} className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left text-sm font-bold transition-all ${showCorrect ? 'border-emerald-400 bg-emerald-400/15 text-emerald-200' : showWrong ? 'border-rose-400 bg-rose-400/15 text-rose-200' : selected === i ? 'border-cyan-400 bg-cyan-400/10 text-white' : 'border-white/10 bg-slate-950/30 text-slate-300 hover:border-cyan-300/50'} disabled:cursor-default`}>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black bg-white/10">{String.fromCharCode(65 + i)}</span>
                {opt}
                {showCorrect && <Check className="ml-auto h-5 w-5 text-emerald-300" />}
                {showWrong && <X className="ml-auto h-5 w-5 text-rose-300" />}
              </button>
            );
          })}
        </div>
        {showResult && (
          <button onClick={next} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-extrabold text-slate-950 transition hover:opacity-90" style={{ background: accent }}>
            {current === questions.length - 1 ? 'Finish quiz' : 'Next question'} <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// === Reaction Test Game ===
function ReactionGame({ onFinish, accent }: { onFinish: (xp: number) => void; accent: string }) {
  const [state, setState] = useState<'waiting' | 'ready' | 'tooEarly'>('waiting');
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number[]>([]);

  function startAttempt() {
    setState('waiting');
    setReactionTime(null);
    const delay = 1500 + Math.random() * 3000;
    window.setTimeout(() => {
      setStartTime(Date.now());
      setState('ready');
    }, delay);
  }

  function handleClick() {
    if (state === 'waiting') {
      setState('tooEarly');
      return;
    }
    if (state === 'ready') {
      const time = Date.now() - startTime;
      setReactionTime(time);
      const newAttempts = [...attempts, time];
      setAttempts(newAttempts);
      if (newAttempts.length >= 3) {
        const avg = newAttempts.reduce((a, b) => a + b, 0) / newAttempts.length;
        let xp = 5;
        if (avg < 250) xp = 20;
        else if (avg < 350) xp = 15;
        else if (avg < 500) xp = 10;
        onFinish(xp);
      } else {
        setState('waiting');
      }
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="mb-4 text-sm text-slate-400">Click the button the instant it turns green. You get 3 attempts. Your average reaction time determines your XP reward.</p>
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={state === 'tooEarly' ? startAttempt : handleClick}
          className={`flex h-48 w-full max-w-md items-center justify-center rounded-2xl border-2 text-lg font-extrabold transition-colors ${
            state === 'waiting' ? 'border-amber-400/40 bg-amber-400/10 text-amber-200' :
            state === 'ready' ? 'border-emerald-400 bg-emerald-400/20 text-emerald-200 animate-pulse' :
            state === 'tooEarly' ? 'border-rose-400/40 bg-rose-400/10 text-rose-200' :
            'border-cyan-300/40 bg-cyan-300/10 text-cyan-200'
          }`}
        >
          {state === 'waiting' ? 'Wait for green...' : state === 'ready' ? 'CLICK NOW!' : state === 'tooEarly' ? 'Too early! Click to retry' : 'Click to start'}
        </button>
        {reactionTime !== null && <p className="text-sm font-bold text-white">Last reaction: <span style={{ color: accent }}>{reactionTime}ms</span></p>}
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className="flex h-3 w-3 rounded-full" style={{ background: i < attempts.length ? accent : 'rgba(255,255,255,0.15)' }} />
          ))}
        </div>
        <p className="text-xs text-slate-500">Attempt {attempts.length + (state === 'waiting' || state === 'ready' ? 1 : 0)} of 3</p>
      </div>
    </div>
  );
}

// === Memory Match Game ===
const MEMORY_ICONS = ['CPU', 'DNA', 'EUR', 'SQL', 'VAT', 'pH7'];

function MemoryGame({ onFinish, accent }: { onFinish: (xp: number) => void; accent: string }) {
  const [cards] = useState(() => {
    const pairs = [...MEMORY_ICONS, ...MEMORY_ICONS];
    return pairs.sort(() => Math.random() - 0.5).map((label, i) => ({ id: i, label, flipped: false, matched: false }));
  });
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [startTime] = useState(Date.now());

  function flipCard(id: number) {
    if (flipped.length === 2) return;
    if (flipped.includes(id) || matched.includes(id)) return;
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = newFlipped;
      if (cards[a].label === cards[b].label) {
        setMatched((prev) => [...prev, a, b]);
        setFlipped([]);
        if (matched.length + 2 === cards.length) {
          const elapsed = (Date.now() - startTime) / 1000;
          let xp = 5;
          if (elapsed < 30 && moves <= 10) xp = 20;
          else if (elapsed < 60 && moves <= 16) xp = 15;
          else if (elapsed < 90) xp = 10;
          onFinish(xp);
        }
      } else {
        window.setTimeout(() => setFlipped([]), 1000);
      }
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4 flex items-center justify-between text-sm"><span className="text-slate-400">Moves: <span className="font-bold text-white">{moves}</span></span><span className="text-slate-400">Matched: <span className="font-bold" style={{ color: accent }}>{matched.length / 2}/{MEMORY_ICONS.length}</span></span></div>
      <div className="grid grid-cols-4 gap-3">
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
          const isMatched = matched.includes(card.id);
          return (
            <button key={card.id} onClick={() => flipCard(card.id)} disabled={isMatched} className={`flex h-20 items-center justify-center rounded-xl border-2 text-sm font-black transition-all duration-200 ${isMatched ? 'border-emerald-400 bg-emerald-400/15 text-emerald-200' : isFlipped ? 'border-cyan-300 bg-cyan-300/10 text-white' : 'border-white/10 bg-slate-950/30 text-transparent hover:border-cyan-300/40'}`} style={isFlipped && !isMatched ? { color: accent } : undefined}>
              {isFlipped ? card.label : '?'}
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-center text-xs text-slate-500">Match all pairs to earn XP. Faster and fewer moves = more XP!</p>
    </div>
  );
}
