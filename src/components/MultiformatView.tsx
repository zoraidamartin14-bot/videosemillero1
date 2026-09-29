import React, { useState } from 'react';
import { Share2, Smartphone, Monitor, Briefcase, Play, Square, Copy, Check, Sparkles } from 'lucide-react';
import { FORMAT_SCRIPTS } from '../data/scriptData';
import { ScriptFormat } from '../types/script';
import { SpeechService } from '../utils/speech';

export const MultiformatView: React.FC = () => {
  const [selectedFormatId, setSelectedFormatId] = useState<'master' | 'reels' | 'linkedin'>('reels');
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeFormat = FORMAT_SCRIPTS.find(f => f.id === selectedFormatId) || FORMAT_SCRIPTS[0];

  const handlePlayVoice = () => {
    if (isPlaying) {
      SpeechService.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      SpeechService.speak(
        activeFormat.scriptBody,
        () => setIsPlaying(false),
        () => setIsPlaying(false)
      );
    }
  };

  const handleCopy = () => {
    const fullText = `${activeFormat.name.toUpperCase()} (${activeFormat.aspectRatio} - ${activeFormat.duration})
GANCHO:
${activeFormat.hook}

CUERPO DEL GUION:
${activeFormat.scriptBody}

LLAMADO A LA ACCIÓN:
${activeFormat.callToAction}`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
            <Share2 className="w-4 h-4" />
            <span>Estrategia de Difusión Omnicanal</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Adaptador de Formatos para Redes y Canales Oficiales
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Versiones adaptadas con ritmos, ganchos y llamados a la acción diseñados específicamente para el consumo vertical en TikTok/Reels o formal en LinkedIn.
          </p>
        </div>

        {/* Format Selectors */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-medium">
          <button
            onClick={() => {
              SpeechService.stop();
              setIsPlaying(false);
              setSelectedFormatId('reels');
            }}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition ${
              selectedFormatId === 'reels'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>9:16 Reels / TikTok</span>
          </button>

          <button
            onClick={() => {
              SpeechService.stop();
              setIsPlaying(false);
              setSelectedFormatId('linkedin');
            }}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition ${
              selectedFormatId === 'linkedin'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>1:1 LinkedIn / B2B</span>
          </button>

          <button
            onClick={() => {
              SpeechService.stop();
              setIsPlaying(false);
              setSelectedFormatId('master');
            }}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition ${
              selectedFormatId === 'master'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>16:9 Institucional</span>
          </button>
        </div>
      </div>

      {/* Main Format Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Script Content Card (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono uppercase text-emerald-400 font-bold">
                {activeFormat.aspectRatio} • Duración estimada: {activeFormat.duration}
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {activeFormat.name}
              </h3>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handlePlayVoice}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  isPlaying
                    ? 'bg-rose-600 text-white'
                    : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Pausar Lectura</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Mesa de Lectura</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Guion</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Hook */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
              Gancho Inicial (Primeros 3 Segundos):
            </span>
            <p className="text-sm font-semibold text-white">
              "{activeFormat.hook}"
            </p>
          </div>

          {/* Body */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Cuerpo del Guion & Diálogos:
            </span>
            <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-sm leading-relaxed whitespace-pre-line font-mono">
              {activeFormat.scriptBody}
            </div>
          </div>

          {/* Call to Action */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
              Llamado a la Acción (CTA de Cierre):
            </span>
            <p className="text-sm font-medium text-emerald-200">
              "{activeFormat.callToAction}"
            </p>
          </div>
        </div>

        {/* Sidebar: Audience & Distribution Tips (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Target audience */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2.5">
            <h4 className="text-xs font-bold uppercase text-sky-400 tracking-wider">
              Público Objetivo del Formato:
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeFormat.targetAudience}
            </p>
          </div>

          {/* Distribution tips */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase text-emerald-400 tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Consejos de Producción y Pauta:</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {activeFormat.distributionTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Framing Visual Cue */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-center space-y-3">
            <span className="text-xs font-mono text-slate-500 uppercase block">
              Esquema de Encuadre
            </span>
            <div className="flex justify-center">
              {selectedFormatId === 'reels' && (
                <div className="w-24 h-40 border-2 border-dashed border-rose-500/50 rounded-xl flex items-center justify-center bg-rose-500/5 text-rose-300 text-xs font-mono">
                  9:16 Vertical
                </div>
              )}
              {selectedFormatId === 'linkedin' && (
                <div className="w-32 h-32 border-2 border-dashed border-sky-500/50 rounded-xl flex items-center justify-center bg-sky-500/5 text-sky-300 text-xs font-mono">
                  1:1 Cuadrado
                </div>
              )}
              {selectedFormatId === 'master' && (
                <div className="w-44 h-24 border-2 border-dashed border-emerald-500/50 rounded-xl flex items-center justify-center bg-emerald-500/5 text-emerald-300 text-xs font-mono">
                  16:9 Panorámico
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Zona segura para subtítulos y logotipos del SENA activa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
