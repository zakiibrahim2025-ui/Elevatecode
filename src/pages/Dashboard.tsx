import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import { COMPANIES, COURSES, getCourseMeetings, getDailyWorkshop, type Company, type Course, type Meeting } from '@/lib/constants';
import type { AppearanceSettings } from '@/lib/types';
import CompanyModal from '@/components/CompanyModal';
import WorkshopModal from '@/components/WorkshopModal';
import SettingsPanel, { defaultSettings } from '@/components/SettingsPanel';
import FaceCardModal, { FaceCardDisplay } from '@/components/FaceCardModal';
import Minigames from '@/components/Minigames';
import { BookOpen, Building2, CalendarDays, Check, ChevronRight, Clock3, Flame, Gamepad2, GraduationCap, LogOut, MapPin, Palette, ShieldCheck, Sparkles, Star, Trophy, Zap, Hourglass } from 'lucide-react';

const ACCESS_TIERS = [
  { name: 'Industry Access', xp: 500, detail: 'Employer workshops & introductory networking', color: 'from-cyan-500 to-blue-500' },
  { name: 'Professional Access', xp: 1500, detail: 'Specialist workshops, panels & challenges', color: 'from-blue-500 to-indigo-500' },
  { name: 'Elite Access', xp: 3000, detail: 'Limited-capacity premium employer events', color: 'from-amber-400 to-orange-500' },
];

type Tab = 'workshops' | 'employers' | 'games' | 'settings';
type Booking = { id: string; opportunity_id: string; status: string; booked_at: string; review_due_at: string | null };

