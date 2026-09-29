import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Camera, 
  Mic, 
  Sun, 
  Shirt, 
  AlertCircle, 
  CheckCircle, 
  Users, 
  Video,
  FileCheck
} from 'lucide-react';
import { PRODUCTION_CREW_GEAR, PROJECT_INFO } from '../data/scriptData';

export const CallSheetView: React.FC = () => {
  return (
    <div className="space-y-8 py-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
            <Calendar className="w-4 h-4" />
            <span>Ficha Técnica & Plan de Rodaje</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Plan de Producción y Guía de Rodaje en Campo
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Protocolo de logística técnica, vestuario institucional del aprendiz SENA, locaciones autorizadas en Villavicencio y cronograma por llamados.
          </p>
        </div>

        <div className="px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-4 text-xs font-mono">
          <div>
            <span className="text-slate-500 block">Jornadas Estimadas</span>
            <span className="text-emerald-400 font-bold text-sm">2 Días de Rodaje</span>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <span className="text-slate-500 block">Región</span>
            <span className="text-white font-bold text-sm">Meta (Villavicencio)</span>
          </div>
        </div>
      </div>

      {/* SENA Uniform and Image Guidelines */}
      <div className="bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 sm:p-7 space-y-4">
        <div className="flex items-center space-x-2.5 text-emerald-400 font-bold text-sm sm:text-base">
          <Shirt className="w-5 h-5" />
          <span>Normativa Estricta de Uniforme e Imagen Institucional SENA</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
          Para garantizar la credibilidad institucional y cumplir con el Manual de Identidad Visual del SENA, 
          los aprendices en cámara deben cumplir con el siguiente protocolo de imagen sin excepciones:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {PRODUCTION_CREW_GEAR.uniformGuidelines.map((rule, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start space-x-3">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-200 leading-relaxed">
                {rule}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment Package */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <Camera className="w-4 h-4 text-sky-400" />
          <span>Equipamiento Técnico Audiovisual Recomendado</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Cameras */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase text-sky-400">
              <Video className="w-4 h-4" />
              <span>Cámaras & Dron</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {PRODUCTION_CREW_GEAR.cameras.map((c, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-sky-400">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Optics */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase text-emerald-400">
              <Camera className="w-4 h-4" />
              <span>Ópticas & Lentes</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {PRODUCTION_CREW_GEAR.optics.map((o, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-400">•</span>
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Audio */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase text-amber-400">
              <Mic className="w-4 h-4" />
              <span>Sonido Directo</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {PRODUCTION_CREW_GEAR.soundGear.map((s, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-400">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Lighting */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase text-purple-400">
              <Sun className="w-4 h-4" />
              <span>Iluminación Portátil</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {PRODUCTION_CREW_GEAR.lightingPackage.map((l, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-purple-400">•</span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Suggested Locations in Meta */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-rose-400" />
          <span>Locaciones de Rodaje Recomendadas en el Meta</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRODUCTION_CREW_GEAR.recommendedLocationsInMeta.map((loc, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">{loc.name}</h4>
                <span className="text-[11px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  Locación {idx + 1}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Propósito Escénico:</strong> {loc.purpose}
              </p>
              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span><strong>Permisos / Acceso:</strong> {loc.access}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Day Shooting Schedule & Weather Contingency */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Day 1 Schedule */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-bold text-white text-sm">Día 1: Trabajo de Campo & Problema</span>
            <span className="text-xs font-mono text-emerald-400">06:00 - 16:00</span>
          </div>
          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
              <strong className="text-emerald-400">06:00 - 07:30:</strong> Tomas aéreas de dron y amanecer llanero en Villavicencio (Buenavista / Río Guatiquía).
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
              <strong className="text-emerald-400">08:00 - 12:00:</strong> Rodaje en microempresa del 7 de Agosto (Escenas 2 y 3: procesos manuales, archivo y agobio).
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
              <strong className="text-emerald-400">13:30 - 16:00:</strong> Llegada de aprendices SENA a la empresa, diagnóstico y diálogo con empresario (Escenas 4 y 5).
            </div>
          </div>
        </div>

        {/* Day 2 Schedule */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-bold text-white text-sm">Día 2: Laboratorio SENA & Cierre</span>
            <span className="text-xs font-mono text-emerald-400">07:30 - 17:30</span>
          </div>
          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
              <strong className="text-emerald-400">07:30 - 11:30:</strong> Centro de Industria y Servicios (SENA Villavicencio). Escena 6 en ambiente de cómputo y SENNOVA.
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
              <strong className="text-emerald-400">12:30 - 15:00:</strong> Grabación de testimonios sincrónicos con microfonía corbatera (Escena 7: Valentina y Don Carlos).
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
              <strong className="text-emerald-400">15:30 - 17:30:</strong> Plano grupal heroico durante el atardecer llanero y placas de crédito final (Escenas 8, 9 y 10).
            </div>
          </div>
        </div>

        {/* Climate & Risk Contingency */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase text-amber-400 pb-2 border-b border-slate-800">
            <AlertCircle className="w-4 h-4" />
            <span>Plan de Contingencia Climática (Meta)</span>
          </div>
          <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
            <p>
              <strong>Lluvia Repentina Llanera:</strong> Si se presentan aguaceros típicos de piedemonte, la producción se traslada de inmediato a los interiores del Centro SENA o despachos protegidos.
            </p>
            <p>
              <strong>Humedad y Calor:</strong> Mantener toallas de microfibra y polvo matificante hipoalergénico para evitar brillo facial excesivo en aprendices ante cámara.
            </p>
            <p>
              <strong>Hidratación Continua:</strong> Provisión de agua fría y protección solar para el equipo técnico durante tomas en exteriores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
