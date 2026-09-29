import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Workflow, 
  FileText, 
  BarChart3, 
  Users, 
  ShieldCheck, 
  Sparkles,
  Layers,
  MapPin,
  TrendingUp,
  Cpu,
  GraduationCap,
  Shirt
} from 'lucide-react';
import { PAIN_POINTS, METHODOLOGY_STEPS, PROJECT_INFO } from '../data/scriptData';

interface StepAnalysisViewProps {
  onGoToScript: () => void;
}

export const StepAnalysisView: React.FC<StepAnalysisViewProps> = ({ onGoToScript }) => {
  const [selectedPainPoint, setSelectedPainPoint] = useState(PAIN_POINTS[0].id);

  const activePain = PAIN_POINTS.find(p => p.id === selectedPainPoint) || PAIN_POINTS[0];

  return (
    <div className="space-y-10 py-6">
      {/* Executive Overview Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 p-6 sm:p-8">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fase 1: Diagnóstico y Fundamentación Audiovisual</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Análisis Paso a Paso: Realidad Productiva y Transformación SENA en el Meta
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Para que un video promocional de investigación aplicada logre credibilidad y movilice a microempresarios, 
            la narrativa audiovisual debe anclarse en <strong>datos reales, puntos de dolor específicos y soluciones técnicas tangibles</strong>. 
            A continuación se presenta el desglose estratégico que sustenta cada plano y línea de locución del guion.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-xs text-slate-400 font-medium block">Brecha Digital Meta</span>
              <span className="text-xl sm:text-2xl font-bold text-amber-400">55%</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">En gestión de información</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-xs text-slate-400 font-medium block">Tiempo en Papel</span>
              <span className="text-xl sm:text-2xl font-bold text-rose-400">15 hrs/sem</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Buscando soportes físicos</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-xs text-slate-400 font-medium block">Eficiencia Esperada</span>
              <span className="text-xl sm:text-2xl font-bold text-emerald-400">+45%</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Tras intervención SENA</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-xs text-slate-400 font-medium block">Diagnóstico en Campo</span>
              <span className="text-xl sm:text-2xl font-bold text-sky-400">4 MiPymes</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">3 falencias críticas halladas</span>
            </div>
          </div>

          {/* Diagnostic Empirical Results Strip */}
          <div className="pt-4 border-t border-slate-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-2 font-mono">
              Línea Base Cuantitativa (Investigación SENA en 4 Microempresas del Meta):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-rose-500/30">
                <span className="text-rose-400 font-mono font-bold text-base block">90%</span>
                <span className="font-semibold text-slate-200 block text-[11px]">Adolecen de Planeación</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Procesos reactivos sin fijación de metas</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-rose-500/40">
                <span className="text-rose-400 font-mono font-bold text-base block">100%</span>
                <span className="font-semibold text-slate-200 block text-[11px]">Sin Gestión por Procesos</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Sin manuales ni flujos estandarizados</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-amber-500/30">
                <span className="text-amber-400 font-mono font-bold text-base block">60%</span>
                <span className="font-semibold text-slate-200 block text-[11px]">Sin Estructura ni Funciones</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Sin organigrama ni roles formales</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-emerald-500/30">
                <span className="text-emerald-400 font-mono font-bold text-base block">50%</span>
                <span className="font-semibold text-slate-200 block text-[11px]">Con Recursos Tecnológicos</span>
                <span className="text-[10px] text-emerald-300 block mt-0.5">Hardware y conectividad subutilizados</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STEP 1: PAIN POINTS MATRIX */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              Identificación de Puntos de Dolor Clave en las MiPymes del Meta
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              El diagnóstico situacional que fundamenta el Acto I (Introducción: El Problema).
            </p>
          </div>
        </div>

        {/* Interactive Pain Point Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-2.5">
            {PAIN_POINTS.map((pain) => {
              const isSelected = pain.id === selectedPainPoint;
              return (
                <button
                  key={pain.id}
                  onClick={() => setSelectedPainPoint(pain.id)}
                  className={`w-full text-left p-4 rounded-xl transition border ${
                    isSelected
                      ? 'bg-slate-800 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/20'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/40 text-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                      {pain.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      {isSelected ? 'Explorando' : 'Clic para ver'}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white mt-1">
                    {pain.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                    {pain.problem}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Detailed Card for Selected Pain Point */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  Cuello de Botella Crítico
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  Impacto Directo en Productividad
                </span>
              </div>

              <div>
                <h4 className="text-lg sm:text-xl font-bold text-white">
                  {activePain.title}
                </h4>
                <p className="text-xs font-mono text-amber-400 mt-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Dato empírico: {activePain.statOrFact}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block mb-1">
                    Problema Observable
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {activePain.problem}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
                    Consecuencia para la MiPyme
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {activePain.impactMiPyme}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Intervención del Tecnólogo SENA
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200">
                      {activePain.solutionSENA}
                    </p>
                    <div className="pt-2 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold text-slate-400">Herramientas Digitales:</span>
                      <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-800 text-emerald-300 border border-emerald-500/30">
                        {activePain.digitalTool}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80 text-xs text-slate-400 italic">
              * Este punto de dolor se traduce en el guion en las tomas de detalle de cuadernos rayados, facturas apiladas y la locución del segundo 00:12 al 00:36.
            </div>
          </div>
        </div>
      </div>

      {/* STEP 2: METHODOLOGY & OFFICES (DESARROLLO) */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              Estructura del Desarrollo: Metodología de Investigación y Oficinas
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Cómo los aprendices de Gestión Administrativa ejecutan la investigación aplicada en las empresas y en los laboratorios SENA.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {METHODOLOGY_STEPS.map((step) => (
            <div 
              key={step.step}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/20">
                    Paso {step.step}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">
                    Investigación
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white leading-snug">
                  {step.title}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {step.description}
                </p>

                <div className="pt-2 border-t border-slate-800/60 space-y-1.5">
                  <span className="text-[11px] font-semibold text-emerald-400 block">
                    Rol del Aprendiz SENA:
                  </span>
                  <p className="text-xs text-slate-400">
                    {step.senaRole}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800 space-y-2">
                <div>
                  <span className="text-[11px] font-medium text-slate-400 block">Entregable:</span>
                  <span className="text-xs font-semibold text-white">{step.deliverable}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {step.tools.map((t, idx) => (
                    <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 3: VISUAL DIRECTION FOR SENA UNIFORMS & TONE */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
            3
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              Criterios Audiovisuales: Puesta en Escena con Aprendices en Uniforme SENA
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Directrices de vestuario, iluminación y tono técnico-profesional sin estereotipos.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm">
              <Shirt className="w-4 h-4" />
              <span>Uniforme Reglamentario SENA</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Camiseta Polo Oficial:</strong> Blanca, cuello cerrado, con el escudo del SENA bordado en verde sobre el pectoral izquierdo.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Carnet Institucional Visible:</strong> Colgado al cuello con cinta verde oficial SENA, mirando al frente durante tomas frontales.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Accesorios Técnicos:</strong> Portan tablets con interfaz de gestión abierta y libretas institucionales; transmite proactividad.</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center space-x-2 text-sky-400 font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Tono Profesional y Técnico</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-sky-400 font-bold">•</span>
                <span><strong>Lenguaje Preciso:</strong> Se emplean términos como <em>"BPMN", "madurez digital", "trazabilidad documental"</em> y <em>"dashboards"</em> sin sobrecargar al espectador.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-400 font-bold">•</span>
                <span><strong>Actitud de Liderazgo:</strong> Los aprendices conversan de igual a igual con el microempresario, escuchando con empatía y proponiendo con seguridad.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-400 font-bold">•</span>
                <span><strong>Sin Falsos Triunfalismos:</strong> Se muestra el proceso de trabajo real, la consulta con instructores en sala de cómputo y el ensayo previo.</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center space-x-2 text-amber-400 font-semibold text-sm">
              <MapPin className="w-4 h-4" />
              <span>Identidad Visual Llanera</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Luz Natural del Llano:</strong> Planos iniciales y finales aprovechando la luz dorada matutina (6:30 AM) y el atardecer (5:30 PM).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Locaciones Auténticas:</strong> Empresas reales del Meta (ferreterías, talleres, procesadoras agroindustriales, comercio barrial) y Centro SENA.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Banda Sonora Moderna:</strong> Arpa y cuatro llanero con tratamiento sonoro cinemático, evitando clichés festivos y dando aire de innovación.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA TO TECHNICAL SCRIPT */}
      <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Consenso Audiovisual Establecido
          </span>
          <h4 className="text-xl font-bold text-white">
            Pasa al Guion Técnico Maestro a Dos Columnas (Video / Audio)
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Explora las 10 escenas cinematográficas con minutaje preciso, movimientos de cámara, indicaciones de vestuario SENA y reproducción por voz en off.
          </p>
        </div>

        <button
          onClick={onGoToScript}
          className="shrink-0 flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition group"
        >
          <span>Ver Guion Técnico Master</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
