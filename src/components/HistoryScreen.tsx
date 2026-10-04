import React, { useState, useMemo } from 'react';
import { Operator, ReturnReceipt, ReturnStatus, Screen } from '../types';
import { HUB_INFO } from '../data/mockData';
import { ThermalReceipt } from './ThermalReceipt';
import { WhatsAppModal } from './WhatsAppModal';
import { ManifestModal } from './ManifestModal';
import {
  Search,
  Filter,
  Printer,
  Share2,
  PlusCircle,
  Truck,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  X,
  FileSpreadsheet,
} from 'lucide-react';

interface HistoryScreenProps {
  receipts: ReturnReceipt[];
  activeOperator: Operator;
  onNavigate: (screen: Screen) => void;
  onSelectReceiptForPreview: (receipt: ReturnReceipt) => void;
  onUpdateReceiptStatus: (receiptId: string, status: ReturnStatus, driverName?: string) => void;
  onMarkAllCollected: (driverName: string) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  receipts,
  activeOperator,
  onNavigate,
  onSelectReceiptForPreview,
  onUpdateReceiptStatus,
  onMarkAllCollected,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ReturnStatus>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'yesterday'>('all');
  const [selectedReceiptForModal, setSelectedReceiptForModal] = useState<ReturnReceipt | null>(null);
  const [whatsAppReceipt, setWhatsAppReceipt] = useState<ReturnReceipt | null>(null);
  const [isManifestOpen, setIsManifestOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // Filtered receipts
  const filteredReceipts = useMemo(() => {
    return receipts.filter((item) => {
      // Search text
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matches =
          item.trackingNumber.toLowerCase().includes(query) ||
          item.customerName.toLowerCase().includes(query) ||
          item.sellerName.toLowerCase().includes(query) ||
          item.returnId.toLowerCase().includes(query) ||
          item.authCode.toLowerCase().includes(query);
        if (!matches) return false;
      }

      // Status
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }

      // Date
      if (dateFilter !== 'all') {
        const itemDate = new Date(item.createdAt);
        const today = new Date();
        const isToday =
          itemDate.getDate() === today.getDate() &&
          itemDate.getMonth() === today.getMonth() &&
          itemDate.getFullYear() === today.getFullYear();

        if (dateFilter === 'today' && !isToday) return false;

        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        const isYesterday =
          itemDate.getDate() === yesterday.getDate() &&
          itemDate.getMonth() === yesterday.getMonth() &&
          itemDate.getFullYear() === yesterday.getFullYear();

        if (dateFilter === 'yesterday' && !isYesterday) return false;
      }

      return true;
    });
  }, [receipts, searchTerm, statusFilter, dateFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = receipts.length;
    const pending = receipts.filter((r) => r.status === 'aguardando_coleta').length;
    const collected = receipts.filter((r) => r.status === 'coletado_spx').length;
    const totalWeight = receipts.reduce((acc, r) => acc + r.weightKg, 0);

    return { total, pending, collected, totalWeight };
  }, [receipts]);

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'ID_Registro',
      'Codigo_Rastreio',
      'ID_Devolucao',
      'Data_Hora',
      'Cliente',
      'CPF',
      'Telefone',
      'Vendedor',
      'Motivo',
      'Item',
      'Peso_kg',
      'Operador',
      'Status',
      'Autenticacao',
    ];

    const rows = filteredReceipts.map((r) => [
      r.id,
      r.trackingNumber,
      r.returnId,
      r.createdAt,
      `"${r.customerName.replace(/"/g, '""')}"`,
      r.customerCpf,
      r.customerPhone,
      `"${r.sellerName.replace(/"/g, '""')}"`,
      `"${r.returnReason.replace(/"/g, '""')}"`,
      `"${r.itemDescription.replace(/"/g, '""')}"`,
      r.weightKg,
      `"${r.operatorName}"`,
      r.status,
      r.authCode,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Shopee_Canavieiras_Devolucoes_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Relatório CSV exportado com sucesso!');
  };

  const handlePrintReceiptDirect = (receipt: ReturnReceipt) => {
    setSelectedReceiptForModal(receipt);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Toast Notification */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-medium animate-in fade-in slide-in-from-bottom-4 duration-200 border border-slate-700 no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Screen Title & Top Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-4 no-print">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>{HUB_INFO.name}</span>
            <span>/</span>
            <span className="text-[#EE4D2D] font-semibold">Histórico de Devoluções</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Histórico de Comprovantes & Devoluções
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro geral de volumes recebidos, conferidos e transferidos em Canavieiras - BA
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('print_preview')}
            className="py-2.5 px-4 bg-[#EE4D2D] hover:bg-[#d83f21] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Novo Comprovante</span>
          </button>

          <button
            onClick={() => setIsManifestOpen(true)}
            className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Truck className="w-4 h-4 text-orange-400" />
            <span>Manifesto SPX</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="py-2.5 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 border border-slate-200"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 no-print">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Total Recebidos</span>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono tabular-nums">
            {stats.total}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Comprovantes emitidos no Hub
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-orange-200/80 shadow-xs bg-gradient-to-br from-white to-orange-50/30">
          <div className="flex items-center justify-between text-amber-700 text-xs font-medium mb-1">
            <span>Aguardando Coleta SPX</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-[#EE4D2D] font-mono tabular-nums">
            {stats.pending}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Pacotes prontos para a van/caminhão
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-xs bg-gradient-to-br from-white to-emerald-50/30">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-medium mb-1">
            <span>Coletados / Transferidos</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-700 font-mono tabular-nums">
            {stats.collected}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Despachados para triagem Shopee
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Peso Total Acumulado</span>
            <Truck className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono tabular-nums">
            {stats.totalWeight.toFixed(2)}{' '}
            <span className="text-sm font-semibold text-slate-500">kg</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Média {(stats.totalWeight / (stats.total || 1)).toFixed(2)} kg/volume
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between no-print">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por código de rastreamento, cliente, vendedor ou autenticação..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EE4D2D] focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls (Segmented Tabs) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({receipts.length})
            </button>
            <button
              onClick={() => setStatusFilter('aguardando_coleta')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                statusFilter === 'aguardando_coleta'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Aguardando ({stats.pending})
            </button>
            <button
              onClick={() => setStatusFilter('coletado_spx')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                statusFilter === 'coletado_spx'
                  ? 'bg-white text-emerald-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Coletados ({stats.collected})
            </button>
          </div>

          {/* Date Selector */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]"
          >
            <option value="all">Todas as Datas</option>
            <option value="today">Apenas Hoje</option>
            <option value="yesterday">Ontem</option>
          </select>
        </div>
      </div>

      {/* Main Receipts Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden no-print">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Rastreamento SPX</th>
                <th className="py-3.5 px-4">Data / Hora</th>
                <th className="py-3.5 px-4">Cliente & CPF</th>
                <th className="py-3.5 px-4">Loja & Motivo</th>
                <th className="py-3.5 px-4 text-center">Peso</th>
                <th className="py-3.5 px-4">Operador</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReceipts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-sm text-slate-600">
                      Nenhum registro encontrado
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Tente alterar os filtros de busca ou cadastre uma nova devolução.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredReceipts.map((receipt) => {
                  const dateObj = new Date(receipt.createdAt);
                  const isPending = receipt.status === 'aguardando_coleta';

                  return (
                    <tr
                      key={receipt.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Tracking */}
                      <td className="py-3 px-4 font-mono">
                        <div className="font-bold text-slate-900 group-hover:text-[#EE4D2D] transition-colors">
                          {receipt.trackingNumber}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {receipt.returnId}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        <div className="font-medium text-slate-800">
                          {dateObj.toLocaleDateString('pt-BR')}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {dateObj.toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 truncate max-w-[150px]">
                          {receipt.customerName || 'Cliente Balcão'}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {receipt.customerCpf}
                        </div>
                      </td>

                      {/* Seller & Reason */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800 truncate max-w-[150px]">
                          {receipt.sellerName}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                          {receipt.returnReason}
                        </div>
                      </td>

                      {/* Weight */}
                      <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-700">
                        {receipt.weightKg.toFixed(2)} kg
                      </td>

                      {/* Operator */}
                      <td className="py-3 px-4 text-slate-700 text-[11px]">
                        <span className="font-medium">{receipt.operatorName}</span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        {isPending ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Aguardando SPX
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Coletado
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedReceiptForModal(receipt)}
                            title="Visualizar Comprovante Térmico"
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handlePrintReceiptDirect(receipt)}
                            title="Reimprimir Comprovante"
                            className="p-1.5 text-slate-600 hover:text-[#EE4D2D] hover:bg-orange-50 rounded-lg transition-colors"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setWhatsAppReceipt(receipt)}
                            title="Compartilhar WhatsApp"
                            className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              onSelectReceiptForPreview(receipt);
                              onNavigate('print_preview');
                            }}
                            title="Abrir na tela de Prévia"
                            className="text-[11px] font-semibold text-[#EE4D2D] hover:underline px-1.5 py-1"
                          >
                            Editar / Prévia
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt View & Re-print Modal */}
      {selectedReceiptForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-slate-900 px-5 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-[#EE4D2D]" />
                <h3 className="font-bold text-sm">Visualização de Comprovante</h3>
              </div>
              <button
                onClick={() => setSelectedReceiptForModal(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-100 flex justify-center max-h-[65vh] overflow-y-auto">
              <ThermalReceipt
                receipt={selectedReceiptForModal}
                showDuplicateBadge={selectedReceiptForModal.printedCount > 1}
              />
            </div>

            <div className="p-4 bg-white border-t border-slate-200 flex gap-2 justify-end">
              <button
                onClick={() => setWhatsAppReceipt(selectedReceiptForModal)}
                className="py-2 px-3 bg-emerald-50 text-emerald-700 font-semibold text-xs rounded-xl hover:bg-emerald-100 flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  window.print();
                }}
                className="py-2 px-4 bg-[#EE4D2D] hover:bg-[#d83f21] text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Reimprimir Térmica (80mm)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Modal */}
      {whatsAppReceipt && (
        <WhatsAppModal
          receipt={whatsAppReceipt}
          isOpen={!!whatsAppReceipt}
          onClose={() => setWhatsAppReceipt(null)}
        />
      )}

      {/* Manifest Modal */}
      <ManifestModal
        receipts={receipts}
        activeOperator={activeOperator}
        isOpen={isManifestOpen}
        onClose={() => setIsManifestOpen(false)}
        onMarkAllCollected={onMarkAllCollected}
      />
    </div>
  );
};
