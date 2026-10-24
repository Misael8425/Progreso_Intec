import React, { useId } from 'react';
import { Hourglass } from 'lucide-react';

// Gráfica circular: trimestres transcurridos vs. el máximo permitido para terminar la carrera
const PermanenciaChart = ({ transcurridos, total, proximos = [], creditosPendientes = 0 }) => {
  const gradId = useId();
  const restantes = Math.max(total - transcurridos, 0);
  const progreso = Math.min(transcurridos / total, 1);

  const radio = 54;
  const circunferencia = 2 * Math.PI * radio;
  const llenado = circunferencia * progreso;
  const promedio = restantes > 0 ? (creditosPendientes / restantes).toFixed(1) : null;

  return (
    <section className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 shadow-xl shadow-black/20 rounded-3xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-800/60 pb-4">
        <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
          <Hourglass className="w-5 h-5 text-cyan-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-100">Trimestres de Permanencia</h2>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-8">
        {/* Dona */}
        <div className="relative w-40 h-40 shrink-0">
          <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90" role="img"
               aria-label={`${transcurridos} trimestres transcurridos de ${total}`}>
            <defs>
              <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
            <circle cx="70" cy="70" r={radio} fill="none" stroke="#1e293b" strokeWidth="14" />
            <circle
              cx="70" cy="70" r={radio} fill="none"
              stroke={`url(#${gradId})`} strokeWidth="14" strokeLinecap="round"
              strokeDasharray={`${llenado} ${circunferencia}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black text-white leading-none">{transcurridos}</span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-1">de {total}</span>
          </div>
        </div>

        {/* Detalle */}
        <div className="flex-1 w-full space-y-4">
          <p className="text-sm text-slate-400">
            <span className="text-slate-200 font-bold">{transcurridos} trimestres</span> transcurridos de{' '}
            <span className="text-slate-200 font-bold">{total}</span> permitidos.{' '}
            {restantes > 0 ? (
              <>Te {restantes === 1 ? 'queda' : 'quedan'} <span className="text-cyan-400 font-bold">{restantes}</span>.</>
            ) : (
              <span className="text-amber-400 font-bold">Ya usaste todos.</span>
            )}
          </p>

          {/* Línea de tiempo de los que faltan */}
          <ol className="space-y-2">
            {proximos.map((periodo, i) => (
              <li key={periodo} className="flex items-center gap-3 text-xs">
                <span className="w-9 shrink-0 text-center font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-md py-1">
                  T{transcurridos + i + 1}
                </span>
                <span className="text-slate-300 font-medium">{periodo}</span>
                {i === 0 && (
                  <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-slate-500">Próximo</span>
                )}
              </li>
            ))}
          </ol>

          {promedio && creditosPendientes > 0 && (
            <p className="text-xs text-slate-500 pt-2 border-t border-slate-800/60">
              {creditosPendientes} créditos pendientes ≈ {promedio} por trimestre si usas los {restantes} que quedan.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PermanenciaChart;
