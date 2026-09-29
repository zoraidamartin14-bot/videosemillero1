import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  FlipHorizontal, 
  Type, 
  Sliders, 
  Volume2, 
  VolumeX, 
  X,
  Clock
} from 'lucide-react';
import { SCENES, PROJECT_INFO } from '../data/scriptData';
import { SpeechService } from '../utils/speech';

interface TeleprompterViewProps {
  onClose?: () => void;
  isModal?: boolean;
}

export const TeleprompterView: React.FC<TeleprompterViewProps> = ({ onClose, isModal = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2); // 1 to 5
  const [fontSize, setFontSize] = useState(32); // pixels
  const [isMirrored, setIsMirrored] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const animFrameId = useRef<number | null>(null);

  // Full combined voiceover script text
  const fullScript = SCENES.map((scene) => ({
    id: scene.id,
    speaker: scene.audioSpeaker,
    timecode: scene.timecode,
    text: scene.audioVoiceover,
  }));

  // Auto-scroll logic
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      return;
    }

    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let lastTimestamp = performance.now();

    const step = (timestamp: number) => {
      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      // pixels per second = speed * 35
      const pixelsToScroll = (speed * 35 * delta) / 1000;
      scrollContainer.scrollTop += pixelsToScroll;

      // Stop if reached the end
      if (
        scrollContainer.scrollTop + scrollContainer.clientHeight >=
        scrollContainer.scrollHeight - 10
      ) {
        setIsPlaying(false);
        return;
      }

      animFrameId.current = requestAnimationFrame(step);
    };

    animFrameId.current = requestAnimationFrame(step);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isPlaying, speed]);

  // Elapsed timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Keyboard shortcut: Spacebar to toggle play/pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleReset = () => {
    setIsPlaying(false);
    SpeechService.stop();
    setIsVoiceActive(false);
    setElapsedSeconds(0);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  };

  const handleToggleVoice = () => {
    if (isVoiceActive) {
      SpeechService.stop();
      setIsVoiceActive(false);
    } else {
      setIsVoiceActive(true);
      const allText = SCENES.map((s) => s.audioVoiceover).join(' ... ');
      SpeechService.speak(
        allText,
        () => setIsVoiceActive(false),
        () => setIsVoiceActive(false)
      );
    }
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`flex flex-col bg-slate-950 text-white ${
        isModal
          ? 'fixed inset-0 z-50 p-4 sm:p-6'
          : 'rounded-2xl border border-slate-800 p-4 sm:p-6 my-6 min-h-[600px]'
      }`}
    >
      {/* Top Teleprompter Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition shadow-lg ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pausar [Espacio]</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Iniciar Teleprompter</span>
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Reiniciar al inicio"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Timer Display */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs sm:text-sm text-emerald-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(elapsedSeconds)}</span>
            <span className="text-slate-500">/ 02:15</span>
          </div>
        </div>

        {/* Speed and Appearance Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Speed slider */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">Velocidad:</span>
            <input
              type="range"
              min="1"
              max="5"
              step="0.5"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-20 accent-emerald-500 cursor-pointer"
            />
            <span className="font-mono text-emerald-400 font-bold">{speed}x</span>
          </div>

          {/* Font size */}
          <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setFontSize(Math.max(20, fontSize - 4))}
              className="px-2 py-0.5 rounded hover:bg-slate-800 text-slate-300 font-bold"
              title="Reducir fuente"
            >
              A-
            </button>
            <span className="px-1 font-mono text-slate-400 text-[11px]">{fontSize}px</span>
            <button
              onClick={() => setFontSize(Math.min(56, fontSize + 4))}
              className="px-2 py-0.5 rounded hover:bg-slate-800 text-slate-300 font-bold"
              title="Aumentar fuente"
            >
              A+
            </button>
          </div>

          {/* Mirror toggle for teleprompter glass */}
          <button
            onClick={() => setIsMirrored(!isMirrored)}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
              isMirrored
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Modo espejo horizontal (para prompters con cristal divisor)"
          >
            <FlipHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Espejo</span>
          </button>

          {/* Speech voiceover toggle */}
          <button
            onClick={handleToggleVoice}
            className={`p-2 rounded-lg border transition ${
              isVoiceActive
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Voz sintética de apoyo"
          >
            {isVoiceActive ? <Volume2 className="w-4 h-4 text-rose-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Close button if modal */}
          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Cerrar teleprompter"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Center Reading Focus Cue Marker */}
      <div className="relative flex-1 overflow-hidden flex flex-col justify-center my-3">
        {/* Horizontal reading guide overlay (eye line) */}
        <div className="absolute top-1/3 left-0 right-0 h-16 border-y-2 border-emerald-500/40 bg-emerald-500/5 pointer-events-none z-10 flex items-center justify-between px-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/80 bg-black/60 px-2 py-0.5 rounded">
            LÍNEA DE MIRADA A CÁMARA
          </span>
          <span className="text-[10px] font-mono text-emerald-400/80 bg-black/60 px-2 py-0.5 rounded">
            CENTRO DE ENFOQUE
          </span>
        </div>

        {/* Scrollable Prompter Container */}
        <div
          ref={scrollRef}
          className={`h-[480px] sm:h-[550px] overflow-y-auto px-6 sm:px-16 py-32 space-y-16 scrollbar-none transition-transform ${
            isMirrored ? 'scale-x-[-1]' : ''
          }`}
          style={{ scrollBehavior: isPlaying ? 'auto' : 'smooth' }}
        >
          {fullScript.map((item) => (
            <div key={item.id} className="space-y-4 max-w-4xl mx-auto border-b border-slate-900 pb-10">
              <div className="flex items-center space-x-3 text-emerald-400 text-sm font-mono uppercase tracking-wider">
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 font-bold">
                  ESCENA {item.id}
                </span>
                <span className="text-slate-400">{item.timecode}</span>
                <span className="text-sky-400 font-semibold">• {item.speaker}</span>
              </div>

              <p
                className="font-medium text-slate-100 leading-relaxed tracking-wide select-none"
                style={{ fontSize: `${fontSize}px`, lineHeight: 1.55 }}
              >
                {item.text}
              </p>
            </div>
          ))}

          {/* End of Script Sign */}
          <div className="text-center py-20 text-slate-500 font-mono text-sm tracking-widest uppercase">
            *** FIN DEL GUION PROMOCIONAL SENA META ***
          </div>
        </div>
      </div>

      {/* Prompter footer hints */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs text-slate-500 font-mono">
        <span>Presione ESPACIO para pausar o reanudar</span>
        <span>Ajuste la velocidad según el ritmo natural de respiración</span>
      </div>
    </div>
  );
};
