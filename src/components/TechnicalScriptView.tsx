import React, { useState } from 'react';
import { 
  Play, 
  Square, 
  Volume2, 
  Camera, 
  Video, 
  Music, 
  MapPin, 
  Clock, 
  SlidersHorizontal, 
  Eye, 
  Tag, 
  Sparkles,
  Info,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { SCENES, PROJECT_INFO } from '../data/scriptData';
import { Scene } from '../types/script';
import { SpeechService } from '../utils/speech';

export const TechnicalScriptView: React.FC = () => {
  const [filterAct, setFilterAct] = useState<'all' | 'intro' | 'desarrollo' | 'cierre'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activePlayingId, setActivePlayingId] = useState<number | null>(null);
  const [showDirectingNotes, setShowDirectingNotes] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filteredScenes = SCENES.filter((scene) => {
    const matchesAct = filterAct === 'all' || scene.act === filterAct;
    const matchesSearch =
      scene.videoDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scene.audioVoiceover.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scene.shotName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scene.visualCuesSENA.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAct && matchesSearch;
  });

  const handlePlayScene = (scene: Scene) => {
    if (activePlayingId === scene.id) {
      SpeechService.stop();
      setActivePlayingId(null);
    } else {
      setActivePlayingId(scene.id);
      SpeechService.speak(
        scene.audioVoiceover,
        () => setActivePlayingId(null),
        () => setActivePlayingId(null)
      );
    }
  };

  const handleCopyScene = (scene: Scene) => {
    const textToCopy = `ESCENA ${scene.id} [${scene.timecode}] - ${scene.shotName}
VIDEO:
${scene.videoDescription}
Detalles SENA: ${scene.visualCuesSENA}
Cámara: ${scene.cameraMovement} | Iluminación: ${scene.lighting}

AUDIO:
Locutor: ${scene.audioSpeaker}
Texto: ${scene.audioVoiceover}
Música/SFX: ${scene.sfxAndMusic}`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(scene.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 py-6">
      {/* Script Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 print:border-none print:p-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Formato Estándar Broadcast (2 Columnas)
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Minutaje Total Estimado: {PROJECT_INFO.totalDurationTarget}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Guion Técnico Audiovisual de Producción
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Desglose sincronizado de imagen (cámara, planos, vestuario SENA) y sonido (locución, testimonios, diseño sonoro llanero).
            </p>
          </div>

          {/* Filtering and Search Controls */}
          <div className="flex flex-wrap items-center gap-2.5 print:hidden">
            <div className="flex rounded-lg bg-slate-800 p-0.5 border border-slate-700 text-xs font-medium">
              <button
                onClick={() => setFilterAct('all')}
                className={`px-3 py-1.5 rounded-md transition ${
                  filterAct === 'all'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Todas ({SCENES.length})
              </button>
              <button
                onClick={() => setFilterAct('intro')}
                className={`px-3 py-1.5 rounded-md transition ${
                  filterAct === 'intro'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                1. Introducción
              </button>
              <button
                onClick={() => setFilterAct('desarrollo')}
                className={`px-3 py-1.5 rounded-md transition ${
                  filterAct === 'desarrollo'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                2. Desarrollo
              </button>
              <button
                onClick={() => setFilterAct('cierre')}
                className={`px-3 py-1.5 rounded-md transition ${
                  filterAct === 'cierre'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                3. Cierre
              </button>
            </div>

            <button
              onClick={() => setShowDirectingNotes(!showDirectingNotes)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                showDirectingNotes
                  ? 'bg-slate-800 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
              title="Mostrar u ocultar notas de dirección y utilería"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Notas de Dirección</span>
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between print:hidden">
          <input
            type="text"
            placeholder="Buscar por plano, uniforme, locación, palabra clave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-md px-3.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <span className="text-xs text-slate-400 hidden sm:inline">
            Mostrando {filteredScenes.length} de {SCENES.length} escenas
          </span>
        </div>
      </div>

      {/* Two Column Script Table / Grid */}
      <div className="space-y-5">
        {filteredScenes.map((scene) => {
          const isPlaying = activePlayingId === scene.id;

          return (
            <div
              key={scene.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isPlaying
                  ? 'bg-slate-900/90 border-emerald-500/80 ring-2 ring-emerald-500/30 shadow-xl'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              } print:border-slate-400 print:bg-white print:text-black print:mb-6 print:break-inside-avoid`}
            >
              {/* Scene Header Strip */}
              <div className="px-5 py-3 bg-slate-950/80 border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-3 print:bg-slate-100 print:border-b-2 print:border-slate-300">
                <div className="flex items-center space-x-3">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center border border-emerald-500/30 print:text-black print:border-black">
                    #{scene.id}
                  </span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-white print:text-black">
                        {scene.shotName}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700 print:border-slate-400 print:text-black">
                        {scene.timecode}
                      </span>
                      <span className="text-[11px] font-medium text-emerald-400 font-mono">
                        ({scene.durationSec}s)
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block print:text-slate-600">
                      {scene.actTitle}
                    </span>
                  </div>
                </div>

                {/* Quick actions for this scene */}
                <div className="flex items-center space-x-2 print:hidden">
                  <button
                    onClick={() => handleCopyScene(scene)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="Copiar contenido de la escena"
                  >
                    {copiedId === scene.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => handlePlayScene(scene)}
                    className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      isPlaying
                        ? 'bg-rose-600 text-white'
                        : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Square className="w-3 h-3 fill-current" />
                        <span>Pausar</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 fill-current" />
                        <span>Escuchar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Two Column Layout (VIDEO / AUDIO) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 print:divide-slate-300">
                {/* COLUMN 1: VIDEO & CINEMATOGRAPHY (7 cols) */}
                <div className="lg:col-span-7 p-5 space-y-3.5 print:text-black">
                  <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-700">
                    <Video className="w-4 h-4" />
                    <span>Columna de Video & Puesta en Escena</span>
                  </div>

                  {/* Main Action & Visual Narrative */}
                  <div>
                    <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 print:text-slate-600">
                      Acción Visual:
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal print:text-black">
                      {scene.videoDescription}
                    </p>
                  </div>

                  {/* SENA Uniform and Identity Cues */}
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 print:bg-slate-50 print:border-slate-300">
                    <div className="flex items-start space-x-2">
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 print:text-emerald-700" />
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 print:text-emerald-800">
                          Directriz de Uniforme e Identidad SENA:
                        </span>
                        <p className="text-xs text-slate-300 print:text-slate-800">
                          {scene.visualCuesSENA}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Camera & Lighting Specs */}
                  {showDirectingNotes && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
                      <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 print:bg-white print:border-slate-300">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5 print:text-slate-600">
                          Cámara & Movimiento
                        </span>
                        <span className="text-slate-300 print:text-black leading-snug block">
                          {scene.cameraMovement}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 print:bg-white print:border-slate-300">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5 print:text-slate-600">
                          Iluminación & Atmósfera
                        </span>
                        <span className="text-slate-300 print:text-black leading-snug block">
                          {scene.lighting}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* COLUMN 2: AUDIO, VOICEOVER & SOUND DESIGN (5 cols) */}
                <div className="lg:col-span-5 p-5 space-y-3.5 bg-slate-900/40 print:bg-white print:text-black">
                  <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-sky-400 print:text-sky-700">
                    <Volume2 className="w-4 h-4" />
                    <span>Columna de Audio & Diálogos</span>
                  </div>

                  {/* Speaker Badge */}
                  <div>
                    <span className="inline-block px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-300 border border-sky-500/20 print:bg-sky-50 print:border-sky-300 print:text-sky-900">
                      {scene.audioSpeaker}
                    </span>
                  </div>

                  {/* Voiceover or Dialogue Text */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-100 font-medium leading-relaxed italic print:bg-slate-50 print:border-slate-300 print:text-black whitespace-pre-line">
                    "{scene.audioVoiceover}"
                  </div>

                  {/* SFX and Music Design */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center space-x-1.5 text-xs text-amber-400 font-semibold print:text-amber-800">
                      <Music className="w-3.5 h-3.5" />
                      <span>Banda Sonora & Foley Llanero:</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed print:text-slate-700">
                      {scene.sfxAndMusic}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer strip: Location and Props */}
              {showDirectingNotes && (
                <div className="px-5 py-2.5 bg-slate-950/90 border-t border-slate-800/80 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-400 print:bg-slate-100 print:border-slate-300 print:text-slate-800">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span><strong>Locación sugerida Meta:</strong> {scene.locationTip}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-slate-400">Utilería:</span>
                    {scene.propsRequired.map((prop, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-800/80 text-slate-300 border border-slate-700/60 print:bg-white print:border-slate-400 print:text-black"
                      >
                        {prop}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
