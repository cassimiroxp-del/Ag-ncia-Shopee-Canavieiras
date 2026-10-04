import React, { useState } from 'react';
import { Operator, ReturnReceipt, Screen } from '../types';
import { PRESET_PACKAGES, HUB_INFO } from '../data/mockData';
import { ThermalReceipt } from './ThermalReceipt';
import { WhatsAppModal } from './WhatsAppModal';
import {
  Printer,
  Barcode,
  Share2,
  RotateCcw,
  History,
  CheckCircle2,
  Sparkles,
  Package,
  User,
  Store,
  Scale,
  Copy,
  Check,
  ChevronRight,
} from 'lucide-react';

interface PrintPreviewScreenProps {
  activeOperator: Operator;
  currentReceipt: ReturnReceipt;
  onChangeReceipt: (receipt: ReturnReceipt) => void;
  onSaveAndPrint: (receipt: ReturnReceipt) => void;
  onNavigate: (screen: Screen) => void;
  historyCount: number;
}

export const PrintPreviewScreen: React.FC<PrintPreviewScreenProps> = ({
  activeOperator,
  currentReceipt,
  onChangeReceipt,
  onSaveAndPrint,
  onNavigate,
  historyCount,
}) => {
  const [isPrintingAnim, setIsPrintingAnim] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDuplicateView, setIsDuplicateView] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Generate random tracking number
  const handleGenerateTracking = () => {
    const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000);
    const tracking = `BR${randomDigits}SPX`;
    const returnId = `IDV-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const authCode = `SPX-CNV-${Math.floor(1000 + Math.random() * 9000)}-${Math.random()
      .toString(36)
      .substring(2, 5)
      .toUpperCase()}`;

    onChangeReceipt({
      ...currentReceipt,
      trackingNumber: tracking,
      returnId: returnId,
      authCode: authCode,
    });

    showToast('Novo código de rastreamento gerado!');
  };

  const handleApplyPreset = (presetIndex: number) => {
    const preset = PRESET_PACKAGES[presetIndex];
    if (!preset) return;

    const authCode = `SPX-CNV-${Math.floor(1000 + Math.random() * 9000)}-${Math.random()
      .toString(36)
      .substring(2, 5)
      .toUpperCase()}`;

    onChangeReceipt({
      ...currentReceipt,
      trackingNumber: preset.trackingNumber,
      orderNumber: preset.orderNumber,
      returnId: preset.returnId,
      customerName: preset.customerName,
      customerCpf: preset.customerCpf,
      customerPhone: preset.customerPhone,
      sellerName: preset.sellerName,
      returnReason: preset.returnReason,
      itemDescription: preset.itemDescription,
      weightKg: preset.weightKg,
      volumes: preset.volumes,
      authCode: authCode,
      createdAt: new Date().toISOString(),
    });

    showToast(`Pacote carregado: ${preset.label}`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handlePrintClick = () => {
    setIsPrintingAnim(true);

    // Save receipt to history and update count
    onSaveAndPrint({
      ...currentReceipt,
      operatorId: activeOperator.id,
      operatorName: activeOperator.name,
      printedCount: (currentReceipt.printedCount || 0) + 1,
    });

    showToast('Comprovante enviado para a impressora e salvo no Histórico!');

    // Trigger window.print
    setTimeout(() => {
      try {
        window.print();
      } catch (err) {
        console.error('Print trigger error', err);
      }
      setIsPrintingAnim(false);
    }, 400);
  };

  const handleNewReceipt = () => {
    const now = new Date();
    const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000);
    const authCode = `SPX-CNV-${Math.floor(1000 + Math.random() * 9000)}-${Math.random()
      .toString(36)
      .substring(2, 5)
      .toUpperCase()}`;

    onChangeReceipt({
      id: `RET-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      trackingNumber: `BR${randomDigits}SPX`,
      orderNumber: `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
        now.getDate()
      ).padStart(2, '0')}${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      returnId: `IDV-${Math.floor(10000000 + Math.random() * 90000000)}`,
      customerName: '',
      customerCpf: '***.***.***-**',
      customerPhone: '(73) 9',
      sellerName: 'Loja Oficial Shopee',
      returnReason: 'Arrependimento / Compra por engano',
      itemDescription: 'Produto conferido no balcão',
      weightKg: 0.35,
      volumes: 1,
      packageCondition: 'Embalagem original conferida e lacrada',
      createdAt: now.toISOString(),
      operatorId: activeOperator.id,
      operatorName: activeOperator.name,
      status: 'aguardando_coleta',
      authCode: authCode,
      printedCount: 0,
    });

    setIsDuplicateView(false);
    showToast('Novo formulário de devolução iniciado!');
  };

  const handleCopyText = () => {
    const text = `COMPROVANTE DEVOLUÇÃO SHOPEE EXPRESS CANAVIEIRAS\nRastreamento: ${currentReceipt.trackingNumber}\nCliente: ${currentReceipt.customerName}\nLoja: ${currentReceipt.sellerName}\nData: ${new Date(currentReceipt.createdAt).toLocaleString('pt-BR')}\nAutenticação: ${currentReceipt.authCode}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-medium animate-in fade-in slide-in-from-bottom-4 duration-200 border border-slate-700 no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Screen Title & Flow Navigation Context */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-4 no-print">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Terminal {HUB_INFO.terminalId}</span>
            <span>/</span>
            <span className="text-[#EE4D2D] font-semibold">
              Prévia de Impressão
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Prévia de Impressão - Comprovante de Devolução
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ponto de Coleta Canavieiras · Bipagem e emissão da 1ª via do cliente (Térmica 80mm)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('history')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <History className="w-3.5 h-3.5 text-[#EE4D2D]" />
            <span>Ver Histórico</span>
            <span className="font-mono bg-white px-1.5 py-0.2 rounded text-[11px] font-bold text-slate-700">
              {historyCount}
            </span>
          </button>

          <button
            onClick={handleNewReceipt}
            className="px-3.5 py-2 bg-orange-50 hover:bg-orange-100 text-[#EE4D2D] text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 border border-orange-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Novo Pacote</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form / Scanner on Left, Thermal Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Intake Form & Barcode Scanner Simulator */}
        <div className="lg:col-span-7 space-y-6 no-print">
          {/* Quick Presets for Demo / Rapid Intake */}
          <div className="bg-gradient-to-r from-orange-50/80 to-amber-50/60 p-4 rounded-2xl border border-orange-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#EE4D2D] flex items-center gap-1 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Simular Bipagem Rápida (Presets)
              </span>
              <span className="text-[11px] text-slate-500">
                Selecione para preenchimento instantâneo
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PRESET_PACKAGES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(idx)}
                  className="p-2.5 bg-white hover:bg-orange-50 text-left rounded-xl border border-orange-100 hover:border-[#EE4D2D] text-xs transition-all shadow-xs group"
                >
                  <p className="font-bold text-slate-800 text-[11px] group-hover:text-[#EE4D2D] truncate">
                    {preset.label}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                    {preset.trackingNumber}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Intake Form Container */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-[#EE4D2D]" />
                Dados do Pacote & Devolução
              </h2>
              <div className="text-[11px] text-slate-500 font-mono">
                ID Sistema: {currentReceipt.id}
              </div>
            </div>

            {/* Tracking Code & Scanner Row */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Código de Rastreamento SPX / Devolução
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Barcode className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={currentReceipt.trackingNumber}
                    onChange={(e) =>
                      onChangeReceipt({
                        ...currentReceipt,
                        trackingNumber: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="BR260XXXXXXXXSPX"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EE4D2D] focus:border-transparent uppercase"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGenerateTracking}
                  title="Gerar novo código aleatório"
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5"
                >
                  <Barcode className="w-3.5 h-3.5" />
                  <span>Gerar Código</span>
                </button>
              </div>
            </div>

            {/* Customer Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Nome do Comprador
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    value={currentReceipt.customerName}
                    onChange={(e) =>
                      onChangeReceipt({
                        ...currentReceipt,
                        customerName: e.target.value,
                      })
                    }
                    placeholder="Ex: Fernanda Santos"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  CPF Mascarado
                </label>
                <input
                  type="text"
                  value={currentReceipt.customerCpf}
                  onChange={(e) =>
                    onChangeReceipt({
                      ...currentReceipt,
                      customerCpf: e.target.value,
                    })
                  }
                  placeholder="***.000.000-**"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Telefone / WhatsApp
                </label>
                <input
                  type="text"
                  value={currentReceipt.customerPhone}
                  onChange={(e) =>
                    onChangeReceipt({
                      ...currentReceipt,
                      customerPhone: e.target.value,
                    })
                  }
                  placeholder="(73) 99812-4321"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  ID Devolução Shopee
                </label>
                <input
                  type="text"
                  value={currentReceipt.returnId}
                  onChange={(e) =>
                    onChangeReceipt({
                      ...currentReceipt,
                      returnId: e.target.value,
                    })
                  }
                  placeholder="IDV-98421034"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]"
                />
              </div>
            </div>

            {/* Seller & Return Reason */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Loja Vendedora Parceira
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Store className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    value={currentReceipt.sellerName}
                    onChange={(e) =>
                      onChangeReceipt({
                        ...currentReceipt,
                        sellerName: e.target.value,
                      })
                    }
                    placeholder="Ex: Moda Bahia Oficial"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Motivo da Devolução
                </label>
                <select
                  value={currentReceipt.returnReason}
                  onChange={(e) =>
                    onChangeReceipt({
                      ...currentReceipt,
                      returnReason: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]"
                >
                  <option value="Arrependimento / Compra por engano">
                    Arrependimento / Compra por engano
                  </option>
                  <option value="Produto com defeito / não funciona">
                    Produto com defeito / não funciona
                  </option>
                  <option value="Tamanho / Cor incorreta">
                    Tamanho / Cor incorreta
                  </option>
                  <option value="Item diferente do anunciado">
                    Item diferente do anunciado
                  </option>
                  <option value="Embalagem violada no recebimento">
                    Embalagem violada no recebimento
                  </option>
                  <option value="Item faltante ou incompleto">
                    Item faltante ou incompleto
                  </option>
                </select>
              </div>
            </div>

            {/* Description & Weight */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Descrição do Item
                </label>
                <input
                  type="text"
                  value={currentReceipt.itemDescription}
                  onChange={(e) =>
                    onChangeReceipt({
                      ...currentReceipt,
                      itemDescription: e.target.value,
                    })
                  }
                  placeholder="Ex: Vestido Linho Midi Coral Tam M"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Peso Estimado (kg)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Scale className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="number"
                    step="0.05"
                    min="0.05"
                    max="30"
                    value={currentReceipt.weightKg}
                    onChange={(e) =>
                      onChangeReceipt({
                        ...currentReceipt,
                        weightKg: parseFloat(e.target.value) || 0.1,
                      })
                    }
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]"
                  />
                </div>
              </div>
            </div>

            {/* Package Condition */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Condição do Pacote na Recepção
              </label>
              <input
                type="text"
                value={currentReceipt.packageCondition}
                onChange={(e) =>
                  onChangeReceipt({
                    ...currentReceipt,
                    packageCondition: e.target.value,
                  })
                }
                placeholder="Ex: Embalagem original conferida e lacrada com fita Shopee"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]"
              />
            </div>
          </div>

          {/* Action Bar (under form for convenience) */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handlePrintClick}
              disabled={isPrintingAnim}
              className="flex-1 min-w-[200px] py-3.5 px-6 bg-[#EE4D2D] hover:bg-[#d83f21] active:scale-[0.99] text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-5 h-5" />
              <span>
                {isPrintingAnim ? 'Imprimindo Térmica...' : 'Imprimir Comprovante'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowWhatsAppModal(true)}
              className="py-3.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition-colors border border-emerald-200 flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleCopyText}
              className="py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        {/* Right Side: Live Thermal Receipt Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          {/* Header Controls for Preview */}
          <div className="w-full max-w-[360px] mb-3 flex items-center justify-between no-print">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">
                Prévia do Papel Térmico (80mm)
              </span>
            </div>

            <button
              onClick={() => setIsDuplicateView(!isDuplicateView)}
              className={`text-[11px] font-semibold px-2 py-1 rounded transition-colors ${
                isDuplicateView
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isDuplicateView ? '2ª Via (Ativa)' : 'Alternar 2ª Via'}
            </button>
          </div>

          {/* Thermal Receipt Visual Paper */}
          <div
            className={`w-full flex justify-center ${
              isPrintingAnim ? 'animate-receipt-feed' : ''
            }`}
          >
            <ThermalReceipt
              receipt={currentReceipt}
              showDuplicateBadge={isDuplicateView}
            />
          </div>

          {/* Print instructions card below preview */}
          <div className="w-full max-w-[360px] mt-4 p-3 bg-slate-100/90 rounded-xl border border-slate-200 text-center text-xs text-slate-600 no-print">
            <p className="font-semibold text-slate-800">
              Formato Padronizado Shopee Express
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Compatível com bobinas térmicas de 80mm e 58mm (ESC/POS ou impressoras padrão).
            </p>
          </div>
        </div>
      </div>

      {/* WhatsApp Share Modal */}
      <WhatsAppModal
        receipt={currentReceipt}
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
      />
    </div>
  );
};
