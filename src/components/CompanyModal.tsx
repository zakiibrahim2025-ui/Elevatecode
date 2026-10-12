import { useEffect, useRef, useState } from 'react';
import type { Company } from '@/lib/constants';
import { CV_FORM_QUESTIONS } from '@/lib/constants';
import { ArrowRight, Check, Clock3, FileText, MapPin, RotateCcw, ShieldCheck, Sparkles, X, Zap } from 'lucide-react';

interface CompanyModalProps {
  company: Company;
  onClose: () => void;
  onBook: (formData: Record<string, string>) => Promise<{ error: string | null }>;
  cooldownUntil: Date | null;
}

type Stage = 'details' | 'cv-form' | 'cv-preview' | 'signature' | 'pending' | 'sent';

export default function CompanyModal({ company, onClose, onBook, cooldownUntil }: CompanyModalProps) {
  const [stage, setStage] = useState<Stage>('details');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSignature, setHasSignature] = useState(false);
  const [formAnswers, setFormAnswers] = useState<Record<string, string>>({});
  const [reviewDueAt, setReviewDueAt] = useState<Date | null>(null);

  const formComplete = CV_FORM_QUESTIONS.every((q) => (formAnswers[q.id] ?? '').trim().length > 0);

  async function submitApplication() {
    setError(null);
    setBusy(true);
    const result = await onBook(formAnswers);
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setReviewDueAt(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000));
    setStage('pending');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <button aria-label="Close" className="absolute inset-0 cursor-default bg-slate-950/80 backdrop-blur-md" onClick={stage === 'sent' ? undefined : onClose} />
      <div className="relative max-h-[92vh] w-full max-w-lg animate-slide-up overflow-y-auto rounded-3xl border border-white/10 bg-[#081d35] shadow-2xl">
        {stage === 'sent' ? <SuccessView company={company} onClose={onClose} /> : stage === 'pending' ? <PendingView company={company} reviewDueAt={reviewDueAt} onClose={onClose} /> : (
          <>
            <div className="relative h-40 overflow-hidden">
              <img src={company.image} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#081d35] via-[#081d35]/40 to-transparent" />
              <button onClick={onClose} className="absolute right-4 top-4 rounded-full bg-slate-950/60 p-2 text-slate-300 hover:text-white"><X className="h-5 w-5" /></button>
              <div className="absolute bottom-4 left-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400 font-black text-slate-950">{company.logo}</div>
                <div><h3 className="text-xl font-extrabold">{company.name}</h3><p className="text-xs text-cyan-300">{company.industry} · {company.tier}</p></div>
              </div>
            </div>
            <div className="p-6">
              {stage === 'details' && <OpportunityDetails company={company} cooldownUntil={cooldownUntil} onNext={() => setStage('cv-form')} />}
              {stage === 'cv-form' && <CvForm answers={formAnswers} setAnswers={setFormAnswers} onBack={() => setStage('details')} onNext={() => setStage('cv-preview')} />}
              {stage === 'cv-preview' && <CvPreview company={company} formAnswers={formAnswers} onBack={() => setStage('cv-form')} onNext={() => setStage('signature')} />}
              {stage === 'signature' && <SignatureStep company={company} hasSignature={hasSignature} setHasSignature={setHasSignature} onBack={() => setStage('cv-preview')} onSubmit={submitApplication} busy={busy} error={error} />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function OpportunityDetails({ company, cooldownUntil, onNext }: { company: Company; cooldownUntil: Date | null; onNext: () => void }) {
  return <>
    <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-cyan-300">Employer opportunity</p><h4 className="mt-1 text-xl font-bold">{company.role}</h4></div><span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">{company.xpRequired.toLocaleString()} XP</span></div>
    <p className="mt-4 text-sm leading-relaxed text-slate-400">{company.description}</p>
    <div className="mt-5 grid grid-cols-2 gap-3 text-xs"><Info icon={<MapPin className="h-4 w-4" />} label="Location" value={company.location} /><Info icon={<Zap className="h-4 w-4" />} label="Access" value={`${company.tier} pass`} /></div>
    {company.premium && <div className="mt-4 flex gap-3 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4"><Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" /><p className="text-xs leading-relaxed text-amber-100">Premium booking. Applying starts a shared 30-day cooldown across all premium employer opportunities.</p></div>}
    <button onClick={onNext} disabled={Boolean(cooldownUntil)} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3.5 text-sm font-extrabold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40">{cooldownUntil ? 'Premium cooldown active' : 'Apply now'} <ArrowRight className="h-4 w-4" /></button>
  </>;
}

function CvForm({ answers, setAnswers, onBack, onNext }: { answers: Record<string, string>; setAnswers: (a: Record<string, string>) => void; onBack: () => void; onNext: () => void }) {
  const formComplete = CV_FORM_QUESTIONS.every((q) => (answers[q.id] ?? '').trim().length > 0);
  return <div className="animate-fade-in-up">
    <div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2"><FileText className="h-5 w-5 text-cyan-300" /><h4 className="text-lg font-bold">Application form</h4></div><span className="text-xs font-bold text-cyan-300">Step 1 of 3</span></div>
    <p className="mb-4 text-sm text-slate-400">Fill in the form below. Your answers will appear on your CV preview.</p>
    <div className="space-y-4">
      {CV_FORM_QUESTIONS.map((q) => (
        <div key={q.id}>
          <label className="mb-1.5 block text-sm font-bold text-slate-300">{q.question}</label>
          {q.type === 'text' ? (
            <textarea value={answers[q.id] ?? ''} onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })} rows={q.id === 'cv-why' || q.id === 'cv-experience' ? 3 : 1} placeholder="Type your answer…" className="field-input resize-none" />
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {q.options?.map((opt) => <button key={opt} type="button" onClick={() => setAnswers({ ...answers, [q.id]: opt })} className={`rounded-xl border p-3 text-left text-sm transition ${answers[q.id] === opt ? 'border-cyan-400 bg-cyan-400/10 text-white' : 'border-white/10 bg-slate-950/30 text-slate-400 hover:border-white/25'}`}>{opt}</button>)}
            </div>
          )}
        </div>
      ))}
    </div>
    <div className="mt-5 flex gap-3"><button onClick={onBack} className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-bold text-slate-300">Back</button><button onClick={onNext} disabled={!formComplete} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3 text-sm font-extrabold text-slate-950 disabled:opacity-40">Review CV <ArrowRight className="h-4 w-4" /></button></div>
  </div>;
}

function CvPreview({ company, formAnswers, onBack, onNext }: { company: Company; formAnswers: Record<string, string>; onBack: () => void; onNext: () => void }) {
  const name = formAnswers['cv-name'] || 'Your name';
  const email = formAnswers['cv-email'] || 'your.email@example.com';
  const phone = formAnswers['cv-phone'] || 'N/A';
  return <div className="animate-fade-in-up">
    <div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2"><FileText className="h-5 w-5 text-cyan-300" /><h4 className="text-lg font-bold">Your CV application</h4></div><span className="text-xs font-bold text-cyan-300">Step 2 of 3</span></div>
    <div className="rounded-2xl border border-slate-200/10 bg-slate-50 p-5 text-slate-900 shadow-xl">
      <div className="flex items-start justify-between border-b border-slate-200 pb-4"><div><p className="text-lg font-black">{name}</p><p className="mt-1 text-xs text-slate-500">{email} · {phone}</p></div><div className="rounded-lg bg-cyan-500 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white">CV</div></div>
      <div className="grid grid-cols-2 gap-4 py-4 text-xs"><div><p className="font-bold text-slate-400">Applying for</p><p className="mt-1 font-bold">{company.role}</p></div><div><p className="font-bold text-slate-400">Employer</p><p className="mt-1 font-bold">{company.name}</p></div><div><p className="font-bold text-slate-400">Access tier</p><p className="mt-1 font-bold">{company.tier}</p></div><div><p className="font-bold text-slate-400">Availability</p><p className="mt-1 font-bold">{formAnswers['cv-availability'] || 'N/A'}</p></div></div>
      <div className="space-y-3 text-xs">
        <div><p className="font-bold text-slate-400">Why this opportunity?</p><p className="mt-1 leading-relaxed text-slate-700">{formAnswers['cv-why'] || 'Not provided'}</p></div>
        <div><p className="font-bold text-slate-400">Strongest skill</p><p className="mt-1 leading-relaxed text-slate-700">{formAnswers['cv-strength'] || 'Not provided'}</p></div>
        <div><p className="font-bold text-slate-400">Proud project</p><p className="mt-1 leading-relaxed text-slate-700">{formAnswers['cv-experience'] || 'Not provided'}</p></div>
      </div>
    </div>
    <p className="mt-4 text-sm text-slate-400">Review your CV, then add your signature to confirm.</p>
    <div className="mt-5 flex gap-3"><button onClick={onBack} className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-bold text-slate-300">Back</button><button onClick={onNext} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3 text-sm font-extrabold text-slate-950">Continue to sign <ArrowRight className="h-4 w-4" /></button></div>
  </div>;
}

function SignatureStep({ company, hasSignature, setHasSignature, onBack, onSubmit, busy, error }: { company: Company; hasSignature: boolean; setHasSignature: (value: boolean) => void; onBack: () => void; onSubmit: () => void; busy: boolean; error: string | null }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * ratio;
    canvas.height = canvas.clientHeight * ratio;
    const context = canvas.getContext('2d');
    if (context) { context.scale(ratio, ratio); context.lineWidth = 2.5; context.lineCap = 'round'; context.lineJoin = 'round'; context.strokeStyle = '#082d4f'; }
  }, []);

  function point(event: React.PointerEvent<HTMLCanvasElement>) { const canvas = canvasRef.current!; const bounds = canvas.getBoundingClientRect(); return { x: event.clientX - bounds.left, y: event.clientY - bounds.top }; }
  function start(event: React.PointerEvent<HTMLCanvasElement>) { event.currentTarget.setPointerCapture(event.pointerId); const context = canvasRef.current?.getContext('2d'); if (!context) return; const p = point(event); context.beginPath(); context.moveTo(p.x, p.y); drawing.current = true; }
  function move(event: React.PointerEvent<HTMLCanvasElement>) { if (!drawing.current) return; const context = canvasRef.current?.getContext('2d'); if (!context) return; const p = point(event); context.lineTo(p.x, p.y); context.stroke(); setHasSignature(true); }
  function stop() { drawing.current = false; }
  function clear() { const canvas = canvasRef.current; const context = canvas?.getContext('2d'); if (!canvas || !context) return; context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight); setHasSignature(false); }

  return <div className="animate-fade-in-up">
    <div className="mb-4 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-cyan-300">Final step</p><h4 className="mt-1 text-lg font-bold">Write your signature</h4></div><span className="text-xs font-bold text-cyan-300">Step 3 of 3</span></div>
    <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4"><p className="text-sm text-slate-300">Sign below to apply for the <span className="font-bold text-white">{company.name}</span> opportunity.</p><div className="relative mt-4 overflow-hidden rounded-xl border-2 border-dashed border-cyan-300/30 bg-slate-50"><canvas ref={canvasRef} className="h-36 w-full touch-none cursor-crosshair" onPointerDown={start} onPointerMove={move} onPointerUp={stop} onPointerCancel={stop} onPointerLeave={stop} /><span className="pointer-events-none absolute bottom-2 left-3 text-[10px] uppercase tracking-wider text-slate-400">Draw your signature here</span></div><button onClick={clear} className="mt-2 flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white"><RotateCcw className="h-3 w-3" /> Clear signature</button></div>
    {error && <div className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</div>}
    <div className="mt-5 flex gap-3"><button onClick={onBack} className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-bold text-slate-300">Back</button><button onClick={onSubmit} disabled={!hasSignature || busy} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-400 py-3 text-sm font-extrabold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40">{busy ? 'Submitting…' : <>Sign and apply <Check className="h-4 w-4" /></>}</button></div>
  </div>;
}

