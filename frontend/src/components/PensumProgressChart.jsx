import React, { useMemo } from 'react';
import { BarChart3 } from 'lucide-react';

const estaAprobada = (m) =>
  m.estado === 'Aprobada' || m.calificacion === 'CO' || m.calificacion === 'EI';

// Progreso del pensum: una barra por trimestre del plan (T1–T14)
const PensumProgressChart = ({ pensum = [] }) => {
  const niveles = useMemo(() => {
    const mapa = new Map();
    for (const m of pensum) {
      const nivel = m.trimestreSugerido;
      if (!nivel || nivel < 1) continue; // fuera del plan
      if (!mapa.has(nivel)) mapa.set(nivel, { nivel, total: 0, aprobadas: 0, pendientes: [] });
      const fila = mapa.get(nivel);
      fila.total += 1;
      if (estaAprobada(m)) fila.aprobadas += 1;
      else fila.pendientes.push(m.clave);
    }
    return [...mapa.values()].sort((a, b) => a.nivel - b.nivel);
  }, [pensum]);

  const total = niveles.reduce((acc, n) => acc + n.total, 0);
  const aprobadas = niveles.reduce((acc, n) => acc + n.aprobadas, 0);
  const porcentaje = total > 0 ? Math.round((aprobadas / total) * 100) : 0;

  return (
    <section className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 shadow-xl shadow-black/20 rounded-3xl p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6 border-b border-slate-800/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-100">Progreso del Pensum</h2>
        </div>
        <span className="px-2 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
          {aprobadas}/{total} · {porcentaje}%
        </span>
      </div>

      <div className="space-y-2.5">
        {niveles.map((n) => {
          const completo = n.aprobadas === n.total;
          const pct = n.total > 0 ? (n.aprobadas / n.total) * 100 : 0;
          return (
            <div key={n.nivel}>
              <div className="flex items-center gap-3">
                <span className={`w-8 shrink-0 text-xs font-bold ${completo ? 'text-slate-400' : 'text-amber-400'}`}>
                  T{n.nivel}
                </span>
                <div className="flex-1 h-2.5 rounded-full bg-slate-800 overflow-hidden"
                     role="progressbar" aria-valuenow={n.aprobadas} aria-valuemin={0} aria-valuemax={n.total}>
                  <div
                    className={`h-full rounded-full ${completo ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right text-xs font-medium text-slate-400 tabular-nums">
                  {n.aprobadas}/{n.total}
                </span>
              </div>
              {!completo && (
                <p className="ml-11 mt-0.5 text-[10px] text-amber-400/80 tracking-wide">
                  Pendiente: {n.pendientes.join(', ')}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-5 text-[10px] text-slate-600">
        Cada barra es un trimestre del plan sugerido (materias aprobadas / total). En ámbar, los que aún tienen materias pendientes.
      </p>
    </section>
  );
};

export default PensumProgressChart;