export default function Dashboard() {
  const { user, profile, signOut, refreshProfile, saveFacePhoto } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [toast, setToast] = useState('');
  const [now, setNow] = useState(Date.now());
  const [tab, setTab] = useState<Tab>('workshops');
  const [courseChoice, setCourseChoice] = useState<Course | ''>(profile?.course ?? '');
  const [savingCourse, setSavingCourse] = useState(false);
  const [showFaceCard, setShowFaceCard] = useState(false);
  const [settings, setSettings] = useState<AppearanceSettings>(() => {
    try {
      const saved = localStorage.getItem('elevate-settings');
      return saved ? JSON.parse(saved) as AppearanceSettings : defaultSettings();
    } catch { return defaultSettings(); }
  });

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!user) return;
    void loadBookings();
  }, [user]);

  async function loadBookings() {
    const { data, error } = await supabase.from('employer_bookings').select('id, opportunity_id, status, booked_at, review_due_at').order('booked_at', { ascending: false });
    if (!error && data) setBookings(data as Booking[]);
  }

  if (!profile) return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">Loading your Elevate dashboard...</div>;

  const points = profile.points ?? 0;
  const attended = profile.attended ?? [];
  const selectedCourse = profile.course;
  const cooldownUntil = profile.premium_booked_at ? new Date(new Date(profile.premium_booked_at).getTime() + 30 * 24 * 60 * 60 * 1000) : null;
  const cooldownActive = Boolean(cooldownUntil && cooldownUntil.getTime() > now);
  const visibleCompanies = selectedCourse ? COMPANIES.filter((c) => c.courses.includes(selectedCourse)) : [];
  const courseMeetings = selectedCourse ? getCourseMeetings(selectedCourse) : [];
  const dayKey = new Date().toISOString().slice(0, 10);
  const dailyWorkshop = selectedCourse ? { ...getDailyWorkshop(selectedCourse), id: `${getDailyWorkshop(selectedCourse).id}|${dayKey}` } : null;
  const allMeetings = dailyWorkshop ? [...courseMeetings, dailyWorkshop] : courseMeetings;
  const currentTier = [...ACCESS_TIERS].reverse().find((t) => points >= t.xp) ?? null;
  const nextTier = ACCESS_TIERS.find((t) => points < t.xp);
  const cooldownText = cooldownUntil ? formatCountdown(cooldownUntil.getTime() - now) : '';
  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const displayName = profile.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Learner';
  const needsFaceCard = !profile.face_photo && !showFaceCard;

  function applySettings(s: AppearanceSettings) {
    setSettings(s);
    try { localStorage.setItem('elevate-settings', JSON.stringify(s)); } catch { /* ignore */ }
  }
  function resetSettings() {
    setSettings(defaultSettings());
    try { localStorage.setItem('elevate-settings', JSON.stringify(defaultSettings())); } catch { /* ignore */ }
  }

  async function saveCourse() {
    if (!courseChoice || courseChoice === profile!.course) return;
    setSavingCourse(true);
    const { error } = await supabase.from('profiles').update({ course: courseChoice }).eq('id', user!.id);
    setSavingCourse(false);
    if (error) { showToast('We could not save your course yet.'); return; }
    await refreshProfile();
    showToast(`Your ${courseChoice} pathway is ready.`);
  }

  async function attend(id: string) {
    if (attended.includes(id)) return;
    const { error } = await supabase.rpc('attend_elevate_session', { p_session_id: id });
    if (error) { showToast('This activity could not be completed.'); return; }
    await refreshProfile();
    showToast('XP earned from this workshop.');
  }

  async function playMinigame(sessionId: string, _xp: number) {
    const { error } = await supabase.rpc('attend_elevate_session', { p_session_id: sessionId });
    if (error) { showToast('Could not save your minigame XP.'); return; }
    await refreshProfile();
    showToast('Minigame XP earned!');
  }

  async function book(company: Company, _formData: Record<string, string>) {
    const { error } = await supabase.rpc('book_elevate_opportunity', { p_opportunity_id: company.id });
    if (error) return { error: 'This booking is no longer available or you do not meet its current requirements.' };
    await Promise.all([loadBookings(), refreshProfile()]);
    return { error: null };
  }

  async function handleSaveFacePhoto(photo: string) {
    const result = await saveFacePhoto(photo);
    if (result.error) { showToast(result.error); return; }
    setShowFaceCard(false);
    showToast('Your face card has been saved.');
  }

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(''), 3000);
  }

  const dateStr = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="min-h-screen text-white" style={{ background: settings.bgPrimary, color: settings.textColor }}>
      <div className="pointer-events-none fixed inset-0" style={{ background: `radial-gradient(circle at 80% 0%, ${settings.bgAccent}33, transparent 32%), radial-gradient(circle at 0% 80%, ${settings.accentColor}22, transparent 30%)` }} />

      {/* Face card prompt for new users */}
      {needsFaceCard && (
        <div className="relative z-20 mx-auto max-w-7xl px-5 pt-4 sm:px-8">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-5 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/20"><Sparkles className="h-5 w-5 text-cyan-300" /></div>
              <div><p className="text-sm font-bold text-white">Add your face card</p><p className="text-xs text-slate-400">Take a quick photo to appear next to your name on the dashboard.</p></div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowFaceCard(true)} className="rounded-lg bg-cyan-400 px-4 py-2 text-xs font-extrabold text-slate-950 transition hover:opacity-90">Set up now</button>
              <button onClick={() => setShowFaceCard(false)} className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white">Later</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-xl" style={{ background: `${settings.bgPrimary}cc` }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <img src="/image.png" alt="Elevate" className="h-10 w-40 rounded-lg object-contain object-left" />
          <div className="flex items-center gap-3">
            {profile.face_photo && (
              <img src={profile.face_photo} alt={displayName} className="h-9 w-9 rounded-full border-2 object-cover" style={{ borderColor: settings.accentColor }} />
            )}
            <div className="flex items-center gap-2 rounded-full border px-4 py-2" style={{ borderColor: `${settings.accentColor}33`, background: `${settings.accentColor}15` }}>
              <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
              <span className="text-sm font-extrabold">{points.toLocaleString()} XP</span>
            </div>
            <button onClick={() => signOut()} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"><LogOut className="h-4 w-4" /></button>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex max-w-7xl gap-6 px-5 py-8 sm:px-8">
        {/* Main content */}
        <div className="min-w-0 flex-1">
          {/* Tabs */}
          <div className="mb-6 flex gap-2 rounded-xl border border-white/10 bg-white/5 p-1">
            <TabButton active={tab === 'workshops'} onClick={() => setTab('workshops')} icon={<CalendarDays className="h-4 w-4" />} label="Workshops" accent={settings.accentColor} />
            <TabButton active={tab === 'employers'} onClick={() => setTab('employers')} icon={<Building2 className="h-4 w-4" />} label="Employers" accent={settings.accentColor} />
            <TabButton active={tab === 'games'} onClick={() => setTab('games')} icon={<Gamepad2 className="h-4 w-4" />} label="Games" accent={settings.accentColor} />
            <TabButton active={tab === 'settings'} onClick={() => setTab('settings')} icon={<Palette className="h-4 w-4" />} label="Settings" accent={settings.accentColor} />
          </div>

          {/* Greeting */}
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold" style={{ color: settings.accentColor }}><Sparkles className="h-4 w-4" /> Your Elevate pathway</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl" style={{ color: settings.headingText }}>{greeting()}, {displayName}</h1>
              <p className="mt-2" style={{ color: settings.textColor }}>Build evidence. Unlock access. Make your next move count.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-right">
              <p className="text-xs uppercase tracking-wider text-slate-500">Current pathway</p>
              <p className="mt-1 text-lg font-extrabold" style={{ color: settings.accentColor }}>{selectedCourse || 'Choose your course'}</p>
            </div>
          </div>

          {!selectedCourse && <CoursePicker value={courseChoice} onChange={setCourseChoice} onSave={saveCourse} saving={savingCourse} accent={settings.accentColor} />}

          {/* Stats */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Stat icon={<Zap className="h-5 w-5" />} label="Total XP" value={points.toLocaleString()} accent={settings.accentColor} />
            <Stat icon={<CalendarDays className="h-5 w-5" />} label="Activities completed" value={attended.length.toString()} accent={settings.accentColor} />
            <Stat icon={<Trophy className="h-5 w-5" />} label="Access level" value={currentTier?.name.replace(' Access', '') || 'Getting started'} accent={settings.accentColor} />
          </div>

          {tab === 'workshops' && selectedCourse && (
            <section className="mt-8 animate-fade-in-up">
              <SectionTitle icon={<CalendarDays className="h-5 w-5" />} title="Your workshops" detail={`${selectedCourse} T Level sessions with video and forms`} accent={settings.accentColor} />
              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {allMeetings.map((meeting, index) => (
                  <MeetingCard key={meeting.id} meeting={meeting} done={attended.includes(meeting.id)} daily={index >= courseMeetings.length} accent={settings.accentColor} onOpen={() => setSelectedMeeting(meeting)} />
                ))}
              </div>
              <div className="mt-6 rounded-3xl border p-6" style={{ borderColor: `${settings.accentColor}33`, background: `${settings.accentColor}0d` }}>
                <div className="flex items-start gap-4">
                  <div className="rounded-xl p-3 text-slate-950" style={{ background: settings.accentColor }}><GraduationCap className="h-6 w-6" /></div>
                  <div><h3 className="font-extrabold" style={{ color: settings.headingText }}>Small wins refresh every 24 hours</h3><p className="mt-2 text-sm leading-relaxed" style={{ color: settings.textColor }}>A fresh daily workshop gives you one focused way to keep your streak moving. Watch the video, answer the questions, and earn XP.</p></div>
                </div>
              </div>
            </section>
          )}

          {tab === 'employers' && (
            <section className="mt-8 animate-fade-in-up">
              <SectionTitle icon={<ShieldCheck className="h-5 w-5" />} title="Employer Access Pass" detail="XP unlocks eligibility. Applying activates the restriction." accent={settings.accentColor} />
              <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.06] p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <span className="rounded-full px-3 py-1.5 text-xs font-bold" style={{ background: `${settings.accentColor}15`, color: settings.accentColor }}>{nextTier ? `${(nextTier.xp - points).toLocaleString()} XP to next tier` : 'All tiers unlocked'}</span>
                </div>
                <div className="mt-6 grid gap-3 md:grid-cols-3">
                  {ACCESS_TIERS.map((tier) => (
                    <div key={tier.name} className={`rounded-2xl border p-4 ${points >= tier.xp ? 'border-cyan-300/40 bg-cyan-300/10' : 'border-white/10 bg-slate-950/20'}`}>
                      <div className="flex items-center justify-between"><span className="text-sm font-bold">{tier.name}</span>{points >= tier.xp ? <Check className="h-4 w-4 text-emerald-300" /> : <span className="text-xs text-slate-500">{tier.xp.toLocaleString()} XP</span>}</div>
                      <div className="mt-3 h-1.5 rounded-full bg-slate-800"><div className={`h-full rounded-full bg-gradient-to-r ${tier.color}`} style={{ width: `${Math.min(100, points / tier.xp * 100)}%` }} /></div>
                      <p className="mt-3 text-xs leading-relaxed text-slate-400">{tier.detail}</p>
                    </div>
                  ))}
                </div>
                {cooldownActive && <div className="mt-5 flex flex-col gap-2 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-4 sm:flex-row sm:items-center sm:justify-between"><p className="flex items-center gap-2 text-sm text-amber-100"><Clock3 className="h-4 w-4 text-amber-300" /> Premium pass cooldown active</p><span className="font-mono text-sm font-bold text-amber-300">{cooldownText}</span></div>}
              </div>

              <div className="mt-8"><SectionTitle icon={<Building2 className="h-5 w-5" />} title="Your employer opportunities" detail={selectedCourse ? `Matched to ${selectedCourse}` : 'Choose a course to see your pathway'} accent={settings.accentColor} />
                <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {visibleCompanies.map((company) => {
                    const booking = bookings.find((b) => b.opportunity_id === company.id && (b.status === 'pending' || b.status === 'approved' || b.status === 'booked'));
                    const eligible = points >= company.xpRequired;
                    return <OpportunityCard key={company.id} company={company} eligible={eligible} booking={booking} cooldownActive={cooldownActive} accent={settings.accentColor} onOpen={() => setSelectedCompany(company)} />;
                  })}
                </div>
              </div>

              <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6"><div className="flex items-center gap-3"><Flame className="h-6 w-6 text-orange-300" /><h3 className="font-extrabold" style={{ color: settings.headingText }}>Make your XP count</h3></div><p className="mt-2 text-sm leading-relaxed" style={{ color: settings.textColor }}>You can unlock several employers, but applying to one premium pass starts the shared 30-day wait. Choose the opportunity that fits your next step.</p></div>
            </section>
          )}

          {tab === 'games' && (
            <div className="mt-8">
              <Minigames accent={settings.accentColor} headingColor={settings.headingText} textColor={settings.textColor} onComplete={playMinigame} attended={attended} />
            </div>
          )}

          {tab === 'settings' && (
            <div className="mt-8">
              <SettingsPanel settings={settings} onSave={applySettings} onReset={resetSettings} />
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-bold text-white">Face card</p>
                <div className="mt-3">
                  <FaceCardDisplay photo={profile.face_photo} name={profile.full_name ?? user?.email ?? ''} onEdit={() => setShowFaceCard(true)} accent={settings.accentColor} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Side panel */}
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="sticky top-6 space-y-4">
            {/* Face card display */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="mb-3 flex items-center gap-2"><Sparkles className="h-4 w-4" style={{ color: settings.accentColor }} /><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Face card</p></div>
              <FaceCardDisplay photo={profile.face_photo} name={profile.full_name ?? user?.email ?? ''} onEdit={() => setShowFaceCard(true)} accent={settings.accentColor} />
            </div>

            {/* Date & time */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-2 mb-3"><CalendarDays className="h-4 w-4" style={{ color: settings.accentColor }} /><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Today</p></div>
              <p className="text-lg font-extrabold" style={{ color: settings.headingText }}>{dateStr}</p>
              <p className="mt-1 font-mono text-2xl font-black tabular-nums" style={{ color: settings.accentColor }}>{timeStr}</p>
            </div>

            {/* Pending applications */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="mb-3 flex items-center gap-2"><Hourglass className="h-4 w-4 text-amber-300" /><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending applications</p></div>
              {pendingBookings.length === 0 ? <p className="text-xs text-slate-500">No applications under review.</p> : (
                <div className="space-y-3">
                  {pendingBookings.map((b) => {
                    const company = COMPANIES.find((c) => c.id === b.opportunity_id);
                    const due = b.review_due_at ? new Date(b.review_due_at) : null;
                    const remaining = due ? due.getTime() - now : 0;
                    return <div key={b.id} className="rounded-xl border border-amber-300/20 bg-amber-300/5 p-3">
                      <div className="flex items-center justify-between"><p className="text-xs font-bold text-white">{company?.name ?? b.opportunity_id}</p><span className="rounded-full bg-amber-300/20 px-2 py-0.5 text-[9px] font-black uppercase text-amber-300">Pending</span></div>
                      {due && <p className="mt-2 text-[10px] text-amber-200/70">Review by {due.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} at {due.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>}
                      {remaining > 0 && <p className="mt-1 font-mono text-[10px] font-bold text-amber-300">{formatCountdown(remaining)} remaining</p>}
                    </div>;
                  })}
                </div>
              )}
            </div>

            {/* XP progress */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="mb-3 flex items-center gap-2"><Trophy className="h-4 w-4" style={{ color: settings.accentColor }} /><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Access progress</p></div>
              {nextTier ? (
                <>
                  <p className="text-sm text-slate-400">Next: <span className="font-bold text-white">{nextTier.name}</span></p>
                  <div className="mt-2 h-2 rounded-full bg-slate-800"><div className="h-full rounded-full" style={{ width: `${Math.min(100, points / nextTier.xp * 100)}%`, background: settings.accentColor }} /></div>
                  <p className="mt-2 text-xs text-slate-500">{(nextTier.xp - points).toLocaleString()} XP to go</p>
                </>
              ) : <p className="text-sm font-bold text-emerald-300">All tiers unlocked</p>}
            </div>
          </div>
        </aside>
      </div>

      {toast && <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-white/10 bg-[#0b2948] px-5 py-3 text-sm font-bold shadow-2xl animate-fade-in"><Sparkles className="mr-2 inline h-4 w-4 text-amber-300" />{toast}</div>}
      {selectedCompany && <CompanyModal company={selectedCompany} cooldownUntil={cooldownActive ? cooldownUntil : null} onClose={() => setSelectedCompany(null)} onBook={(formData) => book(selectedCompany, formData)} />}
      {selectedMeeting && <WorkshopModal meeting={selectedMeeting} done={attended.includes(selectedMeeting.id)} onClose={() => setSelectedMeeting(null)} onComplete={() => attend(selectedMeeting.id)} />}
      {showFaceCard && <FaceCardModal onClose={() => setShowFaceCard(false)} onSave={handleSaveFacePhoto} existingPhoto={profile.face_photo} />}
    </div>
  );
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function TabButton({ active, onClick, icon, label, accent }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; accent: string }) {
  return <button onClick={onClick} className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all ${active ? 'text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'}`} style={active ? { background: accent } : undefined}>{icon}{label}</button>;
}

function CoursePicker({ value, onChange, onSave, saving, accent }: { value: Course | ''; onChange: (v: Course) => void; onSave: () => void; saving: boolean; accent: string }) {
  return <div className="mt-8 rounded-3xl border p-6" style={{ borderColor: `${accent}33`, background: `${accent}0d` }}>
    <div className="flex items-center gap-3"><BookOpen className="h-5 w-5" style={{ color: accent }} /><div><h2 className="font-extrabold text-white">Choose your T Level pathway</h2><p className="text-sm text-slate-400">This controls which workshops and employer opportunities appear for you.</p></div></div>
    <div className="mt-4 grid gap-3 md:grid-cols-3">
      {COURSES.map((c) => <button key={c.name} onClick={() => onChange(c.name)} className={`rounded-2xl border p-4 text-left transition ${value === c.name ? '' : 'border-white/10 bg-slate-950/20 hover:border-white/25'}`} style={value === c.name ? { borderColor: accent, background: `${accent}1a` } : undefined}>
        <p className="font-bold text-white">{c.name}</p><p className="mt-1 text-xs text-slate-500">{c.detail}</p><p className="mt-2 text-[10px] leading-tight text-slate-600">{c.description}</p>
      </button>)}
    </div>
    <button onClick={onSave} disabled={!value || saving} className="mt-4 rounded-xl px-5 py-3 text-sm font-extrabold text-slate-950 disabled:opacity-40" style={{ background: accent }}>{saving ? 'Saving...' : 'Save pathway'}</button>
  </div>;
}

function Stat({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${accent}25`, color: accent }}>{icon}</div><p className="text-2xl font-extrabold text-white">{value}</p><p className="mt-1 text-xs text-slate-500">{label}</p></div>;
}

function SectionTitle({ icon, title, detail, accent }: { icon: React.ReactNode; title: string; detail: string; accent: string }) {
  return <div className="flex items-center gap-3"><div style={{ color: accent }}>{icon}</div><div><h2 className="text-xl font-extrabold text-white">{title}</h2><p className="text-sm text-slate-500">{detail}</p></div></div>;
}

function MeetingCard({ meeting, done, daily, accent, onOpen }: { meeting: Meeting; done: boolean; daily: boolean; accent: string; onOpen: () => void }) {
  return <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-cyan-300/40">
    <div className="relative h-36 overflow-hidden"><img src={meeting.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#081d35] to-transparent" /><span className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-slate-950" style={{ background: accent }}>{daily ? 'Daily drop' : meeting.type}</span></div>
    <div className="p-5">
      <div className="flex items-start justify-between gap-3"><h3 className="font-bold text-white">{meeting.title}</h3><span className="flex shrink-0 items-center gap-1 text-xs font-bold text-amber-300"><Star className="h-3.5 w-3.5 fill-amber-300" />+{meeting.points}</span></div>
      <p className="mt-2 text-xs leading-relaxed text-slate-400">{meeting.description}</p>
      <div className="mt-4 flex items-center gap-3 text-xs text-slate-500"><span><CalendarDays className="mr-1 inline h-3.5 w-3.5" />{meeting.date}</span><span><Clock3 className="mr-1 inline h-3.5 w-3.5" />{meeting.duration}</span></div>
      <button disabled={done} onClick={onOpen} className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-extrabold transition ${done ? 'bg-emerald-400/15 text-emerald-300' : 'text-slate-950 hover:opacity-90'}`} style={!done ? { background: accent } : undefined}>{done ? <><Check className="h-4 w-4" /> Completed</> : <>Open workshop <ChevronRight className="h-4 w-4" /></>}</button>
    </div>
  </article>;
}

function OpportunityCard({ company, eligible, booking, cooldownActive, accent, onOpen }: { company: Company; eligible: boolean; booking: Booking | undefined; cooldownActive: boolean; accent: string; onOpen: () => void }) {
  const isPending = booking?.status === 'pending';
  const isActive = booking?.status === 'booked' || booking?.status === 'approved';
  return <article className={`overflow-hidden rounded-2xl border ${eligible ? 'border-cyan-300/30 bg-cyan-300/5' : 'border-white/10 bg-white/5'}`}>
    <div className="relative h-32 overflow-hidden"><img src={company.image} alt="" className={`h-full w-full object-cover ${eligible ? '' : 'brightness-[0.3] grayscale'}`} /><div className="absolute inset-0 bg-gradient-to-t from-[#081d35] via-transparent to-transparent" /><span className="absolute left-3 top-3 rounded-full bg-slate-950/70 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-cyan-300">{company.tier} - {company.xpRequired.toLocaleString()} XP</span></div>
    <div className="p-5">
      <div className="flex items-start justify-between gap-3"><div><h3 className="font-extrabold text-white">{company.name}</h3><p className="mt-1 text-xs text-cyan-300">{company.role}</p></div><div className="flex h-10 w-10 items-center justify-center rounded-xl font-black text-xs text-slate-950" style={{ background: accent }}>{company.logo}</div></div>
      <p className="mt-3 text-xs leading-relaxed text-slate-400">{eligible ? company.description : `${company.xpRequired.toLocaleString()} XP pathway opportunity`}</p>
      <p className="mt-3 text-xs text-slate-500"><MapPin className="mr-1 inline h-3.5 w-3.5" />{company.location}</p>
      {isPending && <div className="mt-3 flex items-center gap-2 rounded-lg border border-amber-300/20 bg-amber-300/5 px-3 py-2 text-xs text-amber-300"><Hourglass className="h-3.5 w-3.5" /> Pending review</div>}
      <button onClick={onOpen} disabled={!eligible || isActive || (cooldownActive && company.premium)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-extrabold transition disabled:cursor-not-allowed disabled:opacity-40" style={eligible && !isActive && !(cooldownActive && company.premium) ? { background: accent, color: '#0b1220' } : { background: 'rgba(255,255,255,0.1)', color: '#94a3b8' }}>
        {isActive ? <><Check className="h-4 w-4" /> Pass active</> : isPending ? 'Under review' : cooldownActive && company.premium ? 'Cooldown active' : eligible ? <>Apply now <ChevronRight className="h-4 w-4" /></> : 'Keep building XP'}
      </button>
    </div>
  </article>;
}

function formatCountdown(ms: number) { const s = Math.max(0, Math.floor(ms / 1000)); const d = Math.floor(s / 86400); const h = Math.floor((s % 86400) / 3600); const m = Math.floor((s % 3600) / 60); return `${d}d ${h}h ${m}m`; }
