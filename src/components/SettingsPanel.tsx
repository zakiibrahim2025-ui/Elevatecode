import { useState } from 'react';
import type { AppearanceSettings } from '@/lib/types';
import { Check, Palette, RefreshCw, Type } from 'lucide-react';

interface SettingsPanelProps {
  settings: AppearanceSettings;
  onSave: (settings: AppearanceSettings) => void;
  onReset: () => void;
}

const PRESETS: Array<{ name: string; settings: AppearanceSettings }> = [
  { name: 'Ocean', settings: { bgPrimary: '#061a31', bgAccent: '#0a4940', accentColor: '#22d3ee', textColor: '#cbd5e1', headingText: '#ffffff' } },
  { name: 'Forest', settings: { bgPrimary: '#0a1f14', bgAccent: '#0d3320', accentColor: '#34d399', textColor: '#a7c4b0', headingText: '#ecfdf5' } },
  { name: 'Sunset', settings: { bgPrimary: '#1a0f0a', bgAccent: '#3d1f0d', accentColor: '#fb923c', textColor: '#e0c4a8', headingText: '#fff7ed' } },
  { name: 'Slate', settings: { bgPrimary: '#111827', bgAccent: '#1e293b', accentColor: '#60a5fa', textColor: '#94a3b8', headingText: '#f1f5f9' } },
  { name: 'Rose', settings: { bgPrimary: '#1a0a12', bgAccent: '#2d1119', accentColor: '#f472b6', textColor: '#c9a8b4', headingText: '#fdf2f8' } },
];

const COLOR_FIELDS: Array<{ key: keyof AppearanceSettings; label: string }> = [
  { key: 'bgPrimary', label: 'Background' },
  { key: 'bgAccent', label: 'Accent background' },
  { key: 'accentColor', label: 'Accent colour' },
  { key: 'textColor', label: 'Body text' },
  { key: 'headingText', label: 'Heading text' },
];

export function defaultSettings(): AppearanceSettings {
  return { bgPrimary: '#061a31', bgAccent: '#0a4940', accentColor: '#22d3ee', textColor: '#cbd5e1', headingText: '#ffffff' };
}

export default function SettingsPanel({ settings, onSave, onReset }: SettingsPanelProps) {
  const [draft, setDraft] = useState<AppearanceSettings>(settings);
  const [saved, setSaved] = useState(false);

  function update(key: keyof AppearanceSettings, value: string) {
    setDraft({ ...draft, [key]: value });
    setSaved(false);
  }

  function applyPreset(preset: AppearanceSettings) {
    setDraft(preset);
    setSaved(false);
  }

  function handleSave() {
    onSave(draft);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center gap-3"><Palette className="h-5 w-5 text-cyan-300" /><div><h2 className="font-extrabold">Appearance & Engagement</h2><p className="text-sm text-slate-400">Customise how your Elevate dashboard looks.</p></div></div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm font-bold text-white">Colour presets</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {PRESETS.map((preset) => (
            <button key={preset.name} onClick={() => applyPreset(preset.settings)} className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition ${JSON.stringify(draft) === JSON.stringify(preset.settings) ? 'border-cyan-400 bg-cyan-400/10' : 'border-white/10 hover:border-white/25'}`}>
              <div className="flex gap-1">
                <span className="h-6 w-6 rounded-full" style={{ background: preset.settings.bgPrimary }} />
                <span className="h-6 w-6 rounded-full" style={{ background: preset.settings.accentColor }} />
              </div>
              <span className="text-xs font-bold text-slate-300">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center gap-2"><Type className="h-4 w-4 text-cyan-300" /><p className="text-sm font-bold text-white">Custom colours</p></div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {COLOR_FIELDS.map((field) => (
            <div key={field.key}>
              <label className="mb-2 block text-xs font-bold text-slate-400">{field.label}</label>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/40 p-2">
                <input type="color" value={draft[field.key]} onChange={(e) => update(field.key, e.target.value)} className="h-8 w-8 cursor-pointer rounded-lg border-none bg-transparent" />
                <input type="text" value={draft[field.key]} onChange={(e) => update(field.key, e.target.value)} className="flex-1 bg-transparent text-sm text-white outline-none" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm font-bold text-white">Live preview</p>
        <div className="mt-3 rounded-xl border border-white/10 p-4" style={{ background: draft.bgPrimary }}>
          <p className="text-sm font-bold" style={{ color: draft.headingText }}>Your dashboard heading</p>
          <p className="mt-1 text-xs" style={{ color: draft.textColor }}>Body text will appear in this colour across the site.</p>
          <button className="mt-3 rounded-lg px-4 py-2 text-xs font-bold" style={{ background: draft.accentColor, color: draft.bgPrimary }}>Accent button</button>
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <button onClick={onReset} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-slate-300 hover:text-white"><RefreshCw className="h-4 w-4" /> Reset to default</button>
        <button onClick={handleSave} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3 text-sm font-extrabold text-slate-950">
          {saved ? <><Check className="h-4 w-4" /> Saved</> : 'Save appearance'}
        </button>
      </div>
    </div>
  );
}
