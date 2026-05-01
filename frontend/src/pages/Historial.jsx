import React, { useEffect, useState, useMemo } from 'react';
import { obtenerHistorialTrimestres } from '../services/api';
import { Loader2, User, Clock, MapPin, BookOpen, ChevronDown } from 'lucide-react';

// ─── Badge de calificación ────────────────────────────────────────────────────
const CalifBadge = ({ calif }) => {
  if (!calif) return null;
  const colorMap = {
    A: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    B: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    C: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    D: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    F: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    R: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    CO: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
    EI: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
  };
  // Normaliza: "A+" → key "A", "B+" → "B", etc.
  const key = calif.replace('+', '');
  const cls = colorMap[key] || 'bg-slate-700/30 text-slate-400 border-slate-600/30';
  return (
    <span className={`text-xs font-black px-2 py-0.5 rounded border ${cls}`}>
      {calif}
    </span>
  );
};

// ─── Tarjeta de asignatura ────────────────────────────────────────────────────
const AsigCard = ({ asig }) => (
  <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 shadow-xl shadow-black/20 rounded-xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 group">
    <div className="bg-slate-950/50 border-b border-slate-800/60 p-4 flex justify-between items-start gap-2">
      <div className="min-w-0">
        <span className="text-xs font-bold text-cyan-500 bg-cyan-500/10 px-2 py-1 rounded-md tracking-wider">
          {asig.claveMateria}
        </span>
        <h3 className="text-slate-100 font-bold text-sm mt-2 leading-tight line-clamp-2" title={asig.asignaturaPensum?.nombre || asig.nombre}>
          {asig.asignaturaPensum?.nombre || asig.nombre || 'Asignatura'}
        </h3>
      </div>
      <div className="flex flex-col items-end shrink-0">
        <span className="text-[10px] text-slate-500 font-bold uppercase mb-1">Nota</span>
        <CalifBadge calif={asig.calificacion} />
      </div>
    </div>
    <div className="p-4 space-y-2.5">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 bg-slate-800/50 p-1.5 rounded-md text-slate-400 shrink-0">
          <User className="w-3.5 h-3.5" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] text-slate-500 font-semibold uppercase">Profesor</p>
          <p className="text-xs text-slate-300 truncate">{asig.profesor || 'Sin asignar'}</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 bg-slate-800/50 p-1.5 rounded-md text-slate-400 shrink-0">
          <Clock className="w-3.5 h-3.5" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] text-slate-500 font-semibold uppercase">Horario</p>
          <p className="text-xs text-slate-300">{asig.horario || 'Sin asignar'}</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 bg-slate-800/50 p-1.5 rounded-md text-slate-400 shrink-0">
          <MapPin className="w-3.5 h-3.5" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] text-slate-500 font-semibold uppercase">Aula</p>
          <p className="text-xs text-slate-300">{asig.aula || 'Sin asignar'}</p>
        </div>
      </div>
    </div>
  </div>
);

