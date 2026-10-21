import React, { useEffect, useState } from 'react';
import { obtenerVolanteActivo } from '../services/api';
import { Loader2, CalendarDays, User, Clock, MapPin, BookOpen } from 'lucide-react';

const Volante = () => {
  const [volante, setVolante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    obtenerVolanteActivo()
      .then(data => {
        setVolante(data);
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
        <p className="text-slate-400 font-medium animate-pulse">Cargando volante activo...</p>
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

  if (!volante || !volante.id) {
    return (
      <div className="text-center p-12 bg-slate-800/20 rounded-3xl border border-slate-700/50">
        <p className="text-slate-400 text-lg">No hay ningún volante activo en este momento.</p>
      </div>
    );
  }

  // Agrupando los horarios por día de la semana para mejor lectura, opcional pero muy útil.
  // El backend devuelve un arreglo plano de horarios.
  const diasOrden = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const horariosAgrupados = volante.horarios?.reduce((acc, h) => {
    if (!acc[h.dia]) acc[h.dia] = [];
    acc[h.dia].push(h);
    return acc;
  }, {});

  // Ordenar los días lógicamente
  const diasDisponibles = Object.keys(horariosAgrupados || {}).sort((a, b) => diasOrden.indexOf(a) - diasOrden.indexOf(b));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto">
      <header className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="bg-cyan-500/20 p-3 rounded-2xl border border-cyan-500/30 self-start">
            <CalendarDays className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-1">
              Volante de Selección
            </h1>
            <p className="text-slate-300 font-medium text-lg flex items-center gap-2">
              Periodo Activo: <span className="text-cyan-400 font-bold">{volante.periodo}</span>
            </p>
          </div>
        </div>
      </header>

      <div className="space-y-8">
        {diasDisponibles.map(dia => (
          <section key={dia} className="space-y-4">
            <h2 className="text-xl font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
              {dia}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {horariosAgrupados[dia].map(horario => (
                <div 
                  key={horario.id} 
                  className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 hover:border-cyan-500/40 rounded-2xl p-5 shadow-lg transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-slate-900 p-2 rounded-lg border border-slate-700">
                        <BookOpen className="w-4 h-4 text-slate-300" />
                      </div>
                      <h3 className="font-extrabold text-lg text-slate-100 tracking-tight">
                        {horario.claveMateria}
                      </h3>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-xs font-bold text-cyan-400 tracking-wider">{horario.horas}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-300">
                      <User className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium leading-tight">{horario.profesor}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-bold bg-slate-900/50 px-2 py-1 rounded-md border border-slate-800 text-slate-200">
                        Aula {horario.aula}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Volante;
