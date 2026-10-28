import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Pensum from './pages/Pensum';
import Historial from './pages/Historial';
import Simulador from './pages/Simulador';
import Volante from './pages/Volante';
import Dashboard from './pages/Dashboard';
import Finanzas from './pages/Finanzas';
import Electivas from './pages/Electivas';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen pb-20 md:pb-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-200">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pensum" element={<Pensum />} />
            <Route path="/historial" element={<Historial />} />
            <Route path="/simulador" element={<Simulador />} />
            <Route path="/volante" element={<Volante />} />
            <Route path="/finanzas" element={<Finanzas />} />
            <Route path="/electivas" element={<Electivas />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
