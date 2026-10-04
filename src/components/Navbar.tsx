import React from 'react';
import { Operator, Screen } from '../types';
import { Printer, ShieldAlert, LogOut, FileText, History, KeyRound } from 'lucide-react';

interface NavbarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  activeOperator: Operator | null;
  onLogout: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  activeOperator,
  onLogout,
  historyCount,
}) => {
  return (
    <header className="no-print sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element brand mark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate(activeOperator ? 'print_preview' : 'login')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#EE4D2D] flex items-center justify-center text-white font-black text-base shadow-sm group-hover:bg-[#d83f21] transition-colors">
              S
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 block leading-tight">
                Shopee Express <span className="text-[#EE4D2D]">Canavieiras</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Hub BA-CNV-01 · Ponto Autorizado
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (single-line, clean) */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onNavigate('login')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              currentScreen === 'login'
                ? 'bg-orange-50 text-[#EE4D2D]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Login PIN</span>
          </button>

          <button
            onClick={() => onNavigate('print_preview')}
            disabled={!activeOperator}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              currentScreen === 'print_preview'
                ? 'bg-orange-50 text-[#EE4D2D]'
                : activeOperator
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                : 'text-slate-400 cursor-not-allowed opacity-60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Prévia de Impressão</span>
          </button>

          <button
            onClick={() => onNavigate('history')}
            disabled={!activeOperator}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              currentScreen === 'history'
                ? 'bg-orange-50 text-[#EE4D2D]'
                : activeOperator
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                : 'text-slate-400 cursor-not-allowed opacity-60'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Histórico</span>
            {historyCount > 0 && (
              <span className="text-[10px] font-mono tabular-nums px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full font-bold">
                {historyCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Operator & Primary Action */}
        <div className="flex items-center gap-2 sm:gap-3">
          {activeOperator ? (
            <div className="flex items-center gap-2">
              <div className="text-right hidden md:block">
                <p className="text-xs font-semibold text-slate-800 leading-tight">
                  {activeOperator.name}
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  {activeOperator.badgeNumber} · Turno {activeOperator.shift}
                </p>
              </div>

              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: activeOperator.avatarColor }}
              >
                {activeOperator.name.charAt(0)}
              </div>

              <button
                onClick={onLogout}
                title="Bloquear / Trocar PIN"
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Sair</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="font-medium">Terminal Bloqueado</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
