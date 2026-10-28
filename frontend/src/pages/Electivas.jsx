import { useEffect, useMemo, useState } from 'react';
import { Loader2, GraduationCap, ArrowRight, TriangleAlert, Repeat2, Layers } from 'lucide-react';
import { obtenerHistorialTrimestres } from '../services/api';
import {
  CONVALIDACIONES,
  TOTAL_CREDITOS_ITLA,
  TOTAL_CREDITOS_CONVALIDADOS,
  resumenElectivas,
} from '../utils/electivas';

const colorNota = (nota) => {
  if (!nota) return 'text-slate-500 border-slate-700 bg-slate-800/40';
  if (nota === 'CO' || nota === 'EI') return 'text-sky-300 border-sky-500/30 bg-sky-500/10';
  if (nota.startsWith('A')) return 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10';
  if (nota.startsWith('B')) return 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10';
  return 'text-amber-300 border-amber-500/30 bg-amber-500/10';
};

const Badge = ({ children, className = '' }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-bold tracking-wide ${className}`}>
    {children}
  </span>
);

// ─── Tarjeta de un componente de electivas ──────────────────────────────────
const ComponenteCard = ({ comp }) => {
  const completo = comp.faltante === 0;
  const pct = Math.min((comp.obtenido / comp.requerido) * 100, 100);
  return (
    <section
      className={`rounded-3xl border p-5 md:p-6 bg-slate-900/40 backdrop-blur-md shadow-xl shadow-black/20 ${
        completo ? 'border-slate-800/60' : 'border-amber-500/40'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100">{comp.titulo}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{comp.clave}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold tabular-nums">
            <span className={completo ? 'text-cyan-400' : 'text-amber-400'}>{comp.obtenido}</span>
            <span className="text-slate-500 text-base font-medium"> / {comp.requerido} cr</span>
          </p>
          {!completo && <p className="text-xs text-amber-400 font-semibold">Faltan {comp.faltante} créditos</p>}
        </div>
      </div>

      <div className="w-full bg-slate-800 rounded-full h-1.5 mb-4 overflow-hidden">
        <div
          className={`h-1.5 rounded-full ${completo ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 'bg-amber-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-slate-500 mb-4">{comp.nota}</p>

      <div className="space-y-2">
        {comp.espacios.map((esp) => {
          const nota = esp.cursada?.calificacion;
          const convalidada = Boolean(esp.convalidada);
          return (
            <div
              key={esp.slot}
              className="grid grid-cols-12 gap-2 items-center rounded-xl border border-slate-800/70 bg-slate-950/40 px-3 py-3"
            >
              <div className="col-span-12 sm:col-span-2">
                <Badge className="text-cyan-300 border-cyan-500/30 bg-cyan-500/10">{esp.slot}</Badge>
              </div>
              <div className="col-span-12 sm:col-span-6 min-w-0">
                {convalidada ? (
                  <>
                    <p className="text-sm font-semibold text-slate-200">Convalidada desde el ITLA</p>
                    <p className="text-xs text-slate-500">{esp.convalidada.itla}</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-slate-200 truncate" title={esp.real.nombre}>
                      <span className="text-slate-400 font-mono text-xs mr-2">{esp.real.clave}</span>
                      {esp.real.nombre}
                    </p>
                    <p className="text-xs text-slate-500">
                      {esp.cursada ? `T${esp.cursada.numeroTrimestre} · ${esp.cursada.periodo}` : 'Sin registrar'}
                      {esp.real.nota ? ` · ${esp.real.nota}` : ''}
                    </p>
                  </>
                )}
              </div>
              <div className="col-span-6 sm:col-span-2 sm:text-right text-xs text-slate-400 tabular-nums">
                {(esp.cursada?.creditos ?? esp.convalidada?.cr ?? 0)} cr
              </div>
              <div className="col-span-6 sm:col-span-2 text-right">
                <Badge className={colorNota(nota)}>{nota ?? '—'}</Badge>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

// ─── Convalidaciones ─────────────────────────────────────────────────────────
const ConvalidacionesSeccion = () => (
  <section className="rounded-3xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-md shadow-xl shadow-black/20 p-5 md:p-6">
    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20">
          <Repeat2 className="w-5 h-5 text-sky-300" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-100">Materias convalidadas</h3>
          <p className="text-xs text-slate-500">Instituto Tecnológico de las Américas (ITLA) → INTEC · Convalidación final, 12/07/2022</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-slate-500">Créditos</p>
        <p className="font-bold tabular-nums text-slate-200">
          {TOTAL_CREDITOS_ITLA} ITLA <span className="text-slate-500">→</span>{' '}
          <span className="text-sky-300">{TOTAL_CREDITOS_CONVALIDADOS} INTEC</span>
        </p>
      </div>
    </div>

    <div className="space-y-3">
      {CONVALIDACIONES.map((g, i) => {
        const esElectiva = g.intec.some(m => m.electiva);
        return (
          <div
            key={i}
            className={`grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 md:gap-4 items-center rounded-2xl border px-4 py-3 ${
              esElectiva ? 'border-amber-500/30 bg-amber-500/5' : 'border-slate-800/70 bg-slate-950/40'
            }`}
          >
            <div className="space-y-1.5">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold md:hidden">ITLA</p>
              {g.itla.map(m => (
                <p key={m.clave} className="text-sm text-slate-300 flex justify-between gap-3">
                  <span><span className="font-mono text-xs text-slate-500 mr-2">{m.clave}</span>{m.nombre}</span>
                  <span className="tabular-nums text-slate-500 shrink-0">{m.cr} cr</span>
                </p>
              ))}
            </div>
            <ArrowRight className="hidden md:block w-4 h-4 text-slate-600" />
            <div className="space-y-1.5">
              <p className="text-[10px] uppercase tracking-widest text-sky-400/70 font-semibold md:hidden">INTEC</p>
              {g.intec.map(m => (
                <p key={m.clave} className="text-sm text-slate-200 flex justify-between gap-3">
                  <span>
                    <span className="font-mono text-xs text-sky-300 mr-2">{m.clave}</span>
                    {m.nombre}
                  </span>
                  <span className="tabular-nums text-sky-300 shrink-0">{m.cr} cr</span>
                </p>
              ))}
            </div>
          </div>
        );
      })}
    </div>

    <p className="text-xs text-slate-500 mt-4">
      Las dos electivas convalidadas (EEE2X1 y EEP3X1) se reconocieron con 0 créditos en INTEC. Las
      materias convalidadas no generan cargo y no entran en el índice académico.
    </p>
  </section>
);

// ─── Página ──────────────────────────────────────────────────────────────────
const Electivas = () => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    obtenerHistorialTrimestres()
      .then(setHistorial)
      .catch(() => setError('No se pudo cargar el historial. Se muestran solo los datos fijos del plan.'))
      .finally(() => setLoading(false));
  }, []);

  const componentes = useMemo(() => resumenElectivas(historial), [historial]);
  const obtenido = componentes.reduce((acc, c) => acc + c.obtenido, 0);
  const requerido = componentes.reduce((acc, c) => acc + c.requerido, 0);
  const faltante = Math.max(requerido - obtenido, 0);
  const profesional = componentes.find(c => c.id === 'profesionales');

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <GraduationCap className="w-6 h-6 text-cyan-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-cyan-400">Electivas y Convalidaciones</h1>
        </div>
        <p className="text-slate-400">
          En qué espacio del pensum cayó cada materia que cursaste como electiva, y qué se convalidó del ITLA.
        </p>
        {error && <p className="text-xs text-amber-400 mt-2">{error}</p>}
      </header>

      {/* Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5">
          <p className="text-xs text-slate-500 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Créditos de electivas</p>
          <p className="text-3xl font-extrabold text-white tabular-nums mt-1">
            {obtenido}<span className="text-slate-500 text-lg font-medium"> / {requerido}</span>
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5">
          <p className="text-xs text-slate-500">Convalidados del ITLA</p>
          <p className="text-3xl font-extrabold text-sky-300 tabular-nums mt-1">
            {TOTAL_CREDITOS_CONVALIDADOS}<span className="text-slate-500 text-lg font-medium"> cr</span>
          </p>
        </div>
        <div className={`rounded-2xl border p-5 ${faltante > 0 ? 'border-amber-500/40 bg-amber-500/5' : 'border-slate-800/60 bg-slate-900/40'}`}>
          <p className="text-xs text-slate-500">Créditos de electivas por confirmar</p>
          <p className={`text-3xl font-extrabold tabular-nums mt-1 ${faltante > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {faltante}<span className="text-slate-500 text-lg font-medium"> cr</span>
          </p>
        </div>
      </div>

      {/* Aviso: electiva profesional */}
      {profesional && profesional.faltante > 0 && (
        <div className="flex gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/5 p-4 md:p-5">
          <TriangleAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-sm text-slate-300 space-y-1.5">
            <p className="font-semibold text-amber-300">
              Electivas profesionales: {profesional.obtenido} de {profesional.requerido} créditos
            </p>
            <p>
              El plan pide 12 créditos de electivas profesionales. La primera (EEP3X1) se convalidó desde el ITLA
              con <b>0 créditos</b> (TDS 005, que en el ITLA valía 4), así que hoy suman 8: Derecho Comercial e
              Inteligencia de Negocios. Por eso el total llega a 275 de 279 créditos.
            </p>
            <p className="text-slate-400">
              Confirma con Registro o tu coordinación si te exigen completar esos 4 créditos con otra electiva
              profesional (una materia de 4 créditos o dos de 2).
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {componentes.map(c => <ComponenteCard key={c.id} comp={c} />)}
      </div>

      <ConvalidacionesSeccion />
    </div>
  );
};

export default Electivas;
