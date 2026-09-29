import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Download, 
  Copy, 
  Check, 
  X, 
  ExternalLink, 
  Smartphone, 
  MessageCircle,
  Camera,
  AlertTriangle,
  Info,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { PROJECT_INFO } from '../data/scriptData';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose }) => {
  const DEV_URL = 'https://ais-dev-unondlu4onjsfpc3sicelv-456730629844.us-east5.run.app';
  const PUBLIC_URL = 'https://ais-pre-unondlu4onjsfpc3sicelv-456730629844.us-east5.run.app';

  const [selectedUrlType, setSelectedUrlType] = useState<'dev' | 'public'>('dev');
  const [copied, setCopied] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState<'android' | 'iphone'>('android');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const activeUrl = selectedUrlType === 'dev' ? DEV_URL : PUBLIC_URL;

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (canvas) {
      QRCode.toCanvas(
        canvas,
        activeUrl,
        {
          width: 260,
          margin: 3,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'M',
        },
        (error) => {
          if (error) console.error('Error generating QR code:', error);
        }
      );
    }
  }, [isOpen, activeUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `QR_Video_SENA_Meta_${selectedUrlType}.png`;
    a.click();
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(
      `🎬 Mira el Video Promocional del Proyecto SENA Meta:\n"Diagnóstico y mejora de procesos en MiPymes"\n👉 ${activeUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          title="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 pr-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <QrCode className="w-3.5 h-3.5" />
            <span>Código QR Oficial del Video</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Acceso al Video en tu Celular y Computador
          </h3>
        </div>

        {/* Alert box solving the "Error: Page not found" */}
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-3.5 space-y-2">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>¿Te apareció «Error: Page not found»? Aquí está la solución:</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Ese mensaje ocurre porque Google aún no ha publicado el enlace público. Para resolverlo ahora mismo, usa la opción <strong>Enlace Directo Activo</strong> o haz clic en <strong>«Share / Compartir»</strong> arriba en AI Studio.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => setSelectedUrlType('dev')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                selectedUrlType === 'dev'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>1. Enlace Directo (Activo Ahora)</span>
            </button>
            <button
              onClick={() => setSelectedUrlType('public')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                selectedUrlType === 'public'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>2. Enlace Público General</span>
            </button>
          </div>
        </div>

        {/* QR Display Card */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-950 border border-slate-800">
          {/* High-Contrast Canvas */}
          <div className="p-3 bg-white rounded-2xl shadow-2xl border-4 border-emerald-500/50 shrink-0">
            <canvas ref={canvasRef} className="rounded" />
          </div>

          {/* Quick Details & Sharing */}
          <div className="space-y-3 flex-1 text-center sm:text-left">
            <div>
              <span className="text-xs font-bold text-white block">
                {PROJECT_INFO.shortTitle}
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold block">
                SENA Regional Meta • Tecnólogo en Gestión Administrativa
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                {selectedUrlType === 'dev' ? 'Modo Directo (Con cuenta Google)' : 'Modo Público (Requiere Publicar)'}
              </span>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={handleWhatsAppShare}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enviar Enlace por WhatsApp a mi Celular</span>
              </button>

              <button
                onClick={handleDownloadPNG}
                className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Descargar Imagen PNG del QR</span>
              </button>
            </div>
          </div>
        </div>

        {/* Instructions: What app to use on the phone? */}
        <div className="rounded-2xl bg-slate-950/70 border border-slate-800/80 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-white">
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Instrucciones para tu Celular:</span>
            </div>

            <div className="flex rounded-lg bg-slate-900 p-0.5 border border-slate-800 text-[11px]">
              <button
                onClick={() => setActiveGuideTab('android')}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  activeGuideTab === 'android'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Android
              </button>
              <button
                onClick={() => setActiveGuideTab('iphone')}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  activeGuideTab === 'iphone'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                iPhone / iPad
              </button>
            </div>
          </div>

          {activeGuideTab === 'android' ? (
            <div className="text-xs text-slate-300 space-y-1.5 text-[11px]">
              <ol className="space-y-1 pl-4 list-decimal text-slate-300">
                <li>Abre la app <strong>«Cámara»</strong> o el icono de la camarita de <strong>Google Lens</strong>.</li>
                <li>Apunta al código QR en tu pantalla.</li>
                <li>Toca el enlace que aparece y ábrelo con Google Chrome (inicia sesión con tu correo si te lo solicita).</li>
              </ol>
            </div>
          ) : (
            <div className="text-xs text-slate-300 space-y-1.5 text-[11px]">
              <ol className="space-y-1 pl-4 list-decimal text-slate-300">
                <li>Abre la app nativa de <strong>«Cámara»</strong> en tu iPhone.</li>
                <li>Apunta hacia el código QR.</li>
                <li>Toca el aviso amarillo de <strong>Safari</strong> en la parte superior.</li>
              </ol>
            </div>
          )}
        </div>

        {/* Direct Link Input */}
        <div className="space-y-1 pt-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Enlace Directo para copiar o abrir en el navegador:
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={activeUrl}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 select-all focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center space-x-1.5 transition border border-slate-700 shrink-0"
              title="Copiar enlace"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
            </button>
            <a
              href={activeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition border border-slate-700 shrink-0"
              title="Abrir enlace en pestaña nueva"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
