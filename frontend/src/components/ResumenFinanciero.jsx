import React, { useMemo } from 'react';
import { Wallet, Target, DollarSign, TrendingUp } from 'lucide-react';
import { calcularCostoTrimestre, formatearDinero, obtenerTarifa, TARIFAS_INTEC } from '../utils/tarifas';

/**
 * ResumenFinanciero
 *
 * Props:
 *  - volante: object | null   → volante activo del estudiante (contiene asignaturas con créditos)
 *  - creditosPendientes: number → créditos que le faltan al estudiante para graduarse
 *  - anioActual: number        → año de la tarifa vigente (default 2026)
 */
const ResumenFinanciero = ({ volante, creditosPendientes = 0, anioActual = 2026 }) => {
  const tarifaActual = obtenerTarifa(anioActual);

  // ── Cálculo del Volante Actual ───────────────────────────────────────────────
  const creditosVolante = useMemo(() => {
    if (!volante?.asignaturas?.length) return 0;
    return volante.asignaturas.reduce((acc, asig) => {
      const creditos = asig.asignaturaPensum?.creditos ?? asig.creditos ?? 0;
      return acc + creditos;
    }, 0);
  }, [volante]);

  const costoVolante = calcularCostoTrimestre(creditosVolante, anioActual);

  // ── Proyección a Graduación ──────────────────────────────────────────────────
  // Promedio histórico por trimestre (basado en el volante activo como referencia)
  const creditosPorTrimestre = creditosVolante > 0 ? creditosVolante : 10;
  const trimestresRestantes = Math.ceil(creditosPendientes / creditosPorTrimestre);
  const costoProyectado = creditosPendientes * tarifaActual.costoCredito +
    trimestresRestantes * tarifaActual.carnet;

  return (
    <section className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 shadow-xl shadow-black/20 rounded-3xl p-6 sm:p-8 hover:border-cyan-500/20 transition-colors duration-300">

      {/* ── Encabezado ── */}
      <div className="flex items-center gap-3 mb-6 border-b border-slate-800/60 pb-4">
        <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
          <DollarSign className="w-5 h-5 text-cyan-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-100">Resumen Financiero</h2>
        <span className="ml-auto px-2 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-wider uppercase">
          {anioActual}
        </span>
      </div>

      {/* ── Grid de dos secciones ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* ── Sección Izquierda: Volante Actual ── */}
        <div className="relative overflow-hidden bg-slate-950/50 rounded-2xl p-5 border border-slate-800/60 hover:border-cyan-500/30 transition-colors group">
          {/* Decorative glow */}
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors" />

          <div className="flex items-center gap-2 mb-4">
            <div className="bg-cyan-500/10 p-1.5 rounded-lg border border-cyan-500/20">
              <Wallet className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-sm font-semibold text-slate-300 tracking-wide">Costo Trimestre Actual</p>
          </div>

          {creditosVolante === 0 ? (
            <div className="py-4">
              <p className="text-slate-500 text-sm">Sin volante activo registrado.</p>
            </div>
          ) : (
            <>
              <p className="text-cyan-400 font-bold text-2xl sm:text-3xl leading-tight mb-1 tabular-nums">
                {formatearDinero(costoVolante)}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Basado en{' '}
                <span className="text-slate-400 font-medium">{creditosVolante} créditos</span>
                {' '}a{' '}
                <span className="text-slate-400 font-medium">{formatearDinero(tarifaActual.costoCredito)}</span>
                {' '}+ {formatearDinero(tarifaActual.carnet)} de carnet
              </p>

              {/* Desglose pill */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md border border-slate-700/50">
                  {creditosVolante} crs × {formatearDinero(tarifaActual.costoCredito)} = {formatearDinero(creditosVolante * tarifaActual.costoCredito)}
                </span>
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md border border-slate-700/50">
                  Carnet: {formatearDinero(tarifaActual.carnet)}
                </span>
              </div>
            </>
          )}
        </div>

        {/* ── Sección Derecha: Proyección a Graduación ── */}
        <div className="relative overflow-hidden bg-slate-950/50 rounded-2xl p-5 border border-slate-800/60 hover:border-indigo-500/30 transition-colors group">
          {/* Decorative glow */}
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors" />

          <div className="flex items-center gap-2 mb-4">
            <div className="bg-indigo-500/10 p-1.5 rounded-lg border border-indigo-500/20">
              <Target className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-sm font-semibold text-slate-300 tracking-wide">Proyección a Graduación</p>
          </div>

          {creditosPendientes === 0 ? (
            <div className="py-4">
              <p className="text-emerald-400 text-sm font-semibold">🎓 ¡Todos los créditos completados!</p>
            </div>
          ) : (
            <>
              <p className="text-indigo-400 font-bold text-2xl sm:text-3xl leading-tight mb-1 tabular-nums">
                {formatearDinero(costoProyectado)}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Estimado para{' '}
                <span className="text-slate-400 font-medium">{creditosPendientes} créditos restantes</span>
                {' '}en ~{trimestresRestantes} trimestres
              </p>

              {/* Barra de progreso visual */}
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Tarifa vigente ({anioActual})</span>
                  <span className="text-indigo-400 font-medium">{formatearDinero(tarifaActual.costoCredito)}/cr</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>~{trimestresRestantes} trims. × {formatearDinero(tarifaActual.carnet)} carnet</span>
                  <span className="text-indigo-400 font-medium">{formatearDinero(trimestresRestantes * tarifaActual.carnet)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Footer: Nota de disclaimer ── */}
      <p className="mt-4 text-xs text-slate-600 text-center flex items-center justify-center gap-1.5">
        <TrendingUp className="w-3 h-3" />
        Proyección basada en tarifas {anioActual}. No incluye ajustes futuros por inflación.
      </p>
    </section>
  );
};

export default ResumenFinanciero;
