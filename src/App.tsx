import React, { useState } from 'react';
import { Header } from './components/Header';
import { VideoPlayerView } from './components/VideoPlayerView';
import { StepAnalysisView } from './components/StepAnalysisView';
import { TechnicalScriptView } from './components/TechnicalScriptView';
import { StoryboardView } from './components/StoryboardView';
import { CallSheetView } from './components/CallSheetView';
import { MultiformatView } from './components/MultiformatView';
import { TeleprompterView } from './components/TeleprompterView';
import { QRCodeModal } from './components/QRCodeModal';
import { SCENES, PROJECT_INFO } from './data/scriptData';
import { SpeechService } from './utils/speech';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('video');
  const [isTeleprompterModalOpen, setIsTeleprompterModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isPlayingAll, setIsPlayingAll] = useState(false);

  const handleTogglePlayAll = () => {
    if (isPlayingAll) {
      SpeechService.stop();
      setIsPlayingAll(false);
    } else {
      setIsPlayingAll(true);
      const fullNarration = SCENES.map(
        (s) => `Escena ${s.id}. ${s.audioVoiceover}`
      ).join('. ... ');

      SpeechService.speak(
        fullNarration,
        () => setIsPlayingAll(false),
        () => setIsPlayingAll(false)
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isPlayingAll={isPlayingAll}
        onTogglePlayAll={handleTogglePlayAll}
        onOpenTeleprompter={() => setIsTeleprompterModalOpen(true)}
        onOpenQrCode={() => setIsQrModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {activeTab === 'video' && <VideoPlayerView />}

        {activeTab === 'analysis' && (
          <StepAnalysisView onGoToScript={() => setActiveTab('script')} />
        )}

        {activeTab === 'script' && <TechnicalScriptView />}

        {activeTab === 'storyboard' && <StoryboardView />}

        {activeTab === 'callsheet' && <CallSheetView />}

        {activeTab === 'multiformat' && <MultiformatView />}
      </main>

      {/* Fullscreen Teleprompter Modal */}
      {isTeleprompterModalOpen && (
        <TeleprompterView
          isModal={true}
          onClose={() => setIsTeleprompterModalOpen(false)}
        />
      )}

      {/* Global QR Code Modal */}
      <QRCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-medium text-slate-400">
            {PROJECT_INFO.title}
          </p>
          <p>
            {PROJECT_INFO.institution} • {PROJECT_INFO.regional} • {PROJECT_INFO.center} • {PROJECT_INFO.program}
          </p>
          <p className="text-[11px] text-slate-600">
            Sistema de Investigación, Innovación y Desarrollo Tecnológico (SENNOVA) — 2026
          </p>
        </div>
      </footer>
    </div>
  );
}

