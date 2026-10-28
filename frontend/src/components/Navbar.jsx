import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Clock, LayoutDashboard, Calculator, CalendarDays, Wallet, GraduationCap } from 'lucide-react';

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    `flex flex-col md:flex-row items-center gap-1 md:gap-2 px-1.5 min-[400px]:px-2.5 md:px-4 py-2 rounded-xl transition-all duration-300 ${
      isActive
        ? 'text-cyan-400 bg-cyan-500/10 font-medium shadow-[0_0_15px_rgba(34,211,238,0.2)]'
        : 'text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/5 font-medium'
    }`;

  return (
    <nav className="fixed bottom-0 left-0 w-full md:sticky md:top-0 z-50 bg-slate-900/80 backdrop-blur-md border-t md:border-t-0 md:border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around md:justify-start md:gap-4 py-3 md:py-4 overflow-x-auto">
          <NavLink to="/" className="hidden md:flex items-center mr-8 group">
            <LayoutDashboard className="w-6 h-6 text-cyan-500 mr-2 group-hover:text-cyan-400 transition-colors" />
            <span className="font-bold text-xl tracking-tight text-slate-100 group-hover:text-white transition-colors">Progreso INTEC</span>
          </NavLink>
          
          <NavLink to="/" className={`md:hidden ${linkClass({ isActive: window.location.pathname === '/' })}`}>
             <LayoutDashboard className="w-5 h-5 md:w-4 md:h-4" />
             <span className="text-[10px] md:text-sm font-medium">Inicio</span>
          </NavLink>

          <NavLink to="/pensum" className={linkClass}>
            <BookOpen className="w-5 h-5 md:w-4 md:h-4" />
            <span className="text-[10px] md:text-sm font-medium">Mi Pensum</span>
          </NavLink>

          <NavLink to="/historial" className={linkClass}>
            <Clock className="w-5 h-5 md:w-4 md:h-4" />
            <span className="text-[10px] md:text-sm font-medium">Mi Historial</span>
          </NavLink>

          <NavLink to="/simulador" className={linkClass}>
            <Calculator className="w-5 h-5 md:w-4 md:h-4" />
            <span className="text-[10px] md:text-sm font-medium">Simulador</span>
          </NavLink>

          <NavLink to="/volante" className={linkClass}>
            <CalendarDays className="w-5 h-5 md:w-4 md:h-4" />
            <span className="text-[10px] md:text-sm font-medium">Mi Volante</span>
          </NavLink>

          <NavLink to="/finanzas" className={linkClass}>
            <Wallet className="w-5 h-5 md:w-4 md:h-4" />
            <span className="text-[10px] md:text-sm font-medium">Mis Finanzas</span>
          </NavLink>

          <NavLink to="/electivas" className={linkClass}>
            <GraduationCap className="w-5 h-5 md:w-4 md:h-4" />
            <span className="text-[10px] md:text-sm font-medium">Electivas</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
