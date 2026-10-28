import { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import {
  formatearDinero,
  historialTarifas,
  obtenerAnioTarifa,
  resumenAumentos,
} from '../utils/tarifas';

// [1,2,3,5,6] → "T1–T3, T5–T6"
const rangos = (nums) => {
  if (!nums.length) return '—';
  const partes = [];
  let ini = nums[0];
  let prev = nums[0];
  for (let i = 1; i <= nums.length; i++) {
    const n = nums[i];
    if (n !== prev + 1) {
      partes.push(ini === prev ? `T${ini}` : `T${ini}–T${prev}`);
      ini = n;
    }
    prev = n;
  }
  return partes.join(', ');
};

const signo = (n) => (n > 0 ? '+' : n < 0 ? '−' : '');

export default function EvolucionTarifas({ historial = [] }) {
  const filas = useMemo(() => historialTarifas(), []);
  const resumen = useMemo(() => resumenAumentos(), []);
  const maximo = Math.max(...filas.map((f) => f.costoCredito));

  // Trimestres tuyos que cayeron en cada ciclo de tarifa (T1 = el primero del historial)
  const trimestresPorAnio = useMemo(() => {
    const mapa = {};
    historial.forEach((t, i) => {
      const anio = obtenerAnioTarifa(t.periodo, t.anio);
      (mapa[anio] = mapa[anio] || []).push(i + 1);
    });
    return mapa;
  }, [historial]);

  return (
    <section className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 shadow-xl shadow-black/20 rounded-3xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <TrendingUp className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Evolución del valor del crédito</h2>
          <p className="text-xs text-slate-500">
            Desde {resumen.desde}, cuando empezaste, hasta la tarifa actual.
          </p>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-4">
          <p className="text-xs text-slate-500">Valor actual por crédito</p>
          <p className="text-2xl font-extrabold text-cyan-400 tabular-nums mt-1">
            {formatearDinero(resumen.valorActual)}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Al inicio: {formatearDinero(resumen.valorInicial)}</p>
        </div>
        <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4">
          <p className="text-xs text-slate-500">Aumento acumulado</p>
          <p className="text-2xl font-extrabold text-amber-300 tabular-nums mt-1">
            +{formatearDinero(resumen.aumento)}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">+{resumen.aumentoPct.toFixed(1)}% por crédito</p>
        </div>
        <div className="rounded-2xl border border-slate-800/70 bg-slate-950/40 p-4">
          <p className="text-xs text-slate-500">Aumento promedio anual</p>
          <p className="text-2xl font-extrabold text-slate-100 tabular-nums mt-1">
            ≈ {resumen.promedioAnualPct.toFixed(1)}%
          </p>
          <p className="text-xs text-slate-500 mt-0.5">{resumen.hasta - resumen.desde} ajustes en total</p>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800/70">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="bg-slate-950/70 text-slate-500 text-xs uppercase tracking-widest">
              <th className="text-left px-4 py-3 font-semibold">Ciclo de tarifa</th>
              <th className="text-left px-4 py-3 font-semibold">Tus trimestres</th>
              <th className="text-left px-4 py-3 font-semibold">Crédito</th>
              <th className="text-right px-4 py-3 font-semibold">Variación</th>
              <th className="text-right px-4 py-3 font-semibold">Carnet</th>
              <th className="text-right px-4 py-3 font-semibold">Laboratorio</th>
              <th className="text-right px-4 py-3 font-semibold">10 créditos + carnet</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filas.map((f) => (
              <tr key={f.anio} className={f.esActual ? 'bg-cyan-950/20' : 'hover:bg-slate-800/20'}>
                <td className="px-4 py-3.5">
                  <span className="font-semibold text-slate-200">{f.ciclo}</span>
                  {f.esActual && (
                    <span className="ml-2 text-[10px] font-bold uppercase tracking-wide text-cyan-300 border border-cyan-500/30 bg-cyan-500/10 rounded px-1.5 py-0.5">
                      Actual
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-slate-400 text-xs">{rangos(trimestresPorAnio[f.anio] ?? [])}</td>
                <td className="px-4 py-3.5 min-w-[150px]">
                  <p className="font-bold text-slate-100 tabular-nums">{formatearDinero(f.costoCredito)}</p>
                  <div className="h-1 rounded-full bg-slate-800 mt-1.5 overflow-hidden">
                    <div
                      className={`h-1 rounded-full ${f.esActual ? 'bg-cyan-400' : 'bg-slate-500'}`}
                      style={{ width: `${(f.costoCredito / maximo) * 100}%` }}
                    />
                  </div>
                </td>
                <td className="px-4 py-3.5 text-right tabular-nums">
                  {f.variacion === null ? (
                    <span className="text-slate-600">—</span>
                  ) : (
                    <>
                      <p className="text-amber-300 font-semibold">
                        {signo(f.variacion)}{formatearDinero(Math.abs(f.variacion))}
                      </p>
                      <p className="text-xs text-slate-500">
                        {signo(f.variacionPct)}{Math.abs(f.variacionPct).toFixed(1)}%
                      </p>
                    </>
                  )}
                </td>
                <td className="px-4 py-3.5 text-right text-slate-300 tabular-nums">{formatearDinero(f.carnet)}</td>
                <td className="px-4 py-3.5 text-right tabular-nums">
                  {f.costoLab > 0 ? (
                    <span className="text-slate-300">{formatearDinero(f.costoLab)}</span>
                  ) : (
                    <span className="text-slate-600">—</span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-right font-semibold text-slate-200 tabular-nums">
                  {formatearDinero(f.trimestreDiezCreditos)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-500 mt-4 leading-relaxed">
        Las tarifas nuevas rigen desde el trimestre de Mayo–Julio de cada año; Febrero–Abril todavía usa la del año anterior.
        Desde Mayo 2026 cada laboratorio lleva un cargo aparte además de su crédito. La columna de 10 créditos no incluye ese cargo.
      </p>
    </section>
  );
}
