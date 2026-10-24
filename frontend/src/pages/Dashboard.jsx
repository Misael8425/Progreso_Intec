import React, { useEffect, useState } from 'react';
import { obtenerPensum, obtenerHistorialTrimestres, obtenerVolanteActivo } from '../services/api';
import { Loader2, TrendingUp, BookCheck, BookDashed, CalendarClock, MapPin, Clock, History } from 'lucide-react';
import PermanenciaChart from '../components/PermanenciaChart';
import PensumProgressChart from '../components/PensumProgressChart';
import { PLAN, periodosRestantes } from '../utils/plan';

const Dashboard = () => {
  const [data, setData] = useState({
    pensum: [],
    historial: [],
    volante: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resPensum, resHistorial, resVolante] = await Promise.all([
          obtenerPensum(),
          obtenerHistorialTrimestres(),
          obtenerVolanteActivo()
        ]);

        setData({
          pensum: Array.isArray(resPensum) ? resPensum : resPensum.value || [],
          historial: Array.isArray(resHistorial) ? resHistorial : resHistorial.value || [],
          volante: resVolante // object
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-slate-400 font-medium text-lg animate-pulse tracking-wide">Cargando tu progreso...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-rose-400 text-center p-8 bg-rose-950/20 rounded-3xl border border-rose-900/50">
        <p className="font-bold">Error cargando el Dashboard</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  const { pensum, historial, volante } = data;

  // 1. Cálculos de Métricas
  const trimestresDescendentes = [...historial].reverse();
  const obtenerIndiceGeneral = (lista) => {
    if (!lista || lista.length === 0) return "0.00";
    const masReciente = lista[0]; // Ya invertido
    return masReciente.indiceAcumulado ? masReciente.indiceAcumulado.toFixed(2) : "0.00";
  };
  const indiceGeneral = obtenerIndiceGeneral(trimestresDescendentes);

  const materiasAprobadasLista = pensum.filter(m => m.estado === 'Aprobada' || m.calificacion === 'CO' || m.calificacion === 'EI');
  const creditosAprobados = materiasAprobadasLista.reduce((acc, curr) => acc + curr.creditos, 0);
  const TOTAL_CREDITOS = PLAN.totalCreditos;
  const porcentajeAvanceCreditos = Math.min(((creditosAprobados / TOTAL_CREDITOS) * 100), 100).toFixed(1);

  // Matemáticas exactas para las asignaturas
  const TOTAL_MATERIAS = PLAN.totalMaterias; // Pensum oficial INTEC IDS-2020: 113 asignaturas
  const materiasAprobadas = materiasAprobadasLista.length;
  const materiasEnCurso = pensum.filter(m => m.estado === 'Cursando').length;
  const porcentajeAvanceMaterias = Math.min(((materiasAprobadas / TOTAL_MATERIAS) * 100), 100).toFixed(1);

  // Todo lo que no está aprobado, está pendiente por aprobar (esto engloba 'Pendiente', 'Reprobada' y 'Cursando')
  const materiasPendientes = TOTAL_MATERIAS - materiasAprobadas;

  // Trimestres de permanencia: transcurridos (los registrados) vs. el máximo permitido
  const trimestresTranscurridos = historial.length;
  const trimestresQueQuedan = Math.max(PLAN.trimestresPermanencia - trimestresTranscurridos, 0);
  const proximosPeriodos = periodosRestantes(trimestresDescendentes[0]?.periodo, trimestresQueQuedan);
  const creditosPendientes = Math.max(TOTAL_CREDITOS - creditosAprobados, 0);

  // 2. Clases de Hoy
  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  const diaActual = diasSemana[new Date().getDay()];
  
  // Normalizar strings para evitar problemas con acentos (ej. Miércoles vs Miercoles)
  const normalizeStr = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  
  // El día puede venir agrupado ("Lunes y Miércoles"), por eso se usa includes
  const clasesDeHoy = volante?.horarios?.filter(h =>
    normalizeStr(h.dia).includes(normalizeStr(diaActual))
  ) || [];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto">
      <header>
        <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 mb-2">
          Dashboard
        </h1>
        <p className="text-slate-400 text-lg">Resumen ejecutivo de tu progreso académico.</p>
      </header>

      {/* TOP ROW: MÉTRICAS (Grilla de 4 columnas en Desktop) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Tarjeta 1: Índice Acumulado */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 shadow-xl shadow-black/20 hover:border-cyan-500/30 transition-colors duration-300 rounded-3xl p-6 lg:p-8 flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-slate-300">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-semibold tracking-wide">Índice Académico</h3>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <p className="text-5xl font-extrabold text-white">{indiceGeneral}</p>
          </div>
          <p className="text-xs text-slate-400 mt-auto">Al trimestre más reciente</p>
        </div>

        {/* Tarjeta 2: Créditos Aprobados */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 shadow-xl shadow-black/20 hover:border-cyan-500/30 transition-colors duration-300 rounded-3xl p-6 lg:p-8 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-300">
                <BookCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-semibold tracking-wide">Créditos</h3>
              </div>
              <span className="px-2 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
                {porcentajeAvanceCreditos}%
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <p className="text-5xl font-extrabold text-white">{creditosAprobados}</p>
              <p className="text-xl text-slate-500 font-medium">/ {TOTAL_CREDITOS}</p>
            </div>
            <p className="text-xs text-slate-400 mt-2">Créditos aprobados en el plan</p>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 mt-6 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full" style={{ width: `${porcentajeAvanceCreditos}%` }}></div>
          </div>
        </div>

        {/* Tarjeta 3: Materias Aprobadas */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 shadow-xl shadow-black/20 hover:border-cyan-500/30 transition-colors duration-300 rounded-3xl p-6 lg:p-8 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-300">
                <BookCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-semibold tracking-wide">Materias</h3>
              </div>
              <span className="px-2 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
                {porcentajeAvanceMaterias}%
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <p className="text-5xl font-extrabold text-white">{materiasAprobadas}</p>
              <p className="text-xl text-slate-500 font-medium">/ {TOTAL_MATERIAS}</p>
            </div>
            <p className="text-xs text-slate-400 mt-2">Asignaturas aprobadas</p>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 mt-6 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full" style={{ width: `${porcentajeAvanceMaterias}%` }}></div>
          </div>
        </div>

        {/* Tarjeta 4: Por Cursar */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 shadow-xl shadow-black/20 hover:border-cyan-500/30 transition-colors duration-300 rounded-3xl p-6 lg:p-8 flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-slate-300">
              <BookDashed className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-semibold tracking-wide">Por Cursar</h3>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <p className="text-5xl font-extrabold text-white">{materiasPendientes}</p>
          </div>
          <p className="text-xs text-slate-400 mt-auto">Asignaturas pendientes en el plan (Incluye las {materiasEnCurso} actuales)</p>
        </div>
      </section>

      {/* GRÁFICAS: permanencia y progreso del pensum */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PermanenciaChart
          transcurridos={trimestresTranscurridos}
          total={PLAN.trimestresPermanencia}
          proximos={proximosPeriodos}
          creditosPendientes={creditosPendientes}
        />
        <PensumProgressChart pensum={pensum} />
      </div>

      {/* MIDDLE & BOTTOM SECTIONS: 2 Columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Clases de Hoy */}
        {/* Clases de Hoy */}
        <section className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 shadow-xl shadow-black/20 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 border-b border-slate-800/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
                <CalendarClock className="w-5 h-5 text-cyan-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-100">Clases de Hoy</h2>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{diaActual}</span>
          </div>

          <div className="space-y-4">
            {clasesDeHoy.length === 0 ? (
              <div className="text-center p-6 bg-slate-950/50 rounded-2xl border border-slate-800/60">
                <p className="text-slate-400 font-medium">¡Día libre! No tienes clases programadas para hoy.</p>
              </div>
            ) : (
              clasesDeHoy.map(clase => (
                <div key={clase.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800/60 hover:border-cyan-500/30 transition-colors">
                  <div className="mb-3 sm:mb-0">
                    <h4 className="font-bold text-slate-200 text-lg">{clase.claveMateria}</h4>
                    <p className="text-xs text-slate-400 font-medium truncate max-w-[200px]">{clase.profesor}</p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-2">
                    <div className="flex items-center gap-1.5 text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold tracking-wider">{clase.horas}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700/50">
                      <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                      <span className="text-xs font-bold">{clase.aula}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Actividad Reciente */}
        <section className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 shadow-xl shadow-black/20 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-800/60 pb-4">
            <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
              <History className="w-5 h-5 text-cyan-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-100">Actividad Reciente</h2>
          </div>

          <div className="flex flex-col gap-4">
            {trimestresDescendentes.slice(0, 3).map((trimestre, i) => {
              const esActual = i === 0;
              const numMaterias = trimestre.asignaturas?.length || 0;
              const tieneNotas = (trimestre.asignaturas ?? []).some(a => a.calificacion);
              const numCreditos = trimestre.asignaturas?.reduce((acc, asig) => acc + (asig.asignaturaPensum?.creditos || 0), 0) || 0;

              return (
                <div 
                  key={trimestre.id} 
                  className={`pl-4 py-3 border-l-4 rounded-r-xl bg-slate-950/30 ${esActual ? 'border-cyan-500/50 shadow-[inset_2px_0_0_0_rgba(6,182,212,0.5)]' : 'border-slate-800'}`}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                    <h4 className={`font-bold ${esActual ? 'text-slate-100' : 'text-slate-300'}`}>{trimestre.periodo}</h4>
                    {esActual ? (
                      <span className="text-[10px] font-bold bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded-md border border-cyan-500/20 uppercase tracking-wider">
                        Trimestre en Curso
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-slate-800 text-slate-400 px-2 py-1 rounded-md border border-slate-700 uppercase tracking-wider">
                        Trimestre Cerrado
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2">
                    <p className="text-xs text-slate-400 font-medium">
                      {numMaterias} {esActual && !tieneNotas ? 'Materias en curso' : 'Materias'} &bull; {numCreditos} {esActual && !tieneNotas ? 'Créditos en curso' : 'Créditos'}
                    </p>
                    {esActual && !tieneNotas ? (
                      <span className="text-xs font-bold text-cyan-500">
                        Calificaciones pendientes
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-slate-500">
                        GPA: {trimestre.indiceTrimestral?.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            {historial.length === 0 && (
              <p className="text-center text-slate-500 p-4">No hay actividad reciente registrada.</p>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
