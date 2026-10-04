import React, { useState } from 'react';
import { ReturnReceipt, Operator } from '../types';
import { HUB_INFO } from '../data/mockData';
import { Truck, Printer, CheckCircle, X } from 'lucide-react';

interface ManifestModalProps {
  receipts: ReturnReceipt[];
  activeOperator: Operator;
  isOpen: boolean;
  onClose: () => void;
  onMarkAllCollected: (driverName: string) => void;
}

export const ManifestModal: React.FC<ManifestModalProps> = ({
  receipts,
  activeOperator,
  isOpen,
  onClose,
  onMarkAllCollected,
}) => {
  const [driverName, setDriverName] = useState('Marcos Vinicius (SPX Sul da Bahia)');
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const pendingPackages = receipts.filter((r) => r.status === 'aguardando_coleta');
  const totalWeight = pendingPackages.reduce((acc, r) => acc + r.weightKg, 0);

  const handleConfirmPickup = () => {
    onMarkAllCollected(driverName);
    setIsDone(true);
    setTimeout(() => {
      setIsDone(false);
      onClose();
    }, 1200);
  };

  const handlePrintManifest = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EE4D2D] flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">
                Manifesto de Transferência / Coleta SPX
              </h3>
              <p className="text-[11px] text-slate-300">
                Shopee Express · Hub Canavieiras ({HUB_INFO.code})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p className="text-[10px] uppercase font-bold text-slate-500">Pacotes Prontos</p>
              <p className="text-xl font-black text-slate-900 font-mono mt-0.5">
                {pendingPackages.length}
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p className="text-[10px] uppercase font-bold text-slate-500">Peso Total</p>
              <p className="text-xl font-black text-slate-900 font-mono mt-0.5">
                {totalWeight.toFixed(2)} kg
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p className="text-[10px] uppercase font-bold text-slate-500">Operador Responsável</p>
              <p className="text-xs font-bold text-slate-800 truncate mt-1">
                {activeOperator.name}
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p className="text-[10px] uppercase font-bold text-slate-500">Data / Turno</p>
              <p className="text-xs font-bold text-slate-800 mt-1">
                {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Motorista / Transportador Shopee Express
            </label>
            <input
              type="text"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]"
              placeholder="Nome do motorista da van ou caminhão SPX"
            />
          </div>

          {/* List of packages in manifest */}
          <div>
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Relação de Volumes para Coleta ({pendingPackages.length})
            </p>
            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="p-2.5">Código Rastreio</th>
                    <th className="p-2.5">Cliente</th>
                    <th className="p-2.5">Loja</th>
                    <th className="p-2.5 text-right">Peso</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingPackages.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-slate-400">
                        Nenhum pacote pendente de coleta no momento.
                      </td>
                    </tr>
                  ) : (
                    pendingPackages.map((pkg) => (
                      <tr key={pkg.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-mono font-bold text-slate-900">
                          {pkg.trackingNumber}
                        </td>
                        <td className="p-2.5 text-slate-700 truncate max-w-[140px]">
                          {pkg.customerName}
                        </td>
                        <td className="p-2.5 text-slate-600 truncate max-w-[140px]">
                          {pkg.sellerName}
                        </td>
                        <td className="p-2.5 text-right font-mono font-medium text-slate-800">
                          {pkg.weightKg.toFixed(2)} kg
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handlePrintManifest}
            className="py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Relação</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="py-2.5 px-4 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmPickup}
              disabled={pendingPackages.length === 0 || isDone}
              className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              {isDone ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Coleta Confirmada!</span>
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4" />
                  <span>Dar Baixa na Coleta SPX</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
