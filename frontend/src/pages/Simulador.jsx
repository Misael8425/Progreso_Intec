import React, { useState, useEffect } from 'react';
import { obtenerHistorialSimulaciones, calcularSimulacion } from '../services/api';
import { Loader2, Calculator, Plus, Trash2, TrendingUp, History } from 'lucide-react';

const Simulador = () => {
  const [historial, setHistorial] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  
  // Estado para el formulario de materias
  const [materias, setMaterias] = useState([]);
  const [creditos, setCreditos] = useState('');
  const [calificacion, setCalificacion] = useState('A');
  const [loadingCalcular, setLoadingCalcular] = useState(false);
  const [errorForm, setErrorForm] = useState('');

  const cargarHistorial = async () => {
    try {
      setLoadingHistory(true);
      const data = await obtenerHistorialSimulaciones();
      setHistorial(Array.isArray(data) ? data : data.value || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    cargarHistorial();
  }, []);

  const agregarMateria = () => {
    const numCreditos = parseInt(creditos);
    if (isNaN(numCreditos) || numCreditos <= 0) {
      setErrorForm('Por favor ingrese una cantidad de créditos válida.');
      return;
    }
    
    setMaterias([...materias, { id: Date.now(), creditos: numCreditos, calificacionLiteral: calificacion }]);
    setCreditos('');
    setCalificacion('A');
    setErrorForm('');
  };

  const eliminarMateria = (id) => {
    setMaterias(materias.filter(m => m.id !== id));
  };

  const procesarCalculo = async () => {
    if (materias.length === 0) {
      setErrorForm('Debe agregar al menos una materia para calcular.');
      return;
    }

    setLoadingCalcular(true);
    setErrorForm('');
    try {
      // Removemos el 'id' temporal al enviar al backend
      const payload = materias.map(m => ({
        creditos: m.creditos,
        calificacionLiteral: m.calificacionLiteral
      }));
      
      await calcularSimulacion(payload);
      
      // Limpiamos el form y recargamos historial
      setMaterias([]);
      cargarHistorial();
    } catch (err) {
      setErrorForm(err.message);
    } finally {
      setLoadingCalcular(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto">
      <header>
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
          Simulador de Índice
        </h1>
        <p className="text-slate-400">Proyecta tu desempeño añadiendo materias temporales.</p>
      </header>

      {/* CALCULADORA (FORMULARIO) */}
      <section className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 shadow-xl shadow-black/20 rounded-xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-cyan-500/10 p-2.5 rounded-xl border border-cyan-500/20">
            <Calculator className="w-6 h-6 text-cyan-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-100">Nueva Proyección</h2>
        </div>

        {errorForm && (
          <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-medium">
            {errorForm}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end mb-8">
          <div className="md:col-span-5">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Créditos</label>
            <input 
              type="number" 
              min="1"
              value={creditos}
              onChange={(e) => setCreditos(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/50 text-slate-200 rounded-xl px-4 py-3 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
              placeholder="Ej: 4"
            />
          </div>
          <div className="md:col-span-5">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Calificación Esperada</label>
            <select 
              value={calificacion}
              onChange={(e) => setCalificacion(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/50 text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all appearance-none"
            >
              <option value="A+">A+ (4.00)</option>
              <option value="A">A (3.75)</option>
              <option value="B+">B+ (3.50)</option>
              <option value="B">B (3.00)</option>
              <option value="C+">C+ (2.50)</option>
              <option value="C">C (2.00)</option>
              <option value="D">D (1.00)</option>
              <option value="F">F (0.00)</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <button 
              onClick={agregarMateria}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-4 py-3 rounded-xl transition-all font-bold"
            >
              <Plus className="w-5 h-5" />
              <span className="md:hidden">Agregar</span>
            </button>
          </div>
        </div>

        {/* Lista de materias a calcular */}
        {materias.length > 0 && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-slate-700/50">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/80 text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Créditos</th>
                  <th className="px-4 py-3 font-semibold">Calificación</th>
                  <th className="px-4 py-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/30">
                {materias.map((m, i) => (
                  <tr key={m.id} className="text-slate-300">
                    <td className="px-4 py-3 font-medium">Asignatura {i+1} ({m.creditos} Cr)</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded font-bold text-xs border border-cyan-500/30">
                        {m.calificacionLiteral}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => eliminarMateria(m.id)} className="text-slate-400 hover:text-rose-400 p-1 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button 
          onClick={procesarCalculo}
          disabled={materias.length === 0 || loadingCalcular}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingCalcular ? <Loader2 className="w-5 h-5 animate-spin" /> : <TrendingUp className="w-5 h-5" />}
          Calcular Índice y Guardar
        </button>
      </section>

      {/* HISTORIAL DE SIMULACIONES */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <History className="w-6 h-6 text-slate-400" />
          <h2 className="text-2xl font-bold text-slate-200">Historial de Proyecciones</h2>
        </div>

        {loadingHistory ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
          </div>
        ) : historial.length === 0 ? (
          <div className="text-center p-10 bg-slate-800/20 rounded-3xl border border-slate-700/50">
            <p className="text-slate-400">Aún no has guardado ninguna simulación.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {historial.map((sim, index) => (
              <div key={sim.id} className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 shadow-xl shadow-black/20 rounded-xl p-6 relative overflow-hidden group hover:border-cyan-500/50 transition-all">
                
                {index === 0 && (
                  <div className="absolute top-0 right-0 bg-cyan-500 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-bl-xl shadow-sm">
                    Más Reciente
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Resultado del Índice</p>
                    <div className="text-4xl font-extrabold text-white drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                      {sim.indiceCalculado?.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 mb-1">ID: #{sim.id}</p>
                    <p className="text-xs text-slate-400 font-medium">
                      {new Date(sim.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-slate-700/50 pt-4">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">Materias Simuladas ({sim.asignaturas?.length || 0})</p>
                  <div className="flex flex-wrap gap-2">
                    {sim.asignaturas?.map(a => (
                      <span key={a.id} className="inline-flex items-center gap-1.5 bg-slate-800 text-slate-300 border border-slate-700 px-2 py-1 rounded text-xs">
                        {a.creditos} Cr
                        <span className="text-slate-600">|</span>
                        <span className="text-cyan-400 font-bold">{a.calificacionLiteral}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default Simulador;
