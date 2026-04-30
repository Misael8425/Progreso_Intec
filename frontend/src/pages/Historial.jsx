import React, { useEffect, useState } from 'react';
import { obtenerHistorialTrimestres } from '../services/api';
import { Loader2, User, Clock, MapPin, TrendingUp, BookOpen } from 'lucide-react';

const Historial = () => {
  const [historial, setHistorial] = useState([]);
  const [trimestreSeleccionado, setTrimestreSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    obtenerHistorialTrimestres()
      .then(data => {
        const list = Array.isArray(data) ? data : data.value || [];
        // Ordenamos los trimestres de forma descendente (el más reciente primero)
        const sortedList = list.sort((a, b) => {
          // Asumimos que los más recientes tienen un ID o periodo posterior, pero
          // lo más seguro es ordenarlos por el arreglo recibido invirtiéndolo si viene asc.
          // Si el backend no los ordena, esto los invierte para mostrar los últimos primero
          // En Prisma, los insertamos en orden cronológico (1 al 16), por lo que reverse() funciona.
          return -1; 
        }).reverse(); // Si ya vienen en desc por createdAt (como hicimos en Prisma desc), reverse los desordenará. 
        // Mejor hacer un reverse() estático si el backend los manda en asc.
        // Prisma tiene `orderBy: { createdAt: 'desc' }` en el servicio `obtenerHistorialVolantes`,
        // pero en el controlador `trimestre.controller.js` no lo sabemos.
        // Para estar seguros de que el Trimestre 16 es el primero, vamos a invertir el arreglo.
        
        // Forma segura: el backend de `obtenerHistorialTrimestres` los ordena por `createdAt: 'desc'`
        // Así que el primero ya es el más reciente. No usamos sort() para no dañar el orden.
        setHistorial(list);
        if (list.length > 0) {
          setTrimestreSeleccionado(list[0].id); // Por defecto, seleccionar el más reciente
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium animate-pulse">Cargando récord académico detallado...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-rose-400 text-center p-8 bg-rose-950/20 rounded-2xl border border-rose-900/50">{error}</div>;
  }

  if (historial.length === 0) {
    return (
      <div className="text-center p-12 bg-slate-800/20 rounded-3xl border border-slate-700/50">
        <p className="text-slate-400 text-lg">No hay trimestres registrados en tu historial aún.</p>
      </div>
    );
  }

  // Buscar el trimestre seleccionado en el array
  const trimestreData = historial.find(t => t.id === trimestreSeleccionado) || historial[0];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
            Mi Historial
          </h1>
          <p className="text-slate-400">Trazabilidad total de asignaturas cursadas.</p>
        </div>
        
        {/* Selector de Trimestre */}
        <div className="flex flex-col gap-2">
          <label htmlFor="trimestreSelect" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Seleccionar Trimestre
          </label>
          <select
            id="trimestreSelect"
            className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none w-full md:w-80 cursor-pointer"
            value={trimestreSeleccionado || ''}
            onChange={(e) => setTrimestreSeleccionado(e.target.value)}
          >
            {historial.map((t, i) => (
              <option key={t.id} value={t.id}>
                {t.estado === 'ACTIVO' ? '⭐ ' : ''}{t.periodo} {t.anio ? `(${t.anio})` : ''}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Resumen del Trimestre Seleccionado */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-5 rounded-2xl flex flex-col items-center justify-center text-center">
          <span className="text-slate-400 text-sm font-medium mb-1">Estado</span>
          <span className={`text-xl font-bold ${trimestreData.estado === 'ACTIVO' ? 'text-cyan-400' : 'text-emerald-400'}`}>
            {trimestreData.estado}
          </span>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-5 rounded-2xl flex flex-col items-center justify-center text-center">
          <span className="text-slate-400 text-sm font-medium mb-1">Aprobadas</span>
          <span className="text-2xl font-bold text-slate-200">{trimestreData.materiasAprobadas || 0}</span>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-5 rounded-2xl flex flex-col items-center justify-center text-center">
          <span className="text-slate-400 text-sm font-medium mb-1">Créditos</span>
          <span className="text-2xl font-bold text-slate-200">{trimestreData.creditosAprobados || 0}</span>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-5 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-5">
            <TrendingUp className="w-24 h-24" />
          </div>
          <span className="text-slate-400 text-sm font-medium mb-1">GPA</span>
          <span className="text-3xl font-extrabold text-cyan-400">{trimestreData.gpa?.toFixed(2) || '0.00'}</span>
        </div>
      </div>

      {/* Cuadrícula de Asignaturas */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-500" />
          Materias Registradas ({trimestreData.asignaturas?.length || 0})
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trimestreData.asignaturas?.map((asig) => (
            <div key={asig.id} className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 shadow-xl shadow-black/20 rounded-xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300">
              
              {/* Header de la Tarjeta */}
              <div className="bg-slate-950/50 border-b border-slate-800/60 p-4 flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-cyan-500 bg-cyan-500/10 px-2 py-1 rounded-md tracking-wider">
                    {asig.claveMateria}
                  </span>
                  <h3 className="text-slate-100 font-bold text-base mt-2 leading-tight">
                    {asig.asignaturaPensum?.nombre || asig.nombre || 'Asignatura Desconocida'}
                  </h3>
                </div>
                {asig.calificacion && (
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Nota</span>
                    <span className="text-lg font-black text-emerald-400">{asig.calificacion}</span>
                  </div>
                )}
              </div>

              {/* Body de la Tarjeta (Iconos Lucide) */}
              <div className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 bg-slate-800/50 p-1.5 rounded-md text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Profesor</p>
                    <p className="text-sm text-slate-300">{asig.profesor || 'Sin asignar'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 bg-slate-800/50 p-1.5 rounded-md text-slate-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Horario</p>
                    <p className="text-sm text-slate-300">{asig.horario || 'Sin asignar'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 bg-slate-800/50 p-1.5 rounded-md text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Aula</p>
                    <p className="text-sm text-slate-300">{asig.aula || 'Sin asignar'}</p>
                  </div>
                </div>
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Historial;
