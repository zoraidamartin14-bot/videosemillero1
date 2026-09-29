import React from 'react';
import { Clapperboard, Printer, Play, Square, Sparkles, BookOpen, Layers, MonitorPlay, Calendar, Share2, QrCode } from 'lucide-react';
import { PROJECT_INFO } from '../data/scriptData';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isPlayingAll: boolean;
  onTogglePlayAll: () => void;
  onOpenTeleprompter: () => void;
  onOpenQrCode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isPlayingAll,
  onTogglePlayAll,
  onOpenTeleprompter,
  onOpenQrCode,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 print:static print:bg-white print:border-b-2 print:border-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Institution & Project Badge */}
          <div className="flex items-start sm:items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white shrink-0">
              <Clapperboard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  SENA Regional Meta
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  SENNOVA
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Centro de Industria y Servicios
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
                {PROJECT_INFO.shortTitle}
              </h1>
              <p className="text-xs text-slate-400 line-clamp-1 max-w-2xl">
                {PROJECT_INFO.title}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 print:hidden">
            <button
              onClick={onTogglePlayAll}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isPlayingAll
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
              }`}
              title="Lectura dramática de voz en off (Mesa de lectura)"
            >
              {isPlayingAll ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Detener Lectura</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Mesa de Lectura (Audio)</span>
                </>
              )}
            </button>

            <button
              onClick={onOpenTeleprompter}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Abrir Teleprompter de rodaje a pantalla completa"
            >
              <MonitorPlay className="w-3.5 h-3.5 text-emerald-400" />
              <span>Teleprompter</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Imprimir o exportar PDF listo para rodaje"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Imprimir / PDF</span>
            </button>

            {onOpenQrCode && (
              <button
                onClick={onOpenQrCode}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 transition shadow-sm"
                title="Abrir o descargar código QR para ver el video"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>QR Video</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none border-t border-slate-800/80 pt-2 text-sm print:hidden">
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg whitespace-nowrap font-bold text-xs sm:text-sm transition ${
              activeTab === 'video'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>🎬 Ver Video (Simulador Oficial)</span>
          </button>

          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg whitespace-nowrap font-medium text-xs sm:text-sm transition ${
              activeTab === 'analysis'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Análisis Paso a Paso</span>
          </button>

          <button
            onClick={() => setActiveTab('script')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg whitespace-nowrap font-medium text-xs sm:text-sm transition ${
              activeTab === 'script'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Clapperboard className="w-4 h-4" />
            <span>2. Guion Técnico Master</span>
          </button>

          <button
            onClick={() => setActiveTab('storyboard')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg whitespace-nowrap font-medium text-xs sm:text-sm transition ${
              activeTab === 'storyboard'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>3. Storyboard & Shot List</span>
          </button>

          <button
            onClick={() => setActiveTab('callsheet')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg whitespace-nowrap font-medium text-xs sm:text-sm transition ${
              activeTab === 'callsheet'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>4. Plan de Rodaje & Uniformes</span>
          </button>

          <button
            onClick={() => setActiveTab('multiformat')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg whitespace-nowrap font-medium text-xs sm:text-sm transition ${
              activeTab === 'multiformat'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>5. Formatos Redes (Reels)</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
