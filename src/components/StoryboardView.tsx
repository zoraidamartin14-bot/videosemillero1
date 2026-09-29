import React, { useState } from 'react';
import { Camera, Film, Layers, MapPin, Sparkles, User, Tag, Eye } from 'lucide-react';
import { SCENES } from '../data/scriptData';
import { Scene } from '../types/script';

export const StoryboardView: React.FC = () => {
  const [selectedShotType, setSelectedShotType] = useState<string>('all');

  const shotTypes = ['all', 'DRON', 'PMC', 'PP', 'TRAVELLING', 'PG', 'PD'];

  const filteredScenes = selectedShotType === 'all'
    ? SCENES
    : SCENES.filter(s => s.shotType === selectedShotType);

  return (
    <div className="space-y-6 py-6">
      {/* Header card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
            <Film className="w-4 h-4" />
            <span>Guía Gráfica y Claqueta de Rodaje</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Storyboard & Shot List Técnico
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Visualización secuencial de encuadres, composición de escena, actores en uniforme institucional y especificaciones para el equipo de fotografía.
          </p>
        </div>

        {/* Filter by shot type */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="px-2 py-1 text-slate-500 font-semibold text-[11px]">Tipo de Plano:</span>
          {shotTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedShotType(type)}
              className={`px-2.5 py-1 rounded-lg font-mono font-medium transition ${
                selectedShotType === type
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {type === 'all' ? 'Todos' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Storyboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScenes.map((scene) => (
          <div
            key={scene.id}
            className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all flex flex-col justify-between shadow-lg hover:shadow-emerald-950/20"
          >
            <div>
              {/* Visual 16:9 Viewfinder Canvas Frame */}
              <div className="relative aspect-video bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 p-4 flex flex-col justify-between overflow-hidden">
                {/* Camera Grid Lines Overlay (Rule of Thirds) */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20 border border-white/20">
                  <div className="border-r border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-b border-white/20" />
                  <div className="border-r border-white/20" />
                  <div className="border-r border-white/20" />
                  <div />
                </div>

                {/* Top Viewfinder HUD */}
                <div className="flex items-center justify-between text-[11px] font-mono relative z-10">
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    REC [4K 24FPS]
                  </span>
                  <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-slate-300 border border-white/10 font-bold">
                    ESCENA {scene.id}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-amber-400 border border-white/10">
                    {scene.shotType}
                  </span>
                </div>

                {/* Center Cinematic Composition Graphic Representation */}
                <div className="my-auto text-center relative z-10 space-y-1">
                  <div className="inline-block px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-bold text-xs tracking-wide">
                    {scene.shotName}
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-2 px-2">
                    {scene.cameraMovement}
                  </p>
                </div>

                {/* Bottom Viewfinder HUD */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 relative z-10">
                  <span>TC: {scene.timecode}</span>
                  <span className="text-white font-bold">{scene.durationSec}s</span>
                  <span className="text-emerald-400 font-semibold uppercase">{scene.act}</span>
                </div>
              </div>

              {/* Card Body Details */}
              <div className="p-5 space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Acción & Encuadre
                  </span>
                  <p className="text-xs text-slate-200 line-clamp-3 leading-relaxed">
                    {scene.videoDescription}
                  </p>
                </div>

                {/* SENA Uniform Focus Badge */}
                <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs">
                  <div className="flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-300 line-clamp-2">
                      <strong className="text-emerald-400">SENA:</strong> {scene.visualCuesSENA}
                    </p>
                  </div>
                </div>

                {/* Dialogue Snippet */}
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                  <span className="text-[10px] font-semibold text-sky-400 block mb-0.5">
                    Audio / Locución:
                  </span>
                  <p className="text-[11px] text-slate-400 italic line-clamp-2">
                    "{scene.audioVoiceover}"
                  </p>
                </div>
              </div>
            </div>

            {/* Location & Props footer */}
            <div className="px-5 py-2.5 bg-slate-950 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1 truncate max-w-[200px]" title={scene.locationTip}>
                <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                <span className="truncate">{scene.locationTip}</span>
              </span>
              <span className="font-mono text-emerald-400 font-semibold">
                {scene.propsRequired.length} utilerías
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