function PendingView({ company, reviewDueAt, onClose }: { company: Company; reviewDueAt: Date | null; onClose: () => void }) {
  const dueText = reviewDueAt ? reviewDueAt.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) + ' at ' + reviewDueAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : 'within 2 days';
  return <div className="p-8 text-center">
    <div className="mx-auto flex h-28 w-28 animate-stamp flex-col items-center justify-center rounded-full border-4 border-amber-400 bg-amber-400/10"><Clock3 className="h-10 w-10 text-amber-300" /><span className="text-[10px] font-black uppercase tracking-widest text-amber-300">Pending</span></div>
    <h3 className="mt-7 text-2xl font-extrabold">Application under review</h3>
    <p className="mt-2 text-sm leading-relaxed text-slate-400">Your signed application for <span className="font-bold text-white">{company.name}</span> has been submitted. It is now <span className="font-bold text-amber-300">pending</span> while we review it.</p>
    <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4 text-left text-sm text-amber-100"><div className="flex items-center gap-2 font-bold"><ShieldCheck className="h-5 w-5" /> Review expected by</div><p className="mt-2 text-xs leading-relaxed text-amber-100/70">{dueText}</p><p className="mt-2 text-xs leading-relaxed text-amber-100/70">You can continue earning XP and completing workshops while you wait.</p></div>
    <button onClick={onClose} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3.5 text-sm font-extrabold text-slate-950"><Sparkles className="h-4 w-4" /> Continue building XP</button>
  </div>;
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="rounded-xl border border-white/10 bg-white/5 p-3"><div className="flex items-center gap-2 text-cyan-300">{icon}<span className="font-semibold">{label}</span></div><p className="mt-1 text-slate-300">{value}</p></div>; }

function SuccessView({ company, onClose }: { company: Company; onClose: () => void }) { return <div className="p-8 text-center"><div className="mx-auto flex h-28 w-28 animate-stamp flex-col items-center justify-center rounded-full border-4 border-emerald-400 bg-emerald-400/10"><Check className="h-10 w-10 text-emerald-300" strokeWidth={3} /><span className="text-[10px] font-black uppercase tracking-widest text-emerald-300">Signed</span></div><h3 className="mt-7 text-2xl font-extrabold">Application sent</h3><p className="mt-2 text-sm leading-relaxed text-slate-400">Your signed application for <span className="font-bold text-white">{company.name}</span> is now attached to your access pass.</p><div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-left text-sm text-emerald-100"><div className="flex items-center gap-2 font-bold"><ShieldCheck className="h-5 w-5" /> Signature confirmed</div><p className="mt-2 text-xs leading-relaxed text-emerald-100/70">Your booking has been saved. Check your event details and keep building XP.</p></div><button onClick={onClose} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3.5 text-sm font-extrabold text-slate-950"><Sparkles className="h-4 w-4" /> Continue building XP</button></div>; }
