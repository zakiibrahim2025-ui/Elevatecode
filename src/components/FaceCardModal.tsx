import { useEffect, useRef, useState } from 'react';
import { Camera, Check, RefreshCw, X, UserCircle } from 'lucide-react';

interface FaceCardModalProps {
  onClose: () => void;
  onSave: (photo: string) => void;
  existingPhoto: string | null;
}

export default function FaceCardModal({ onClose, onSave, existingPhoto }: FaceCardModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(existingPhoto);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [stream]);

  async function startCamera() {
    setError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 320, height: 320 } });
      setStream(s);
      setCameraActive(true);
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          void videoRef.current.play();
        }
      });
    } catch {
      setError('We could not access your camera. You can skip this step and add a photo later.');
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
    setCameraActive(false);
  }

  function capture() {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;
    ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
    setPhoto(dataUrl);
    stopCamera();
  }

  function retake() {
    setPhoto(null);
    void startCamera();
  }

  async function handleSave() {
    if (!photo) { onClose(); return; }
    setSaving(true);
    onSave(photo);
    setSaving(false);
  }

  function handleSkip() {
    stopCamera();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <button aria-label="Close" className="absolute inset-0 cursor-default bg-slate-950/80 backdrop-blur-md" onClick={handleSkip} />
      <div className="relative max-h-[92vh] w-full max-w-md animate-slide-up overflow-y-auto rounded-3xl border border-white/10 bg-[#081d35] shadow-2xl">
        <button onClick={handleSkip} className="absolute right-4 top-4 z-10 rounded-full bg-slate-950/60 p-2 text-slate-300 hover:text-white"><X className="h-5 w-5" /></button>

        <div className="p-6">
          <div className="mb-1 flex items-center gap-2"><Camera className="h-5 w-5 text-cyan-300" /><h3 className="text-xl font-extrabold text-white">Your Face Card</h3></div>
          <p className="mb-5 text-sm text-slate-400">Add a photo so your face appears next to your name on the dashboard. This is optional — you can skip it and add a photo later.</p>

          <div className="flex flex-col items-center gap-4">
            {!cameraActive && !photo && (
              <button onClick={startCamera} className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-cyan-300/30 bg-cyan-300/5 px-8 py-10 transition hover:border-cyan-300/60">
                <Camera className="h-12 w-12 text-cyan-300" />
                <span className="text-sm font-bold text-cyan-300">Turn on camera</span>
              </button>
            )}

            {cameraActive && !photo && (
              <div className="flex flex-col items-center gap-3">
                <div className="overflow-hidden rounded-2xl border-2 border-cyan-300/40">
                  <video ref={videoRef} className="h-64 w-64 object-cover" autoPlay playsInline muted />
                </div>
                <button onClick={capture} className="flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-extrabold text-slate-950 transition hover:opacity-90">
                  <Camera className="h-5 w-5" /> Take photo
                </button>
              </div>
            )}

            {photo && (
              <div className="flex flex-col items-center gap-3">
                <div className="overflow-hidden rounded-2xl border-2 border-cyan-300/40">
                  <img src={photo} alt="Your face card" className="h-64 w-64 object-cover" />
                </div>
                <button onClick={retake} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-bold text-slate-300 transition hover:text-white">
                  <RefreshCw className="h-4 w-4" /> Retake
                </button>
              </div>
            )}

            {!photo && !cameraActive && (
              <button onClick={startCamera} className="text-xs text-slate-500 underline hover:text-slate-300">Try camera again</button>
            )}

            {error && <p className="rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-xs text-amber-200">{error}</p>}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          <div className="mt-6 flex gap-3">
            <button onClick={handleSkip} className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-slate-300 transition hover:text-white">
              <X className="h-4 w-4" /> Skip for now
            </button>
            <button onClick={handleSave} disabled={!photo || saving} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3 text-sm font-extrabold text-slate-950 transition hover:opacity-90 disabled:opacity-40">
              <Check className="h-4 w-4" /> {saving ? 'Saving...' : 'Save photo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FaceCardDisplay({ photo, name, onEdit, accent }: { photo: string | null; name: string; onEdit: () => void; accent: string }) {
  return (
    <div className="flex items-center gap-3">
      {photo ? (
        <img src={photo} alt={name} className="h-12 w-12 rounded-full border-2 object-cover" style={{ borderColor: accent }} />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2" style={{ borderColor: `${accent}40`, background: `${accent}15` }}>
          <UserCircle className="h-7 w-7" style={{ color: accent }} />
        </div>
      )}
      <div>
        <p className="font-extrabold text-white">{name}</p>
        <button onClick={onEdit} className="text-xs font-bold hover:underline" style={{ color: accent }}>
          {photo ? 'Change photo' : 'Add face card'}
        </button>
      </div>
    </div>
  );
}
