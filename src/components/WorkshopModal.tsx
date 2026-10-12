import { useState } from 'react';
import type { Meeting } from '@/lib/constants';
import { ArrowRight, Check, ChevronLeft, CirclePlay, ClipboardList, X, Zap } from 'lucide-react';

interface WorkshopModalProps {
  meeting: Meeting;
  done: boolean;
  onClose: () => void;
  onComplete: () => void;
}

type QuizPhase = 'video' | 'quiz' | 'complete';

export default function WorkshopModal({ meeting, done, onClose, onComplete }: WorkshopModalProps) {
  const [phase, setPhase] = useState<QuizPhase>(done ? 'complete' : 'video');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<{ correct: boolean; explanation: string } | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const totalQuestions = meeting.form.length;
  const question = meeting.form[currentQ];
  const isLastQuestion = currentQ === totalQuestions - 1;

  function handleAnswer(value: string) {
    if (feedback) return;
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);

    let isCorrect: boolean;
    if (question.type === 'choice') {
      isCorrect = question.correctAnswer
        ? value.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()
        : false;
    } else {
      // Text answers: check against correctAnswer and acceptableAnswers
      const normalized = value.trim().toLowerCase();
      const acceptable = [
        ...(question.correctAnswer ? [question.correctAnswer] : []),
        ...(question.acceptableAnswers ?? []),
      ].map((a) => a.trim().toLowerCase());

      isCorrect = acceptable.length > 0 && acceptable.includes(normalized);
    }

    setFeedback({ correct: isCorrect, explanation: question.explanation ?? (isCorrect ? 'Correct!' : 'Not quite — review the material and try again.') });
    if (isCorrect) setCorrectCount((c) => c + 1);
  }

  function nextQuestion() {
    if (feedback?.correct === false && question.type === 'choice') {
      setFeedback(null);
      return;
    }
    if (isLastQuestion) {
      onComplete();
      setPhase('complete');
    } else {
      setCurrentQ((q) => q + 1);
      setFeedback(null);
    }
  }

  const progress = ((currentQ + (feedback ? 1 : 0)) / totalQuestions) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <button aria-label="Close" className="absolute inset-0 cursor-default bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative max-h-[92vh] w-full max-w-2xl animate-slide-up overflow-y-auto rounded-3xl border border-white/10 bg-[#081d35] shadow-2xl">
        {/* Header */}
        <div className="relative h-44 overflow-hidden">
          <img src={meeting.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#081d35] via-[#081d35]/40 to-transparent" />
          <button onClick={onClose} className="absolute right-4 top-4 rounded-full bg-slate-950/60 p-2 text-slate-300 hover:text-white"><X className="h-5 w-5" /></button>
          <div className="absolute bottom-4 left-5"><span className="rounded-full bg-cyan-400 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-slate-950">{meeting.type}</span><h3 className="mt-2 text-2xl font-extrabold">{meeting.title}</h3></div>
        </div>

        <div className="p-6">
          <p className="text-sm leading-relaxed text-slate-400">{meeting.description}</p>
          <div className="mt-3 flex items-center gap-4 text-xs text-slate-500"><span>{meeting.speaker}</span><span>{meeting.duration}</span><span>{meeting.date} · {meeting.time}</span><span className="flex items-center gap-1 font-bold text-amber-300">+{meeting.points} XP</span></div>

          {/* Phase: Video */}
          {phase === 'video' && (
            <div className="mt-6 animate-fade-in-up">
              <div className="mb-3 flex items-center gap-2"><CirclePlay className="h-5 w-5 text-cyan-300" /><h4 className="font-bold">Watch the workshop</h4></div>
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                <iframe className="aspect-video w-full" src={meeting.videoUrl} title={meeting.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
              </div>
              <a href={meeting.videoUrl.replace('/embed/', '/watch?v=')} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center justify-center gap-1.5 text-xs font-bold text-cyan-300 hover:text-cyan-200">
                <CirclePlay className="h-3.5 w-3.5" /> Open video in new tab
              </a>
              <button onClick={() => setPhase('quiz')} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3.5 text-sm font-extrabold text-slate-950 transition hover:opacity-90">
                Start quiz <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Phase: Quiz */}
          {phase === 'quiz' && question && (
            <div className="mt-6 animate-fade-in-up">
              {/* Progress bar */}
              <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><ClipboardList className="h-3.5 w-3.5" /> Question {currentQ + 1} of {totalQuestions}</span>
                <span className="font-bold text-cyan-300">{Math.round(progress)}%</span>
              </div>
              <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>

              {/* Question card */}
              <div key={question.id} className="animate-fade-in-up rounded-2xl border border-white/10 bg-slate-950/30 p-5">
                <p className="text-lg font-bold text-white">{question.question}</p>

                {/* Text answer — now requires matching answer */}
                {question.type === 'text' && (
                  <div className="mt-4">
                    <textarea
                      value={answers[question.id] ?? ''}
                      onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                      rows={3}
                      placeholder="Type your answer..."
                      disabled={!!feedback}
                      className="field-input resize-none disabled:opacity-60"
                    />
                    {!feedback && (
                      <button
                        onClick={() => handleAnswer(answers[question.id] ?? '')}
                        disabled={!answers[question.id]?.trim()}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3 text-sm font-extrabold text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Submit answer <ArrowRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}

                {/* Multiple choice */}
                {question.type === 'choice' && (
                  <div className="mt-4 grid gap-3">
                    {question.options?.map((option, i) => {
                      const selected = answers[question.id] === option;
                      const showCorrect = feedback && option === question.correctAnswer;
                      const showWrong = feedback && selected && option !== question.correctAnswer;
                      return (
                        <button
                          key={option}
                          onClick={() => handleAnswer(option)}
                          disabled={!!feedback}
                          className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left text-sm font-bold transition-all duration-200 animate-fade-in-up ${showCorrect ? 'border-emerald-400 bg-emerald-400/15 text-emerald-200' : showWrong ? 'border-rose-400 bg-rose-400/15 text-rose-200' : selected ? 'border-cyan-400 bg-cyan-400/10 text-white' : 'border-white/10 bg-slate-950/30 text-slate-300 hover:border-cyan-300/50 hover:bg-slate-950/50'} disabled:cursor-default`}
                          style={{ animationDelay: `${i * 80}ms` }}
                        >
                          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black ${showCorrect ? 'bg-emerald-400 text-slate-950' : showWrong ? 'bg-rose-400 text-slate-950' : selected ? 'bg-cyan-400 text-slate-950' : 'bg-white/10 text-slate-400'}`}>
                            {String.fromCharCode(65 + i)}
                          </span>
                          {option}
                          {showCorrect && <Check className="ml-auto h-5 w-5 text-emerald-300" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Feedback */}
                {feedback && (
                  <div className={`mt-4 animate-bounce-in rounded-xl border-2 p-4 ${feedback.correct ? 'border-emerald-400/40 bg-emerald-400/10' : 'border-rose-400/40 bg-rose-400/10'}`}>
                    <div className="flex items-center gap-2">
                      {feedback.correct ? (
                        <><div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/20"><Check className="h-5 w-5 text-emerald-300" strokeWidth={3} /></div><p className="font-extrabold text-emerald-200">Correct!</p></>
                      ) : (
                        <><div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-400/20"><X className="h-5 w-5 text-rose-300" strokeWidth={3} /></div><p className="font-extrabold text-rose-200">Not quite</p></>
                      )}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{feedback.explanation}</p>
                    {question.type === 'text' && !feedback.correct && question.correctAnswer && (
                      <p className="mt-2 text-xs text-slate-400">The correct answer is: <span className="font-bold text-cyan-300">{question.correctAnswer}</span></p>
                    )}
                    <button
                      onClick={nextQuestion}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3 text-sm font-extrabold text-slate-950 transition hover:opacity-90"
                    >
                      {isLastQuestion ? 'Finish quiz' : 'Next question'} <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Back button */}
              {!feedback && currentQ > 0 && (
                <button onClick={() => { setCurrentQ((q) => q - 1); setFeedback(null); }} className="mt-4 flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-300">
                  <ChevronLeft className="h-4 w-4" /> Previous question
                </button>
              )}
            </div>
          )}

          {/* Phase: Complete */}
          {phase === 'complete' && (
            <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-8 text-center animate-bounce-in">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/20"><Check className="h-8 w-8 text-emerald-300" strokeWidth={3} /></div>
              <p className="text-xl font-extrabold text-emerald-200">Workshop completed!</p>
              <p className="text-sm text-slate-400">You scored {correctCount}/{totalQuestions} and earned <span className="font-bold text-amber-300">+{meeting.points} XP</span></p>
              <div className="mt-2 flex items-center gap-2 rounded-full bg-amber-400/10 px-4 py-2 text-sm font-bold text-amber-300">
                <Zap className="h-4 w-4" /> XP added to your profile
              </div>
              <button onClick={onClose} className="mt-2 rounded-xl bg-white/10 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-white/20">Back to workshops</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
