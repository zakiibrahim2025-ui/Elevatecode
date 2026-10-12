import { useState, type FormEvent } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import { ArrowRight, Check, Lock, Mail, Sparkles, User, BookOpen, ShieldCheck } from 'lucide-react';

type Course = 'Digital' | 'Accounting' | 'Lab Science';

const courses: Array<{ name: Course; detail: string; mark: string }> = [
  { name: 'Digital', detail: 'Software, cloud & technology', mark: 'D' },
  { name: 'Accounting', detail: 'Finance, audit & business', mark: 'A' },
  { name: 'Lab Science', detail: 'Research, health & discovery', mark: 'L' },
];

const ALLOWED_DOMAIN = 'adalovelace.org.uk';

function isValidAdalEmail(email: string): boolean {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed.includes('@')) return false;
  const domain = trimmed.split('@')[1];
  return domain === ALLOWED_DOMAIN;
}

export default function Login() {
  const { signIn, signUp, pendingEmail, pendingPassword, clearPendingSignup } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [course, setCourse] = useState<Course>('Digital');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (mode === 'signup' && !isValidAdalEmail(email)) {
      setError(`Sign-up is only available for @${ALLOWED_DOMAIN} email addresses. Please use your college email.`);
      return;
    }

    if (mode === 'signin' && !isValidAdalEmail(email)) {
      setError(`Only @${ALLOWED_DOMAIN} email addresses are supported. Please use your college email.`);
      return;
    }

    setSubmitting(true);

    if (mode === 'signup') {
      const result = await signUp(email, password, fullName, course);
      if (result.error) {
        setError('We could not create your account. This email may already be registered.');
        setSubmitting(false);
        return;
      }

      const code = String(Math.floor(1000 + Math.random() * 9000));
      setSentCode(code);
      setShow2FA(true);
      setSubmitting(false);
      return;
    }

    const result = await signIn(email, password);
    if (result.error) setError('We could not sign you in. Please check your email and password.');
    setSubmitting(false);
  }

  async function handleVerifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCodeError(null);

    if (verificationCode.trim() === sentCode) {
      clearPendingSignup();
      setShow2FA(false);
      setSentCode(null);
      setVerificationCode('');

      if (pendingEmail && pendingPassword) {
        setSubmitting(true);
        const result = await signIn(pendingEmail, pendingPassword);
        setSubmitting(false);
        if (result.error) {
          setError('Your code was verified, but we could not sign you in automatically. Please sign in with your email and password.');
          setMode('signin');
        }
      }
    } else {
      setCodeError('That code is not correct. Please check the 4-digit code and try again.');
    }
  }

  function resendCode() {
    const code = String(Math.floor(1000 + Math.random() * 9000));
    setSentCode(code);
    setCodeError(null);
  }

  function switchMode(nextMode: 'signin' | 'signup') {
    setMode(nextMode);
    setError(null);
    setShow2FA(false);
    setSentCode(null);
    setVerificationCode('');
    setCodeError(null);
  }

  if (show2FA) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#061a31] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(17,167,226,0.2),transparent_30%),radial-gradient(circle_at_90%_85%,rgba(0,102,184,0.25),transparent_32%)]" />
        <div className="relative w-full max-w-md px-5 py-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/15"><ShieldCheck className="h-8 w-8 text-cyan-300" /></div>
            <h2 className="text-3xl font-extrabold tracking-tight">Verify your email</h2>
            <p className="mt-2 text-sm text-slate-400">We have sent a 4-digit verification code to <span className="font-bold text-cyan-300">{email}</span>. Enter it below to complete your sign-up.</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-7 shadow-2xl backdrop-blur-xl">
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-300"><ShieldCheck className="h-4 w-4 text-cyan-300" /> Enter your 4-digit code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{4}"
                  maxLength={4}
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="1234"
                  className="field-input text-center text-2xl font-black tracking-[0.5em]"
                />
              </div>
              {codeError && <div className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{codeError}</div>}
              <button type="submit" disabled={submitting || verificationCode.length !== 4} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3.5 text-sm font-extrabold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300 disabled:opacity-50">
                {submitting ? 'Verifying...' : 'Verify and continue'}
                {!submitting && <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />}
              </button>
            </form>

            <div className="mt-5 rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-center">
              <p className="text-xs text-cyan-200">For this demo, your verification code is: <span className="font-black text-cyan-300">{sentCode}</span></p>
            </div>

            <button onClick={resendCode} className="mt-4 w-full text-center text-xs font-bold text-slate-400 hover:text-white">Resend code</button>
            <button onClick={() => { setShow2FA(false); setSentCode(null); setVerificationCode(''); }} className="mt-2 w-full text-center text-xs text-slate-500 hover:text-slate-300">Back to sign up</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#061a31] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(17,167,226,0.2),transparent_30%),radial-gradient(circle_at_90%_85%,rgba(0,102,184,0.25),transparent_32%)]" />
      <div className="relative hidden w-[47%] flex-col justify-between border-r border-white/10 p-10 lg:flex xl:p-16">
        <div className="flex items-center gap-3">
          <img src="/image.png" alt="Elevate" className="h-11 w-44 rounded-lg object-contain object-left" />
        </div>
        <div className="max-w-xl pb-12">
          <p className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            <Sparkles className="h-4 w-4" /> T Level talent network
          </p>
          <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight xl:text-6xl">
            Build skills.<br /><span className="text-cyan-300">Earn recognition.</span><br />Elevate your future.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-300">
            Turn workshops, course challenges, and employer sessions into XP that opens doors to your next opportunity.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
            {['Employer access passes', 'Course-led pathways', 'Skills that count'].map((item) => (
              <span key={item} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <Check className="h-4 w-4 text-cyan-300" /> {item}
              </span>
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-500">Built for ambitious learners across the UK.</p>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center lg:hidden">
            <img src="/image.png" alt="Elevate" className="h-16 w-52 object-contain" />
          </div>
          <div className="mb-7 text-center lg:text-left">
            <p className="mb-2 text-sm font-semibold text-cyan-300">Welcome to Elevate</p>
            <h2 className="text-3xl font-extrabold tracking-tight">{mode === 'signin' ? 'Welcome back' : 'Create your account'}</h2>
            <p className="mt-2 text-sm text-slate-400">Your route to employer-ready skills starts here.</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-2xl backdrop-blur-xl sm:p-7">
            <div className="mb-6 flex rounded-xl bg-slate-950/50 p-1">
              {(['signin', 'signup'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => switchMode(tab)}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition-all ${mode === tab ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'}`}
                >
                  {tab === 'signin' ? 'Sign in' : 'Create account'}
                </button>
              ))}
            </div>

            <div className="mb-5 flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5 text-xs text-cyan-200">
              <Mail className="h-4 w-4 shrink-0" /> Sign in with your college email (@adalovelace.org.uk). Email verification required for new accounts.
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <Field icon={<User className="h-4 w-4" />} label="Full name">
                  <input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Alex Morgan" className="field-input" />
                </Field>
              )}
              <Field icon={<Mail className="h-4 w-4" />} label="Email address">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@adalovelace.org.uk" className="field-input" />
              </Field>
              <Field icon={<Lock className="h-4 w-4" />} label="Password">
                <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className="field-input" />
              </Field>
              {mode === 'signup' && (
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300"><BookOpen className="h-4 w-4 text-cyan-300" /> Which T Level are you studying?</label>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {courses.map((option) => (
                      <button key={option.name} type="button" onClick={() => setCourse(option.name)} className={`rounded-xl border p-3 text-left transition ${course === option.name ? 'border-cyan-400 bg-cyan-400/10' : 'border-white/10 bg-slate-950/30 hover:border-white/25'}`}>
                        <span className="text-lg font-extrabold text-cyan-300">{option.mark}</span>
                        <span className="mt-1 block text-xs font-bold text-white">{option.name}</span>
                        <span className="mt-1 block text-[10px] leading-tight text-slate-500">{option.detail}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {error && <div className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</div>}
              <button type="submit" disabled={submitting} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3.5 text-sm font-extrabold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300 disabled:opacity-50">
                {submitting ? 'Please wait…' : mode === 'signin' ? 'Sign in to Elevate' : 'Create my account'}
                {!submitting && <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />}
              </button>
            </form>
          </div>
          <p className="mt-5 text-center text-xs text-slate-500"><Lock className="mr-1 inline h-3 w-3" /> Your account stays private and secure. Email verification keeps our community trusted.</p>
        </div>
      </div>
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-300">{icon}{label}</label>
      <div>{children}</div>
    </div>
  );
}