// ─── Tarjeta de un trimestre completo ────────────────────────────────────────
const TrimestreCard = ({ trimestre, numero }) => {
  const esActivo = trimestre.estado === 'ACTIVO';
  return (
    <div className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
      esActivo
        ? 'border-cyan-500/50 bg-cyan-950/10 shadow-lg shadow-cyan-900/20'
        : 'border-slate-800/60 bg-slate-900/20'
    }`}>
      {/* Header del trimestre */}
      <div className="p-5 border-b border-slate-800/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${
            esActivo ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'
          }`}>
            {numero}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-slate-100 text-base">{trimestre.periodo}</h3>
              {esActivo && (
                <span className="text-[10px] font-bold bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20 uppercase tracking-wider">
                  En Curso
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {trimestre.asignaturas?.length || 0} materias registradas
            </p>
          </div>
        </div>

        {/* Métricas rápidas */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-center">
            <p className="text-[10px] text-slate-500 font-semibold uppercase">Créditos</p>
            <p className="text-lg font-bold text-slate-200">{trimestre.creditosAprobados ?? 0}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-slate-500 font-semibold uppercase">GPA</p>
            <p className={`text-lg font-extrabold ${esActivo ? 'text-slate-500' : 'text-cyan-400'}`}>
              {esActivo ? '—' : (trimestre.gpa ?? trimestre.indiceTrimestral ?? 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Grid de asignaturas */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trimestre.asignaturas?.length > 0
          ? trimestre.asignaturas.map(asig => <AsigCard key={asig.id} asig={asig} />)
          : <p className="text-slate-500 text-sm col-span-full text-center py-4">No hay asignaturas registradas.</p>
        }
      </div>
    </div>
  );
};

// ─── Página principal ─────────────────────────────────────────────────────────
const Historial = () => {
  const [historial, setHistorial]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  // 'recientes' | 'todos' | <trimestre.id>
  const [filtroActivo, setFiltroActivo] = useState('recientes');

  useEffect(() => {
    obtenerHistorialTrimestres()
      .then(data => {
        const list = Array.isArray(data) ? data : data.value || [];
        // Guardamos el array TAL COMO llega del backend (ascendente: T1→T16)
        setHistorial(list);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // ─── Orden descendente: T16 en índice 0, T1 al final ───────────────────────
  // IMPORTANTE: debe estar ANTES de cualquier early return para cumplir
  // las Rules of Hooks (los hooks nunca pueden estar después de un return).
  const trimestresDescendentes = useMemo(
    () => [...historial].reverse(),
    [historial]
  );

  // ─── Qué mostrar según el select ────────────────────────────────────────────
  const trimestresAMostrar = useMemo(() => {
    if (filtroActivo === 'todos')     return trimestresDescendentes;
    if (filtroActivo === 'recientes') return trimestresDescendentes.slice(0, 3);
    return trimestresDescendentes.filter(t => t.id === filtroActivo);
  }, [trimestresDescendentes, filtroActivo]);

  // ─── Early returns (SIEMPRE después de todos los hooks) ─────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium animate-pulse">Cargando récord académico...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-rose-400 text-center p-8 bg-rose-950/20 rounded-2xl border border-rose-900/50">
        {error}
      </div>
    );
  }

  if (historial.length === 0) {
    return (
      <div className="text-center p-12 bg-slate-800/20 rounded-3xl border border-slate-700/50">
        <p className="text-slate-400 text-lg">No hay trimestres registrados en tu historial aún.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full">

      {/* ── Header + Select ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <header>
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-1">
            Récord Oficial
          </h1>
          <p className="text-slate-400 text-sm">
            Historial académico detallado · {historial.length} trimestres registrados
          </p>
        </header>

        {/* ── Selector de trimestre (Glassmorphism) ── */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="filtro-trimestre" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Filtrar por trimestre
          </label>
          <div className="relative">
            <select
              id="filtro-trimestre"
              value={filtroActivo}
              onChange={e => setFiltroActivo(e.target.value)}
              className="appearance-none bg-slate-900/60 backdrop-blur-md border border-slate-700/60 text-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 w-full md:w-72 cursor-pointer shadow-lg shadow-black/20 transition-colors hover:border-slate-600"
            >
              <optgroup label="Vista rápida">
                <option value="recientes">⭐ Últimos 3 trimestres</option>
                <option value="todos">📋 Ver historial completo</option>
              </optgroup>
              <optgroup label="Trimestre específico">
                {trimestresDescendentes.map((t, index) => (
                  <option key={t.id} value={t.id}>
                    Trimestre {trimestresDescendentes.length - index}: {t.periodo}
                  </option>
                ))}
              </optgroup>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* ── Contador de resultados ──────────────────────────────────────────── */}
      {filtroActivo === 'recientes' && historial.length > 3 && (
        <p className="text-xs text-slate-500 -mt-4">
          Mostrando los 3 más recientes de {historial.length} · Usa el selector para ver el historial completo.
        </p>
      )}

      {/* ── Lista de trimestres ─────────────────────────────────────────────── */}
      <div className="space-y-8">
        {trimestresAMostrar.map((trimestre, idx) => {
          // Número del trimestre: el primero de la lista descendente es el más reciente (T16)
          const numeroTrimestre = trimestresDescendentes.length - trimestresDescendentes.indexOf(trimestre);
          return (
            <TrimestreCard
              key={trimestre.id}
              trimestre={trimestre}
              numero={numeroTrimestre}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Historial;
