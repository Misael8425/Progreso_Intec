import { useState, useEffect } from 'react';

export default function Pensum() {
  const [materias, setMaterias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/pensum', {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP status ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log("Datos recibidos en el frontend:", data);
        setMaterias(data);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error crítico al cargar el pensum:", err);
        setCargando(false);
      });
  }, []);

  const agruparPorTrimestre = (materias) => {
    return materias.reduce((grupos, materia) => {
      const trimestre = materia.trimestreSugerido || 0;
      if (!grupos[trimestre]) grupos[trimestre] = [];
      grupos[trimestre].push(materia);
      return grupos;
    }, {});
  };

  const obtenerEstiloEstado = (estado) => {
    switch (estado) {
      case 'Aprobada': return 'bg-green-950 border-green-700 text-green-100';
      case 'Reprobada': return 'bg-red-950 border-red-700 text-red-100';
      case 'Cursando': return 'bg-blue-950 border-blue-700 text-blue-100';
      default: return 'bg-slate-800 border-slate-700 text-slate-300';
    }
  };

  if (cargando) return <div className="p-10 text-white text-xl">Cargando pensum...</div>;

  const pensumAgrupado = agruparPorTrimestre(materias);
  const trimestresOrdenados = Object.keys(pensumAgrupado)
    .filter(t => t !== "0") // Ignoramos basura o el trimestre 0
    .sort((a, b) => Number(a) - Number(b));

  return (
    // 'relative block h-auto' fuerza a que respete el flujo normal de la página
    <div className="min-h-screen bg-slate-950 p-4 sm:p-8 w-full relative block h-auto">
      <div className="max-w-7xl mx-auto w-full">
        
        <div className="mb-8 block w-full relative h-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Mi Pensum</h1>
          <p className="text-slate-400">Ingeniería de Software (IDS-2020) - 14 Trimestres</p>
        </div>

        {/* El Grid: Items-start es la clave para que no colapsen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start relative w-full h-auto">
          
          {trimestresOrdenados.map((num) => (
            <div 
              key={`trimestre-${num}`} 
              // 'block relative h-auto w-full' rompe cualquier position: absolute anidado
              className="bg-slate-900 border border-slate-700 rounded-xl p-5 block relative h-auto w-full"
            >
              <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
                <h2 className="text-xl font-bold text-white">Trimestre {num}</h2>
                <span className="text-sm font-medium bg-slate-800 text-slate-300 px-2 py-1 rounded">
                  {pensumAgrupado[num].reduce((acc, m) => acc + m.creditos, 0)} CR
                </span>
              </div>

              {/* Flex-col con gap-3 asegura separación estricta entre materias */}
              <div className="flex flex-col gap-3 relative block w-full h-auto">
                {pensumAgrupado[num].map((materia) => (
                  <div 
                    key={materia.clave} 
                    className={`p-3 rounded-lg border flex flex-col relative w-full h-auto ${obtenerEstiloEstado(materia.estado)}`}
                  >
                    <div className="flex justify-between items-start mb-1 w-full">
                      <span className="font-bold text-sm">{materia.clave}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 bg-black/40 rounded">
                          {materia.creditos} CR
                        </span>
                        {materia.calificacion && (
                          <span 
                            className={`text-xs font-black px-2 py-0.5 rounded border ${
                              materia.calificacion === 'CO' 
                                ? 'bg-purple-900/60 text-purple-200 border-purple-500/50' 
                                : materia.calificacion === 'EI'
                                ? 'bg-teal-900/60 text-teal-200 border-teal-500/50'
                                : 'bg-white/10 text-white border-transparent'
                            }`}
                            title={
                              materia.calificacion === 'CO' ? 'Convalidada' : 
                              materia.calificacion === 'EI' ? 'Exonerada' : 'Calificación'
                            }
                          >
                            {materia.calificacion}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs opacity-90 truncate w-full" title={materia.nombre}>
                      {materia.nombre}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}