import { useMemo, useState } from 'react';
import { Calculator, RotateCcw, TrendingUp } from 'lucide-react';
import {
  TARIFAS_INTEC,
  calcularCostoManual,
  formatearDinero,
  historialTarifas,
} from '../utils/tarifas';

const DESCUENTO_PAGO_COMPLETO = 5; // el que INTEC aplicó al pago único del T17

const soloEnteros = (valor) => valor.replace(/\D/g, '').slice(0, 2);

const Fila = ({ etiqueta, valor, destacado = false, className = '' }) => (
  <div className={`flex items-baseline justify-between gap-4 py-2 ${className}`}>
    <span className={destacado ? 'text-slate-200 font-semibold' : 'text-slate-400 text-sm'}>{etiqueta}</span>
    <span className={`tabular-nums ${destacado ? 'text-cyan-400 font-extrabold text-2xl sm:text-3xl' : 'text-slate-300 text-sm'}`}>
      {valor}
    </span>
  </div>
);

export default function CalculadoraCreditos({ creditosActuales = 0, laboratoriosActuales = 0 }) {
  const ciclos = useMemo(() => historialTarifas(), []);
  const ciclosDesc = useMemo(() => [...ciclos].reverse(), [ciclos]);
  const anioVigente = ciclos[ciclos.length - 1].anio;
  const anioInicial = ciclos[0].anio;

  const [creditos, setCreditos] = useState('10');
  const [laboratorios, setLaboratorios] = useState('1');
  const [anio, setAnio] = useState(anioVigente);
  const [incluirCarnet, setIncluirCarnet] = useState(true);
  const [conDescuento, setConDescuento] = useState(false);

  const tarifa = TARIFAS_INTEC[anio];
  const numCreditos = parseInt(creditos, 10) || 0;
  const numLabs = parseInt(laboratorios, 10) || 0;
  const labsEfectivos = Math.min(numLabs, numCreditos); // cada laboratorio lleva al menos 1 crédito
  const labsExceden = numLabs > numCreditos;

  const r = calcularCostoManual({
    creditos: numCreditos,
    laboratorios: labsEfectivos,
    tarifa,
    incluirCarnet,
    descuentoPct: conDescuento ? DESCUENTO_PAGO_COMPLETO : 0,
  });

  // Mismo cálculo con la tarifa con la que empezaste, para ver cuánto ha subido
  const rInicial = calcularCostoManual({
    creditos: numCreditos,
    laboratorios: labsEfectivos,
    tarifa: TARIFAS_INTEC[anioInicial],
    incluirCarnet,
    descuentoPct: conDescuento ? DESCUENTO_PAGO_COMPLETO : 0,
  });
  const difInicial = r.total - rInicial.total;
  const difInicialPct = rInicial.total > 0 ? (difInicial / rInicial.total) * 100 : 0;

  const reiniciar = () => {
    setCreditos('10');
    setLaboratorios('1');
    setAnio(anioVigente);
    setIncluirCarnet(true);
    setConDescuento(false);
  };

  const rapidos = [5, 9, 12, 15, 20];

  return (
    <section className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 shadow-xl shadow-black/20 rounded-3xl p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <Calculator className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Calculadora de créditos</h2>
            <p className="text-xs text-slate-500">Pon cuántos créditos vas a tomar y mira cuánto cuesta.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={reiniciar}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 border border-slate-700/70 rounded-lg px-3 py-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reiniciar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* ── Entradas ── */}
        <div className="space-y-5">
          <div>
            <label htmlFor="calc-creditos" className="block text-sm font-semibold text-slate-300 mb-1.5">
              Créditos a inscribir
            </label>
            <input
              id="calc-creditos"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={creditos}
              onChange={(e) => setCreditos(soloEnteros(e.target.value))}
              placeholder="0"
              className="w-full rounded-xl bg-slate-950/70 border border-slate-700/70 focus:border-cyan-500/70 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 px-4 py-3 text-2xl font-bold text-slate-100 tabular-nums"
            />
            <p className="text-xs text-slate-500 mt-1.5">Cuenta también los créditos de los laboratorios.</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {rapidos.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCreditos(String(n))}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                    numCreditos === n
                      ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300'
                      : 'border-slate-700/70 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {n}
                </button>
              ))}
              {creditosActuales > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setCreditos(String(creditosActuales));
                    setLaboratorios(String(laboratoriosActuales));
                  }}
                  className="px-3 py-1 rounded-lg text-xs font-semibold border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 transition-colors"
                >
                  Mi trimestre actual ({creditosActuales} cr)
                </button>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="calc-labs" className="block text-sm font-semibold text-slate-300 mb-1.5">
              Laboratorios entre esos créditos
            </label>
            <input
              id="calc-labs"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={laboratorios}
              onChange={(e) => setLaboratorios(soloEnteros(e.target.value))}
              placeholder="0"
              className="w-full rounded-xl bg-slate-950/70 border border-slate-700/70 focus:border-cyan-500/70 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 px-4 py-2.5 text-lg font-bold text-slate-100 tabular-nums"
            />
            <p className="text-xs text-slate-500 mt-1.5">
              {tarifa.costoLab > 0
                ? `Cada laboratorio lleva un cargo aparte de ${formatearDinero(tarifa.costoLab)}.`
                : 'En esta tarifa los laboratorios no tenían cargo aparte.'}
            </p>
            {labsExceden && (
              <p className="text-xs text-amber-400 mt-1">
                No puede haber más laboratorios que créditos; se calcula con {labsEfectivos}.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="calc-tarifa" className="block text-sm font-semibold text-slate-300 mb-1.5">
              Tarifa a usar
            </label>
            <select
              id="calc-tarifa"
              value={anio}
              onChange={(e) => setAnio(Number(e.target.value))}
              className="w-full rounded-xl bg-slate-950/70 border border-slate-700/70 focus:border-cyan-500/70 focus:outline-none px-4 py-2.5 text-sm text-slate-100"
            >
              {ciclosDesc.map((c) => (
                <option key={c.anio} value={c.anio}>
                  {c.ciclo} · {formatearDinero(c.costoCredito)} por crédito{c.esActual ? ' (actual)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2.5">
            <label className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={incluirCarnet}
                onChange={(e) => setIncluirCarnet(e.target.checked)}
                className="w-4 h-4 accent-cyan-500"
              />
              Incluir carnet ({formatearDinero(tarifa.carnet)})
            </label>
            <label className="flex items-start gap-3 text-sm text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={conDescuento}
                onChange={(e) => setConDescuento(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 mt-0.5"
              />
              <span>
                Aplicar {DESCUENTO_PAGO_COMPLETO}% de descuento
                <span className="block text-xs text-slate-500">
                  El que tuviste al pagar el T17 de una sola vez. No está garantizado en otros trimestres.
                </span>
              </span>
            </label>
          </div>
        </div>

        {/* ── Resultado ── */}
        <div className="rounded-2xl border border-slate-800/70 bg-slate-950/50 p-5 sm:p-6 flex flex-col">
          <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-2">Resultado</p>

          {numCreditos === 0 ? (
            <p className="text-slate-500 text-sm py-10 text-center">Escribe cuántos créditos vas a tomar.</p>
          ) : (
            <>
              <div className="divide-y divide-slate-800/60">
                <Fila
                  etiqueta={`${r.creditos} créditos × ${formatearDinero(tarifa.costoCredito)}`}
                  valor={formatearDinero(r.costoCreditos)}
                />
                {tarifa.costoLab > 0 && (
                  <Fila
                    etiqueta={`${r.laboratorios} laboratorio${r.laboratorios === 1 ? '' : 's'} × ${formatearDinero(tarifa.costoLab)}`}
                    valor={formatearDinero(r.recargoLabs)}
                  />
                )}
                {incluirCarnet && <Fila etiqueta="Carnet" valor={formatearDinero(r.carnet)} />}
                {conDescuento && (
                  <Fila
                    etiqueta={`Descuento ${DESCUENTO_PAGO_COMPLETO}%`}
                    valor={`−${formatearDinero(r.descuento)}`}
                    className="[&>span:last-child]:text-emerald-400"
                  />
                )}
              </div>

              <div className="mt-3 pt-3 border-t-2 border-slate-700/60">
                <Fila etiqueta="Total" valor={formatearDinero(r.total)} destacado />
                <p className="text-xs text-slate-500 text-right">
                  ≈ {formatearDinero(r.costoPorCredito)} por crédito, todo incluido
                </p>
              </div>

              {anio !== anioInicial && (
                <div className="mt-5 rounded-xl border border-amber-500/25 bg-amber-500/5 p-3.5 flex gap-3">
                  <TrendingUp className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Con la tarifa de {anioInicial} (cuando empezaste) esto habría costado{' '}
                    <b className="text-slate-100">{formatearDinero(rInicial.total)}</b>. Hoy son{' '}
                    <b className="text-amber-300">
                      {formatearDinero(difInicial)} más ({difInicialPct >= 0 ? '+' : ''}
                      {difInicialPct.toFixed(1)}%)
                    </b>
                    .
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
