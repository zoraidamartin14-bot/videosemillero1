import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Subtitles, 
  Download, 
  SkipForward, 
  SkipBack, 
  Sparkles, 
  Layers, 
  Film, 
  CheckCircle2, 
  TrendingUp, 
  BarChart2, 
  Clock,
  QrCode,
  Youtube,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Copy,
  Check,
  MessageSquare,
  Send,
  Bookmark,
  ExternalLink,
  Award,
  Bell
} from 'lucide-react';
import { SCENES, PROJECT_INFO } from '../data/scriptData';
import { Scene } from '../types/script';
import { SpeechService } from '../utils/speech';
import { CinematicAudioEngine } from '../utils/audioEngine';
import { QRCodeModal } from './QRCodeModal';

export const VideoPlayerView: React.FC = () => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sceneProgress, setSceneProgress] = useState(0); // 0 to 100%
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // YouTube Mode States
  const [playerMode, setPlayerMode] = useState<'youtube' | 'studio'>('youtube');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [likeCount, setLikeCount] = useState(1480);
  const [hasLiked, setHasLiked] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [copiedYouTube, setCopiedYouTube] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentsList, setCommentsList] = useState<Array<{ id: number; author: string; role: string; text: string; time: string; likes: number }>>([
    {
      id: 1,
      author: 'Cámara de Comercio de Villavicencio',
      role: 'Gremio Empresarial',
      text: 'Excelente iniciativa del SENA Regional Meta. Las microempresas de nuestra región necesitan urgentemente este acompañamiento para ordenar sus procesos y dar el salto digital.',
      time: 'Hace 3 horas',
      likes: 42
    },
    {
      id: 2,
      author: 'Carlos Alberto Parra',
      role: 'Gerente Llanera de Suministros (Empresario Diagnosticado)',
      text: 'El diagnóstico de los aprendices fue impecable. Nos ayudaron a ver los cuellos de botella que nos costaban horas de trabajo. ¡100% recomendado este programa!',
      time: 'Hace 5 horas',
      likes: 31
    },
    {
      id: 3,
      author: 'Semillero SENNOVA Meta',
      role: 'Investigación Aplicada',
      text: 'Un orgullo ver el impacto real de la formación técnica y tecnológica en el tejido productivo del Meta. Investigación pertinente con resultados medibles.',
      time: 'Hace 1 día',
      likes: 89
    }
  ]);

  const playerContainerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const closingQrCanvasRef = useRef<HTMLCanvasElement>(null);

  const currentScene: Scene = SCENES[currentSceneIndex] || SCENES[0];

  // Draw real QR Code when Scene 10 is shown
  useEffect(() => {
    if (currentScene.id === 10 && closingQrCanvasRef.current) {
      const activeUrl = 'https://ais-dev-unondlu4onjsfpc3sicelv-456730629844.us-east5.run.app';

      QRCode.toCanvas(
        closingQrCanvasRef.current,
        activeUrl,
        {
          width: 135,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'M',
        },
        (err) => {
          if (err) console.error('Error drawing scene 10 QR code:', err);
        }
      );
    }
  }, [currentScene.id]);

  // Calculate total seconds elapsed up to current scene
  const totalDuration = SCENES.reduce((acc, s) => acc + s.durationSec, 0);
  const elapsedBeforeCurrent = SCENES.slice(0, currentSceneIndex).reduce((acc, s) => acc + s.durationSec, 0);
  const totalElapsed = elapsedBeforeCurrent + (sceneProgress / 100) * currentScene.durationSec;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Transition to a specific scene
  const goToScene = (index: number) => {
    if (index < 0 || index >= SCENES.length) return;
    SpeechService.stop();
    setSceneProgress(0);
    setCurrentSceneIndex(index);
    CinematicAudioEngine.playWhoosh();

    if (isPlaying) {
      playSceneVoice(SCENES[index]);
    }
  };

  const playSceneVoice = (scene: Scene) => {
    if (isMuted) return;

    CinematicAudioEngine.setVoiceDucking(true);
    SpeechService.speak(
      scene.audioVoiceover,
      () => {
        CinematicAudioEngine.setVoiceDucking(false);
        // Voice finished, auto advance when scene timer completes
      },
      () => {
        CinematicAudioEngine.setVoiceDucking(false);
      }
    );
  };

  // Play / Pause toggle
  const handleTogglePlay = async () => {
    await CinematicAudioEngine.resume();

    if (isPlaying) {
      setIsPlaying(false);
      SpeechService.stop();
      CinematicAudioEngine.stopBackgroundMusic();
      CinematicAudioEngine.setVoiceDucking(false);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    } else {
      setIsPlaying(true);
      if (!isMuted) {
        CinematicAudioEngine.startBackgroundMusic();
        playSceneVoice(currentScene);
      }
    }
  };

  // Scene timing loop
  useEffect(() => {
    if (!isPlaying) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const intervalTime = 100; // ms
    const step = (intervalTime / (currentScene.durationSec * 1000)) * 100;

    progressIntervalRef.current = window.setInterval(() => {
      setSceneProgress((prev) => {
        if (prev >= 100) {
          // Advance to next scene or end
          if (currentSceneIndex < SCENES.length - 1) {
            const nextIdx = currentSceneIndex + 1;
            setCurrentSceneIndex(nextIdx);
            CinematicAudioEngine.playWhoosh();
            if (!isMuted) {
              playSceneVoice(SCENES[nextIdx]);
            }
            return 0;
          } else {
            // Video finished
            setIsPlaying(false);
            SpeechService.stop();
            CinematicAudioEngine.stopBackgroundMusic();
            CinematicAudioEngine.playSenaMnemonic();
            return 100;
          }
        }
        return prev + step;
      });
    }, intervalTime);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlaying, currentSceneIndex, isMuted]);

  // Handle Mute toggle
  const handleToggleMute = () => {
    if (!isMuted) {
      setIsMuted(true);
      CinematicAudioEngine.stopBackgroundMusic();
      SpeechService.stop();
    } else {
      setIsMuted(false);
      if (isPlaying) {
        CinematicAudioEngine.startBackgroundMusic();
        playSceneVoice(currentScene);
      }
    }
  };

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Quick export / record clip simulation
  const handleDownloadVideo = () => {
    setIsRecording(true);
    setRecordingProgress(10);
    const interval = setInterval(() => {
      setRecordingProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setIsRecording(false);

          // Create mock export metadata file
          const blob = new Blob([
            JSON.stringify(
              {
                project: PROJECT_INFO.title,
                institution: PROJECT_INFO.institution,
                regional: PROJECT_INFO.regional,
                scenes: SCENES.map((s) => ({
                  id: s.id,
                  title: s.shotName,
                  timecode: s.timecode,
                  duration: `${s.durationSec}s`,
                  voiceover: s.audioVoiceover,
                  camera: s.cameraMovement,
                })),
                exportTimestamp: new Date().toISOString(),
                format: 'Full HD 1080p 24fps MP4/H.264 Ready',
              },
              null,
              2
            ),
          ], { type: 'application/json' });

          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `SENA_Meta_Video_Produccion_Master.json`;
          a.click();
          URL.revokeObjectURL(url);
          return 0;
        }
        return p + 20;
      });
    }, 400);
  };

  const handleLikeToggle = () => {
    if (hasLiked) {
      setHasLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setHasLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentsList([
      {
        id: Date.now(),
        author: 'Espectador SENA',
        role: 'Comunidad',
        text: newComment.trim(),
        time: 'Hace un momento',
        likes: 1,
      },
      ...commentsList,
    ]);
    setNewComment('');
  };

  const handleCopyYouTubePackage = () => {
    const text = `TÍTULO RECOMENDADO PARA YOUTUBE:
Innovación SENA Meta | Diagnóstico y Mejora de Procesos con Herramientas Digitales en MiPymes (SENNOVA)

DESCRIPCIÓN DEL VIDEO:
En el departamento del Meta, más de 25.000 micro y pequeñas empresas impulsan la economía regional. Sin embargo, más del 55% aún gestiona su información en papel y procesos manuales.

Desde el Centro de Industria y Servicios (SENA Regional Meta), los aprendices del Tecnólogo en Gestión Administrativa intervinieron cuatro microempresas del departamento para diagnosticar sus falencias críticas y formular propuestas de mejora mediante herramientas tecnológicas accesibles.

📌 CAPÍTULOS DE YOUTUBE (MARCAS DE TIEMPO):
00:00 - Escena 1: Vista aérea de Villavicencio y las 25.000 MiPymes del Meta
00:12 - Escena 2: La problemática: 55% de empresas en procesos manuales y papel
00:25 - Escena 3: Brecha silenciosa de competitividad en las empresas llaneras
00:36 - Escena 4: Entrada heroica de aprendices del SENA Regional Meta
00:52 - Escena 5: Trabajo de campo y diagnóstico de procesos en la empresa
01:10 - Escena 6: Diagnóstico en 4 microempresas del Meta (3 falencias críticas)
01:25 - Escena 7: Resultados empíricos (90% planeación, 100% procesos, 60% estructura, 50% tecnología)
01:45 - Escena 8: Propuestas con herramientas tecnológicas para procesos críticos
02:00 - Escena 9: Transformación regional y orgullo llanero
02:15 - Escena 10: Placa final institucional SENNOVA y Código QR

🏛️ FICHA TÉCNICA DEL PROYECTO:
• Institución: Servicio Nacional de Aprendizaje (SENA)
• Regional: Regional Meta (Villavicencio, Colombia)
• Centro: Centro de Industria y Servicios
• Programa: Tecnólogo en Gestión Administrativa
• Sistema de Investigación: SENNOVA
• Formato: Full HD 1080p 24fps MP4/H.264 Ready

🔗 ENLACES DE CONTACTO:
• Portal Oficial SENA: https://www.sena.edu.co
• Sistema SENNOVA: https://sennova.sena.edu.co
• Plataforma del Proyecto: https://ais-pre-unondlu4onjsfpc3sicelv-456730629844.us-east5.run.app

#SENAMeta #SENNOVA #GestionAdministrativa #MiPymesMeta #TransformacionDigital #Villavicencio #Colombia`;

    navigator.clipboard.writeText(text);
    setCopiedYouTube(true);
    setTimeout(() => setCopiedYouTube(false), 2500);
  };

  // Keyboard shortcut: Spacebar for play/pause
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        handleTogglePlay();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isPlaying, currentSceneIndex, isMuted]);

  return (
    <div className="space-y-6 py-6">
      {/* View Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
            <Film className="w-4 h-4" />
            <span>Simulador & Render Cinemático Oficial</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Reproductor Audiovisual del Proyecto SENA Meta
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Previsualización en tiempo real con tomas fotográficas generadas, voz en off sincronizada, grafismos en movimiento y banda sonora llanera.
          </p>
        </div>

        {/* Mode selector: YouTube vs Studio */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setPlayerMode('youtube')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                playerMode === 'youtube'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Youtube className="w-3.5 h-3.5" />
              <span>Modo YouTube</span>
            </button>
            <button
              onClick={() => setPlayerMode('studio')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                playerMode === 'studio'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Modo Estudio</span>
            </button>
          </div>

          <button
            onClick={handleCopyYouTubePackage}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 shadow-sm transition"
            title="Copiar título, descripción y marcas de tiempo para YouTube Studio"
          >
            {copiedYouTube ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-red-400" />}
            <span>{copiedYouTube ? '¡Ficha Copiada!' : 'Ficha YouTube'}</span>
          </button>

          <button
            onClick={() => setIsQrModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/40 shadow-sm transition"
            title="Generar y descargar código QR para ver el video"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Video</span>
          </button>

          <button
            onClick={handleDownloadVideo}
            disabled={isRecording}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isRecording ? `Exportando...` : 'Exportar Master'}</span>
          </button>
        </div>
      </div>

      {/* Main 16:9 Broadcast Cinema Player */}
      <div
        ref={playerContainerRef}
        className="relative aspect-video w-full rounded-2xl bg-black border border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between select-none group"
      >
        {/* Background Visual Layer: Real Generated Images or Motion Graphic Canvas */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950 flex items-center justify-center">
          {currentScene.imageAsset ? (
            <div className="relative w-full h-full">
              <img
                src={currentScene.imageAsset}
                alt={currentScene.shotName}
                className={`w-full h-full object-cover transition-all duration-1000 ease-out transform ${
                  isPlaying ? 'scale-105 translate-x-1' : 'scale-100'
                }`}
              />

              {/* Special Graphic Overlay for Scene 6: Diagnóstico en 4 Microempresas */}
              {currentScene.id === 6 && (
                <div className="absolute top-16 right-4 sm:right-8 max-w-sm bg-slate-950/90 backdrop-blur-md border border-emerald-500/40 rounded-2xl p-4 shadow-2xl space-y-2.5 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                      MUESTRA DE INVESTIGACIÓN
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                      4 MiPymes Meta
                    </span>
                  </div>

                  <span className="text-xs font-bold text-white block">
                    Falencias Críticas Diagnosticadas:
                  </span>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center space-x-2 p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      <span className="font-semibold">Gestión Documental:</span>
                      <span className="text-slate-300 text-[10px]">Archivos en papel</span>
                    </div>

                    <div className="flex items-center space-x-2 p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span className="font-semibold">Organización de Procesos:</span>
                      <span className="text-slate-300 text-[10px]">Cuellos de botella</span>
                    </div>

                    <div className="flex items-center space-x-2 p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      <span className="font-semibold">Falta de Planeación:</span>
                      <span className="text-slate-300 text-[10px]">Decisiones reactivas</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Special Graphic Overlay for Scene 7: Hallazgos Estadísticos (90%, 100%, 60%, 50%) */}
              {currentScene.id === 7 && (
                <div className="absolute top-10 sm:top-12 right-4 sm:right-8 max-w-md bg-slate-950/95 backdrop-blur-md border border-emerald-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                      RESULTADOS DEL DIAGNÓSTICO (SENA META)
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold border border-rose-500/30">
                      Muestra Empírica
                    </span>
                  </div>

                  <span className="text-xs font-bold text-white block">
                    Diagnóstico Cuantitativo en las 4 Microempresas:
                  </span>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-rose-500/30">
                      <div className="flex items-center justify-between">
                        <span className="text-xl sm:text-2xl font-black text-rose-400 font-mono">90%</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">Crítico</span>
                      </div>
                      <span className="font-semibold text-white block mt-1 leading-tight text-[11px]">Adolecen de Planeación</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Operación reactiva sin metas</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-rose-500/40">
                      <div className="flex items-center justify-between">
                        <span className="text-xl sm:text-2xl font-black text-rose-400 font-mono">100%</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">Total</span>
                      </div>
                      <span className="font-semibold text-white block mt-1 leading-tight text-[11px]">Sin Gestión por Procesos</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Sin manuales ni flujos</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/30">
                      <div className="flex items-center justify-between">
                        <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">60%</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">Alto</span>
                      </div>
                      <span className="font-semibold text-white block mt-1 leading-tight text-[11px]">Sin Estructura ni Funciones</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Sin roles definidos</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-emerald-500/40">
                      <div className="flex items-center justify-between">
                        <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">50%</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">Oportunidad</span>
                      </div>
                      <span className="font-semibold text-white block mt-1 leading-tight text-[11px]">Tienen Tecnología</span>
                      <span className="text-[10px] text-emerald-300 block mt-0.5">Recursos listos para optimizar</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Motion Graphics Dynamic Scene for Data & Plaque
            <div className="w-full h-full bg-gradient-to-br from-slate-950 via-emerald-950/40 to-slate-950 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
              {/* Radial Glow */}
              <div className="absolute w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

              {currentScene.id === 3 ? (
                // 55% Digital Gap Motion Graphic
                <div className="space-y-4 relative z-10 max-w-xl animate-fade-in">
                  <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 text-xs font-bold uppercase tracking-widest">
                    <span>Diagnóstico de Madurez Digital</span>
                  </div>
                  <div className="text-6xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 tracking-tight">
                    55%
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wider">
                    Brecha en Digitalización Administrativa
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300">
                    En micro y pequeñas empresas del Departamento del Meta según Semillero SENNOVA
                  </p>
                </div>
              ) : currentScene.id === 8 ? (
                // Scene 8: Propuestas Tecnológicas para Procesos Críticos
                <div className="space-y-5 relative z-10 max-w-3xl animate-fade-in text-left">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/30 pb-3">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider font-mono">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Propuestas del Tecnólogo en Gestión Administrativa</span>
                    </div>
                    <span className="text-xs font-mono text-slate-300">
                      Solución a Procesos Críticos Diagnosticados
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Intervención con Herramientas Tecnológicas a la Medida:
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                    <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 backdrop-blur-md space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Pilar 1</span>
                        <span className="text-lg">📁</span>
                      </div>
                      <h4 className="text-sm font-bold text-white leading-snug">Gestión Documental en la Nube</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Digitalización, tablas de retención y repositorios cloud seguros para cero extravío de documentos contables.
                      </p>
                      <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        Google Workspace / OneDrive
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/90 border border-sky-500/30 backdrop-blur-md space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Pilar 2</span>
                        <span className="text-lg">🔄</span>
                      </div>
                      <h4 className="text-sm font-bold text-white leading-snug">Organización por Procesos</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Modelado BPMN, manuales de funciones y tableros ágiles para estructurar al 100% de la empresa.
                      </p>
                      <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                        Bizagi / Trello / Notion
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 backdrop-blur-md space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Pilar 3</span>
                        <span className="text-lg">📈</span>
                      </div>
                      <h4 className="text-sm font-bold text-white leading-snug">Planeación y Dashboards</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Cuadros de mando con métricas en tiempo real para revertir el 90% de falta de planeación.
                      </p>
                      <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        Looker Studio / AppSheet
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                // SENA Institutional Closing Plaque (Scene 10) with Real Interactive QR Code
                <div className="space-y-4 relative z-10 max-w-2xl text-center flex flex-col items-center animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-950/85 backdrop-blur-md p-6 sm:p-7 rounded-3xl border border-emerald-500/40 shadow-2xl">
                    <div className="space-y-2.5 text-center sm:text-left max-w-xs">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-lg border border-emerald-400 mx-auto sm:mx-0">
                        SENA
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        SENA Regional Meta
                      </h3>
                      <p className="text-xs font-semibold text-emerald-400">
                        Centro de Industria y Servicios
                      </p>
                      <p className="text-[11px] text-slate-300">
                        Tecnólogo en Gestión Administrativa • SENNOVA
                      </p>
                      <div className="pt-1 text-[11px] font-mono text-emerald-300 flex items-center justify-center sm:justify-start gap-1">
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Escanea para ver el video</span>
                      </div>
                    </div>

                    {/* Scannable Real QR Code Canvas */}
                    <div 
                      onClick={() => setIsQrModalOpen(true)}
                      className="p-2.5 bg-white rounded-2xl shadow-2xl border-4 border-emerald-400 cursor-pointer hover:scale-105 transition transform shrink-0 group/qr"
                      title="Haz clic para ampliar y descargar el código QR"
                    >
                      <canvas ref={closingQrCanvasRef} className="rounded" />
                      <span className="block text-[9px] text-slate-800 font-bold uppercase text-center mt-1">
                        Toca para Ampliar
                      </span>
                    </div>
                  </div>

                  <span className="inline-block px-4 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 font-mono text-xs text-slate-300">
                    www.sena.edu.co • Villavicencio, Colombia
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Cinematic Vignette and Color Grading Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
        </div>

        {/* Top Viewport Header HUD */}
        <div className="relative z-10 p-4 sm:p-6 flex items-center justify-between text-xs font-mono text-white/90">
          <div className="flex items-center space-x-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md border border-white/10 text-emerald-400">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-ping' : 'bg-slate-400'}`} />
              {isPlaying ? 'PLAYING [4K MASTER]' : 'PAUSED'}
            </span>
            <span className="px-2 py-1 rounded bg-black/70 backdrop-blur-md border border-white/10 text-slate-300 hidden sm:inline">
              ESCENA {currentScene.id} / {SCENES.length}
            </span>
            {playerMode === 'youtube' && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-600 text-white font-bold text-[10px] uppercase tracking-wider shadow-md shadow-red-600/30">
                <Youtube className="w-3.5 h-3.5 fill-current" />
                <span>YouTube 1080p</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 rounded bg-black/70 backdrop-blur-md border border-white/10 text-amber-300">
              {currentScene.shotType}
            </span>
            <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur-md border border-white/10 text-white font-bold">
              {formatTime(totalElapsed)} / {formatTime(totalDuration)}
            </span>
          </div>
        </div>

        {/* Center Big Play Button (if paused) */}
        {!isPlaying && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <button
              onClick={handleTogglePlay}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/90 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-2xl shadow-emerald-500/50 hover:scale-105 transition transform"
              title="Reproducir video"
            >
              <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current translate-x-0.5" />
            </button>
          </div>
        )}

        {/* Lower Thirds (Chyrons) & Subtitles Layer */}
        <div className="relative z-10 p-4 sm:p-8 space-y-3">
          {/* Lower Third / Chyron */}
          {currentScene.lowerThird && (
            <div className="inline-block max-w-lg bg-slate-950/85 backdrop-blur-md border-l-4 border-emerald-500 px-4 py-2 rounded-r-xl shadow-xl animate-slide-up">
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-emerald-400 block font-mono">
                {currentScene.lowerThird.title}
              </span>
              <span className="text-xs sm:text-sm font-medium text-white block">
                {currentScene.lowerThird.subtitle}
              </span>
            </div>
          )}

          {/* Broadcast Live Subtitles (CC) */}
          {showSubtitles && (
            <div className="flex justify-center">
              <p className="max-w-2xl px-4 py-2 rounded-xl bg-black/85 backdrop-blur-md border border-white/10 text-center text-xs sm:text-sm text-yellow-300 font-semibold leading-relaxed shadow-lg">
                "{currentScene.audioVoiceover}"
              </p>
            </div>
          )}

          {/* Bottom Player Scrub Bar & Controls */}
          <div className="pt-2 space-y-2">
            {/* Scrubber Progress Bar */}
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                const targetSec = pos * totalDuration;

                // Find scene matching targetSec
                let accumulated = 0;
                for (let i = 0; i < SCENES.length; i++) {
                  if (targetSec <= accumulated + SCENES[i].durationSec || i === SCENES.length - 1) {
                    goToScene(i);
                    break;
                  }
                  accumulated += SCENES[i].durationSec;
                }
              }}
              className="h-2 w-full bg-white/20 rounded-full cursor-pointer relative overflow-hidden backdrop-blur-sm group/bar"
            >
              <div
                className={`h-full transition-all duration-100 ${
                  playerMode === 'youtube'
                    ? 'bg-red-600 shadow-md shadow-red-600/50'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                }`}
                style={{ width: `${(totalElapsed / totalDuration) * 100}%` }}
              />
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between text-white text-xs">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleTogglePlay}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-emerald-400 transition"
                  title={isPlaying ? 'Pausar' : 'Reproducir'}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                </button>

                <button
                  onClick={() => goToScene(currentSceneIndex - 1)}
                  disabled={currentSceneIndex === 0}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 disabled:opacity-30 transition"
                  title="Escena anterior"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={() => goToScene(currentSceneIndex + 1)}
                  disabled={currentSceneIndex === SCENES.length - 1}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 disabled:opacity-30 transition"
                  title="Siguiente escena"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <button
                  onClick={handleToggleMute}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 transition"
                  title={isMuted ? 'Activar sonido' : 'Silenciar'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <span className="font-mono text-[11px] text-slate-300">
                  {formatTime(totalElapsed)} / {formatTime(totalDuration)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSubtitles(!showSubtitles)}
                  className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition border ${
                    showSubtitles
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-black/40 text-slate-400 border-white/10'
                  }`}
                  title="Subtítulos (CC)"
                >
                  CC
                </button>

                <button
                  onClick={handleToggleFullscreen}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 transition"
                  title="Pantalla completa"
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* YouTube Watch Interface (Active in YouTube Mode) */}
      {playerMode === 'youtube' && (
        <div className="space-y-4 pt-1 animate-fade-in">
          {/* YouTube Video Title */}
          <h1 className="text-lg sm:text-2xl font-black text-white leading-snug tracking-tight">
            Diagnóstico y Mejora de Procesos Administrativos con Herramientas Digitales en MiPymes del Meta | SENA - SENNOVA
          </h1>

          {/* YouTube Channel Bar & Actions Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
            {/* Channel Info & Subscribe */}
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-full bg-emerald-600 flex items-center justify-center text-white font-black text-xs shadow-md border-2 border-white/20 shrink-0">
                SENA
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-sm text-white hover:text-emerald-400 transition cursor-pointer">
                    SENA Comunica • Regional Meta
                  </span>
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[9px] font-black" title="Canal Verificado">
                    ✓
                  </span>
                </div>
                <span className="text-xs text-slate-400 block">
                  128 K suscriptores
                </span>
              </div>

              <button
                onClick={() => setIsSubscribed(!isSubscribed)}
                className={`ml-2 px-4 py-2 rounded-full font-bold text-xs transition flex items-center space-x-1.5 ${
                  isSubscribed
                    ? 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700'
                    : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30'
                }`}
              >
                {isSubscribed ? (
                  <>
                    <Bell className="w-3.5 h-3.5 text-amber-400 fill-current" />
                    <span>Suscrito</span>
                  </>
                ) : (
                  <span>Suscribirse</span>
                )}
              </button>
            </div>

            {/* Action Buttons: Like, Dislike, Share, Download, Copy Package */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center rounded-full bg-slate-900 border border-slate-800 p-0.5">
                <button
                  onClick={handleLikeToggle}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-l-full text-xs font-bold transition hover:bg-slate-800 ${
                    hasLiked ? 'text-red-400' : 'text-slate-300'
                  }`}
                  title="Me gusta"
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
                  <span>{likeCount.toLocaleString()}</span>
                </button>
                <div className="w-[1px] h-4 bg-slate-800" />
                <button
                  className="px-3 py-1.5 rounded-r-full text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  title="No me gusta"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => setIsQrModalOpen(true)}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold transition"
                title="Compartir o escanear QR"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Compartir</span>
              </button>

              <button
                onClick={handleDownloadVideo}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold transition"
                title="Descargar Ficha y Master"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar</span>
              </button>

              <button
                onClick={handleCopyYouTubePackage}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 text-xs font-bold transition"
                title="Copiar texto con marcas de tiempo para YouTube Studio"
              >
                {copiedYouTube ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedYouTube ? '¡Copiado!' : 'Ficha YouTube'}</span>
              </button>
            </div>
          </div>

          {/* YouTube Expandable Description Card */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-5 space-y-3.5 text-xs text-slate-300">
            {/* Views and metadata tags */}
            <div className="flex flex-wrap items-center gap-2 font-semibold text-slate-400">
              <span className="text-white font-bold">14,290 vistas</span>
              <span>•</span>
              <span>Estrenado el 29 sept 2026</span>
              <span>•</span>
              <span className="text-sky-400 font-mono">#SENAMeta</span>
              <span className="text-sky-400 font-mono">#SENNOVA</span>
              <span className="text-sky-400 font-mono">#MiPymes</span>
            </div>

            {/* Synopsis */}
            <p className="leading-relaxed">
              En el departamento del Meta, más de veinticinco mil micro y pequeñas empresas impulsan el desarrollo regional. Sin embargo, más del 55% gestiona su información en papel y procesos manuales. Desde el <strong>Centro de Industria y Servicios (SENA Regional Meta)</strong>, los aprendices del <strong>Tecnólogo en Gestión Administrativa</strong> intervinieron cuatro microempresas para diagnosticar sus falencias críticas y formular propuestas de mejora mediante herramientas tecnológicas accesibles.
            </p>

            {/* Interactive Chapters List (YouTube Timestamps) */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider text-white text-[11px] flex items-center gap-1.5 font-mono">
                  <Clock className="w-3.5 h-3.5 text-red-500" />
                  <span>Capítulos de YouTube (Haz clic en cualquier marca de tiempo para saltar):</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  10 Escenas Documentadas
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {SCENES.map((scene, idx) => (
                  <button
                    key={scene.id}
                    onClick={() => {
                      goToScene(idx);
                      if (!isPlaying) {
                        setIsPlaying(true);
                        SpeechService.speak(
                          scene.audioVoiceover,
                          () => {},
                          () => {}
                        );
                      }
                    }}
                    className={`flex items-start space-x-2.5 p-2 rounded-xl text-left transition border ${
                      idx === currentSceneIndex
                        ? 'bg-red-500/15 border-red-500/40 text-white'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <span className="px-2 py-0.5 rounded bg-red-600/30 text-red-300 font-mono font-bold text-[11px] shrink-0 border border-red-500/30">
                      {scene.timecode.split(' - ')[0]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold block text-[11px] truncate">
                        Escena {scene.id}: {scene.shotName}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {scene.audioVoiceover.substring(0, 50)}...
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Institutional Information */}
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
              <p>🏛️ <strong>Servicio Nacional de Aprendizaje (SENA)</strong> — Regional Meta</p>
              <p>📍 Centro de Industria y Servicios (Villavicencio, Colombia) • Tecnólogo en Gestión Administrativa</p>
              <p>🔬 Sistema de Investigación, Desarrollo Tecnológico e Innovación (SENNOVA 2026)</p>
            </div>
          </div>

          {/* YouTube Comments Simulation */}
          <div className="space-y-4 pt-3">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-base text-white">
                Comentarios ({commentsList.length})
              </span>
              <span className="text-xs text-slate-400">
                Comunidad Académica y Empresarial del Meta
              </span>
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="flex gap-3 items-start">
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                TÚ
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Añade un comentario sobre la investigación o el video..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
                />
                {newComment.trim() && (
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setNewComment('')}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/30"
                    >
                      Comentar
                    </button>
                  </div>
                )}
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3 pt-1">
              {commentsList.map((c) => (
                <div key={c.id} className="flex gap-3 text-xs bg-slate-900/50 p-3 rounded-xl border border-slate-800/60">
                  <div className="w-8 h-8 rounded-full bg-emerald-700/60 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-200 shrink-0">
                    {c.author.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-[12px]">{c.author}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-emerald-400 font-mono">
                        {c.role}
                      </span>
                      <span className="text-[10px] text-slate-500">{c.time}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">{c.text}</p>
                    <div className="flex items-center space-x-3 text-[10px] text-slate-400 pt-1">
                      <button className="flex items-center space-x-1 hover:text-white">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{c.likes}</span>
                      </button>
                      <button className="hover:text-white">
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                      <span className="text-emerald-400 font-semibold cursor-pointer">Responder</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Scene Thumbnail Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Línea de Tiempo de Escenas (Haz clic para saltar a cualquier escena):</span>
          </span>
          <span className="font-mono text-emerald-400 font-semibold">
            Escena {currentScene.id} de {SCENES.length}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
          {SCENES.map((scene, idx) => {
            const isActive = idx === currentSceneIndex;
            return (
              <button
                key={scene.id}
                onClick={() => goToScene(idx)}
                className={`p-2 rounded-xl text-left border transition flex flex-col justify-between h-24 overflow-hidden relative ${
                  isActive
                    ? 'bg-slate-800 border-emerald-500 ring-2 ring-emerald-500/30'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                    #{scene.id}
                  </span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-slate-950 font-mono text-slate-400">
                    {scene.durationSec}s
                  </span>
                </div>

                <div className="space-y-0.5 my-auto">
                  <span className="text-[11px] font-bold text-white block line-clamp-1">
                    {scene.shotType}
                  </span>
                  <span className="text-[9px] text-slate-400 block line-clamp-2 leading-tight">
                    {scene.shotName}
                  </span>
                </div>

                {isActive && (
                  <div className="w-full h-1 bg-emerald-500 rounded-full mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive QR Code Modal */}
      <QRCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />
    </div>
  );
};
