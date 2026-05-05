import React, { useEffect, useState, useMemo } from 'react';
import { obtenerPensum, obtenerHistorialTrimestres, obtenerVolanteActivo } from '../services/api';
import { Loader2, Wallet, Target, DollarSign, TrendingUp, Receipt, BadgeDollarSign, CircleCheck, CircleDashed, ChevronDown } from 'lucide-react';
import { TARIFAS_INTEC, calcularCostoMateria, calcularCostoTrimestre, formatearDinero, obtenerTarifa, obtenerTarifaPorPeriodo } from '../utils/tarifas';

// ────────────────────────────────────────────────────────────────────────────────
// Helper: extrae el año de un string de período.
// "Agosto - Octubre 2022"        → 2022
// "Noviembre 2022 - Enero 2023"  → 2022  (año de inicio)
// "Mayo - Julio 2026"            → 2026
// ────────────────────────────────────────────────────────────────────────────────
const extraerAnio = (periodo = '') => {
  const matches = periodo.match(/\d{4}/g);
  if (!matches || matches.length === 0) return new Date().getFullYear();
  return parseInt(matches[0], 10); // usa el primer año encontrado
};

// ────────────────────────────────────────────────────────────────────────────────
// Sub-componente: Tarjeta de métrica superior
// ────────────────────────────────────────────────────────────────────────────────
const MetricCard = ({ icon: Icon, iconColor, bgColor, borderColor, label, value, sub }) => (
  <div className={`relative overflow-hidden bg-slate-950/50 rounded-2xl p-5 border ${borderColor} hover:border-opacity-60 transition-all duration-300 group`}>
    <div className={`absolute -top-8 -right-8 w-24 h-24 ${bgColor} rounded-full blur-2xl group-hover:opacity-75 transition-opacity`} />
    <div className="flex items-center gap-2 mb-4">
      <div className={`${bgColor.replace('bg-', 'bg-').replace('/5', '/10')} p-1.5 rounded-lg border ${borderColor}`}>
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <p className="text-sm font-semibold text-slate-300 tracking-wide">{label}</p>
    </div>
    <p className={`font-bold text-2xl sm:text-3xl leading-tight mb-1 tabular-nums ${iconColor}`}>{value}</p>
    {sub && <p className="text-xs text-slate-500 leading-relaxed">{sub}</p>}
  </div>
);

