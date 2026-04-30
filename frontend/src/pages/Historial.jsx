import React, { useEffect, useState } from 'react';
import { obtenerHistorialTrimestres } from '../services/api';
import { Loader2, CalendarDays, TrendingUp } from 'lucide-react';

const Historial = () => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    obtenerHistorialTrimestres()
      .then(data => {
        const list = Array.isArray(data) ? data : data.value || [];
        setHistorial(list);
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
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium animate-pulse">Cargando récord académico...</p>
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto">
      <header>
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
          Récord Oficial
        </h1>
        <p className="text-slate-400">Historial académico detallado por trimestre.</p>
      </header>

      <div className="space-y-6">
        {historial.map((trimestre, index) => (
          <div key={trimestre.id} className="bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl relative">
            
            {/* Si es el más reciente, ponerle un badge visual */}
            {index === 0 && (
              <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl">
                Actual
              </div>
            )}

            <div className="p-6 border-b border-slate-800/80 bg-slate-800/20 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-500/20 p-2.5 rounded-xl border border-indigo-500/30">
                  <CalendarDays className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-slate-100">{trimestre.periodo}</h2>
                  <p className="text-sm font-medium text-slate-400">Año {trimestre.anio}</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-900/60 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-4">Clave</th>
                    <th className="px-6 py-4 w-full">Asignatura</th>
                    <th className="px-6 py-4 text-center">Créditos</th>
                    <th className="px-6 py-4 text-center">Nota</th>
                    <th className="px-6 py-4 text-right">Puntos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-slate-300">
                  {trimestre.asignaturas?.map((asig) => (
                    <tr key={asig.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-200">{asig.claveMateria}</td>
                      <td className="px-6 py-4 text-sm whitespace-normal min-w-[200px]">
                        {asig.asignaturaPensum?.nombre || 'Desconocida'}
                      </td>
                      <td className="px-6 py-4 text-center font-medium">
                        {asig.asignaturaPensum?.creditos || 0}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-2 py-1 rounded font-bold text-xs ${
                          ['A+', 'A', 'B+', 'B', 'C+', 'C'].includes(asig.calificacion) 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {asig.calificacion}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-indigo-300">
                        {asig.puntos}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-slate-900/80 border-t border-slate-800/80 flex flex-col sm:flex-row justify-end items-end gap-6">
              <div className="flex flex-col items-end">
                <span className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Índice Trimestral</span>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <span className="text-3xl font-extrabold text-slate-100">{trimestre.indiceTrimestral?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
              
              {trimestre.indiceAcumulado && (
                <div className="flex flex-col items-end pl-6 sm:border-l border-slate-700/50">
                  <span className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Índice Acumulado</span>
                  <span className="text-2xl font-bold text-slate-300">{trimestre.indiceAcumulado?.toFixed(2)}</span>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Historial;