// ────────────────────────────────────────────────────────────────────────────────
// Componente principal
// ────────────────────────────────────────────────────────────────────────────────
const Finanzas = () => {
  const [pensum,   setPensum]   = useState([]);
  const [historial, setHistorial] = useState([]);
  const [_volante, setVolante]  = useState(null); // raw volante (horarios)
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  // ── Expansión de filas ──────────────────────────────────────────────────────
  const [trimestreExpandido, setTrimestreExpandido] = useState(null);
  const toggleExpandir = (id) => {
    setTrimestreExpandido(prev => prev === id ? null : id);
  };

  const anioActual = new Date().getFullYear();
  const tarifaActual = obtenerTarifa(anioActual);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [resPensum, resHistorial, resVolante] = await Promise.all([
          obtenerPensum(),
          obtenerHistorialTrimestres(),
          obtenerVolanteActivo(),
        ]);
        setPensum(Array.isArray(resPensum) ? resPensum : resPensum.value || []);
        setHistorial(Array.isArray(resHistorial) ? resHistorial : resHistorial.value || []);
        setVolante(resVolante);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── Créditos del trimestre activo (T16: Mayo-Julio 2026) ────────────────────
  // El volante del backend solo tiene horarios, no créditos.
  // Los créditos reales están en el trimestre con estado ACTIVO del historial.
  const trimestreActivo = useMemo(
    () => historial.find(t => t.estado === 'ACTIVO') || null,
    [historial]
  );

  const creditosActivos = useMemo(() => {
    if (!trimestreActivo?.asignaturas?.length) return 0;
    return trimestreActivo.asignaturas.reduce(
      (acc, asig) => acc + (asig.asignaturaPensum?.creditos ?? asig.creditos ?? 0),
      0
    );
  }, [trimestreActivo]);

  // ── Créditos aprobados y pendientes ────────────────────────────────────────
  const TOTAL_CREDITOS = 279;
  const materiasAprobadasLista = pensum.filter(
    m => m.estado === 'Aprobada' || m.calificacion === 'CO' || m.calificacion === 'EI'
  );
  const creditosAprobados = materiasAprobadasLista.reduce((acc, m) => acc + m.creditos, 0);
  const creditosPendientes = TOTAL_CREDITOS - creditosAprobados;

  // ── Costo del trimestre actual ──────────────────────────────────────────────
  const costoActual = calcularCostoTrimestre(creditosActivos, anioActual);

  // ── Proyección a graduación ─────────────────────────────────────────────────────
  // Siempre usa TARIFAS_INTEC[2026] para mantener la proyección anclada a la tarifa vigente.
  const tarifaProyeccion    = TARIFAS_INTEC[2026];
  const creditosPorTrimestre = creditosActivos > 0 ? creditosActivos : 10;
  const trimestresRestantes  = Math.ceil(creditosPendientes / creditosPorTrimestre);
  const costoProyectado =
    creditosPendientes * tarifaProyeccion.costoCredito +
    trimestresRestantes * tarifaProyeccion.carnet;

  // ── Desglose histórico ──────────────────────────────────────────────────────
  // Usa obtenerTarifaPorPeriodo para aplicar correctamente la regla del INTEC:
  // las nuevas tarifas entran en Mayo, así que Febrero-Abril usa el año anterior.
  const trimestresHistoricos = useMemo(() => {
    return historial
      .filter(t => t.estado === 'CERRADO')
      .map(t => {
        const tarifa  = obtenerTarifaPorPeriodo(t.periodo);
        const creditos = t.creditosAprobados ?? 0;
        const costo   = creditos * tarifa.costoCredito + tarifa.carnet;
        return { ...t, creditos, costo };
      });
  }, [historial]);

  const totalInvertido = useMemo(
    () => trimestresHistoricos.reduce((sum, t) => sum + t.costo, 0),
    [trimestresHistoricos]
  );

  // ── Loading / Error ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-cyan-500 rounded-full animate-spin" />
        </div>
        <p className="text-slate-400 font-medium text-lg animate-pulse tracking-wide">
          Calculando tu presupuesto...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-rose-400 text-center p-8 bg-rose-950/20 rounded-3xl border border-rose-900/50">
        <p className="font-bold">Error cargando Finanzas</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto">

      {/* ── Encabezado ─────────────────────────────────────────────────────── */}
      <header>
        <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 mb-2">
          Mis Finanzas
        </h1>
        <p className="text-slate-400 text-lg">
          Inversión académica acumulada y proyección hasta la graduación.
        </p>
      </header>

      {/* ── Tarjetas de métricas superiores ────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Costo trimestre actual */}
        <div className="relative overflow-hidden bg-slate-900/40 backdrop-blur-md border border-slate-800/60 shadow-xl shadow-black/20 hover:border-cyan-500/30 transition-colors duration-300 rounded-3xl p-6 group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-colors" />
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
              <Wallet className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-300 tracking-wide">Costo Trimestre Actual</h3>
          </div>
          {creditosActivos === 0 ? (
            <p className="text-slate-500 text-sm py-2">Sin trimestre activo con créditos.</p>
          ) : (
            <>
              <p className="text-cyan-400 font-bold text-2xl sm:text-3xl tabular-nums mb-1">
                {formatearDinero(costoActual)}
              </p>
              <p className="text-xs text-slate-500">
                {trimestreActivo?.periodo} ·{' '}
                <span className="text-slate-400 font-medium">{creditosActivos} créditos</span>
                {' '}a {formatearDinero(tarifaActual.costoCredito)} + {formatearDinero(tarifaActual.carnet)} carnet
              </p>
              {/* Desglose pills */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md border border-slate-700/50">
                  {creditosActivos} cr × {formatearDinero(tarifaActual.costoCredito)}
                </span>
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md border border-slate-700/50">
                  Carnet: {formatearDinero(tarifaActual.carnet)}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Total invertido hasta hoy */}
        <div className="relative overflow-hidden bg-slate-900/40 backdrop-blur-md border border-slate-800/60 shadow-xl shadow-black/20 hover:border-emerald-500/30 transition-colors duration-300 rounded-3xl p-6 group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
              <BadgeDollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-300 tracking-wide">Total Invertido</h3>
          </div>
          <p className="text-emerald-400 font-bold text-2xl sm:text-3xl tabular-nums mb-1">
            {formatearDinero(totalInvertido)}
          </p>
          <p className="text-xs text-slate-500">
            En {trimestresHistoricos.length} trimestres cerrados
          </p>
        </div>

        {/* Proyección a graduación */}
        <div className="relative overflow-hidden bg-slate-900/40 backdrop-blur-md border border-slate-800/60 shadow-xl shadow-black/20 hover:border-indigo-500/30 transition-colors duration-300 rounded-3xl p-6 group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors" />
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-indigo-500/10 p-2 rounded-lg border border-indigo-500/20">
              <Target className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-300 tracking-wide">Proyección Graduación</h3>
          </div>
          {creditosPendientes <= 0 ? (
            <p className="text-emerald-400 text-sm font-semibold py-2">🎓 ¡Créditos completados!</p>
          ) : (
            <>
              <p className="text-indigo-400 font-bold text-2xl sm:text-3xl tabular-nums mb-1">
                {formatearDinero(costoProyectado)}
              </p>
              <p className="text-xs text-slate-500">
                {creditosPendientes} cr restantes · ~{trimestresRestantes} trims. más
              </p>
            </>
          )}
        </div>
      </section>

      {/* ── Desglose Histórico ──────────────────────────────────────────────── */}
      <section className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 shadow-xl shadow-black/20 rounded-3xl p-6 sm:p-8">

        {/* Cabecera de sección */}
        <div className="flex items-center gap-3 mb-6 border-b border-slate-800/60 pb-4">
          <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
            <Receipt className="w-5 h-5 text-cyan-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-100">Desglose de Inversión Histórica</h2>
          <span className="ml-auto text-xs font-bold uppercase tracking-widest text-slate-500">
            {trimestresHistoricos.length} trimestres
          </span>
        </div>

        {/* Tabla responsive */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800/60">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-950/60 text-slate-400 text-xs uppercase tracking-widest">
                <th className="text-left px-5 py-3.5 font-semibold">#</th>
                <th className="text-left px-5 py-3.5 font-semibold">Período</th>
                <th className="text-center px-5 py-3.5 font-semibold">Créditos</th>
                <th className="text-right px-5 py-3.5 font-semibold">Tarifa/cr</th>
                <th className="text-right px-5 py-3.5 font-semibold">Carnet</th>
                <th className="text-right px-4 py-3.5 font-semibold">Total Trimestre</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {trimestresHistoricos.map((t, i) => {
                const tarifa   = obtenerTarifaPorPeriodo(t.periodo);
                const isOpen   = trimestreExpandido === t.id;
                // Materias del trimestre con sus créditos del pensum
                const materias = t.asignaturas ?? [];

                return (
                  <React.Fragment key={t.id || i}>

                    {/* ── Fila principal (clickable) ── */}
                    <tr
                      onClick={() => toggleExpandir(t.id)}
                      className={`cursor-pointer transition-colors duration-200 ${
                        isOpen
                          ? 'bg-slate-800/50 border-b-0'
                          : 'hover:bg-slate-800/30'
                      }`}
                    >
                      <td className="px-5 py-4 text-slate-600 font-mono text-xs">{String(i + 1).padStart(2, '0')}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <CircleCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className={`font-medium ${isOpen ? 'text-cyan-300' : 'text-slate-200'}`}>
                            {t.periodo}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700/50 text-slate-300 font-bold tabular-nums">
                          {t.creditos}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right text-slate-400 tabular-nums">
                        {formatearDinero(tarifa.costoCredito)}
                      </td>
                      <td className="px-5 py-4 text-right text-slate-400 tabular-nums">
                        {formatearDinero(tarifa.carnet)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className={`font-bold tabular-nums ${
                            isOpen ? 'text-cyan-300' : 'text-cyan-400'
                          }`}>
                            {formatearDinero(t.costo)}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-300 ${
                              isOpen ? 'rotate-180 text-cyan-400' : ''
                            }`}
                          />
                        </div>
                      </td>
                    </tr>

                    {/* ── Panel de desglose expandido ── */}
                    {isOpen && (
                      <tr className="bg-slate-950/70">
                        <td colSpan={6} className="px-0 pb-0 pt-0">
                          <div className="mx-3 mb-3 border-l-2 border-cyan-500/60 rounded-bl-xl rounded-br-xl bg-slate-950/80 overflow-hidden">

                            {/* Cabecera del desglose */}
                            <div className="grid grid-cols-12 gap-2 text-slate-500 text-xs uppercase tracking-widest border-b border-slate-800/60 px-4 py-2.5 bg-slate-950/60">
                              <div className="col-span-2">Código</div>
                              <div className="col-span-5">Asignatura</div>
                              <div className="col-span-1 text-center">Cal.</div>
                              <div className="col-span-2 text-center">Créditos</div>
                              <div className="col-span-2 text-right">Subtotal</div>
                            </div>

                            {/* Filas de materias */}
                            <div className="divide-y divide-slate-800/40">
                              {materias.length === 0 ? (
                                <p className="text-slate-600 text-xs px-4 py-3">Sin detalle de asignaturas disponible.</p>
                              ) : (
                                materias.map((materia) => {
                                  const cr     = materia.asignaturaPensum?.creditos ?? 0;
                                  const nombre = materia.asignaturaPensum?.nombre   ?? materia.claveMateria;
                                  const codigo = materia.claveMateria ?? '';
                                  const calif  = materia.calificacion ?? '—';

                                  // Usa calcularCostoMateria para detectar labs y calcular subtotal correcto
                                  const { costoBase, recargoLab, esLab } = calcularCostoMateria(
                                    { nombre, codigo, creditos: cr },
                                    tarifa
                                  );

                                  // Color de calificación
                                  const califColor =
                                    ['CO', 'EI'].includes(calif) ? 'text-blue-400'
                                    : calif === 'R' ? 'text-rose-400'
                                    : calif === 'F' || calif === 'D' ? 'text-amber-400'
                                    : 'text-emerald-400';

                                  return (
                                    <div
                                      key={materia.id}
                                      className="grid grid-cols-12 gap-2 px-4 py-2.5 hover:bg-slate-800/30 transition-colors text-xs"
                                    >
                                      <div className="col-span-2 font-mono text-slate-500">
                                        {codigo}
                                      </div>
                                      <div className="col-span-5 text-slate-300 leading-tight">
                                        {nombre}
                                        {esLab && recargoLab > 0 && (
                                          <span className="block mt-0.5 text-[10px] text-amber-400/80 font-medium tracking-wide">
                                            + Cuota Laboratorio: {formatearDinero(recargoLab)}
                                          </span>
                                        )}
                                      </div>
                                      <div className={`col-span-1 text-center font-bold ${califColor}`}>
                                        {calif}
                                      </div>
                                      <div className="col-span-2 text-center text-slate-400 tabular-nums">
                                        {cr}
                                      </div>
                                      <div className="col-span-2 text-right text-slate-400 tabular-nums">
                                        {cr > 0 ? formatearDinero(costoBase + recargoLab) : <span className="text-slate-600">—</span>}
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>

                            {/* Fila: Carnet */}
                            <div className="grid grid-cols-12 gap-2 px-4 py-2.5 border-t border-slate-800/60 bg-slate-900/30 text-xs">
                              <div className="col-span-10 text-right text-slate-500 font-medium">
                                Carnet estudiantil
                              </div>
                              <div className="col-span-2 text-right text-slate-400 tabular-nums">
                                {formatearDinero(tarifa.carnet)}
                              </div>
                            </div>

                            {/* Fila: Total del trimestre */}
                            <div className="grid grid-cols-12 gap-2 px-4 py-3 border-t-2 border-slate-700/60 bg-slate-950/60 text-xs">
                              <div className="col-span-10 text-right font-bold text-slate-300 uppercase tracking-wide">
                                Total Trimestre
                              </div>
                              <div className="col-span-2 text-right font-extrabold text-cyan-400 tabular-nums">
                                {formatearDinero(t.costo)}
                              </div>
                            </div>

                          </div>
                        </td>
                      </tr>
                    )}

                  </React.Fragment>
                );
              })}
            </tbody>

            {/* Fila de Total */}
            <tfoot>
              <tr className="bg-slate-950/80 border-t-2 border-slate-700/60">
                <td colSpan={5} className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-slate-200 tracking-wide">Gran Total Invertido</span>
                    <span className="text-xs text-slate-500 ml-1">
                      ({trimestresHistoricos.length} trimestres cerrados)
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <span className="text-emerald-400 font-extrabold text-lg tabular-nums">
                    {formatearDinero(totalInvertido)}
                  </span>
                </td>
              </tr>

              {/* Fila: Trimestre activo */}
              {creditosActivos > 0 && (
                <tr className="bg-cyan-950/20 border-t border-cyan-900/30">
                  <td colSpan={5} className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <CircleDashed className="w-4 h-4 text-cyan-400 animate-pulse" />
                      <span className="font-semibold text-cyan-300 text-sm">
                        {trimestreActivo?.periodo} (en curso)
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="text-cyan-400 font-bold tabular-nums">
                      + {formatearDinero(costoActual)}
                    </span>
                  </td>
                </tr>
              )}

              {/* Fila: Inversión total proyectada (cerrados + activo) */}
              {creditosActivos > 0 && (
                <tr className="bg-slate-950/90">
                  <td colSpan={5} className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-400 text-sm font-medium">
                        Inversión hasta hoy (incl. trimestre activo)
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="text-slate-300 font-extrabold tabular-nums">
                      {formatearDinero(totalInvertido + costoActual)}
                    </span>
                  </td>
                </tr>
              )}
            </tfoot>
          </table>
        </div>

        {/* Disclaimer */}
        <p className="mt-5 text-xs text-slate-600 text-center flex items-center justify-center gap-1.5">
          <TrendingUp className="w-3 h-3" />
          Los trimestres T1 con materias convalidadas (CO) utilizan los créditos registrados oficialmente.
          La proyección no incluye ajustes inflacionarios futuros.
        </p>
      </section>

    </div>
  );
};

export default Finanzas;
