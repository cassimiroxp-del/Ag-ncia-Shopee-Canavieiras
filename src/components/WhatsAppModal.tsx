import React, { useState } from 'react';
import { ReturnReceipt } from '../types';
import { HUB_INFO } from '../data/mockData';
import { Send, Check, Copy, X } from 'lucide-react';

interface WhatsAppModalProps {
  receipt: ReturnReceipt;
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  receipt,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [cleanPhone, setCleanPhone] = useState(
    receipt.customerPhone.replace(/\D/g, '') || '73998124321'
  );

  if (!isOpen) return null;

  const dateObj = new Date(receipt.createdAt);
  const formattedDate = dateObj.toLocaleDateString('pt-BR');
  const formattedTime = dateObj.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const messageText = `Olá, *${receipt.customerName}*!\n\n` +
    `Seu pacote de devolução da *Shopee* foi recebido com sucesso no ponto oficial!\n\n` +
    `📦 *Comprovante de Postagem de Devolução*\n` +
    `🏷️ *Rastreamento:* ${receipt.trackingNumber}\n` +
    `🆔 *ID Devolução:* ${receipt.returnId}\n` +
    `🏪 *Loja Parceira:* ${receipt.sellerName}\n` +
    `📅 *Data/Hora:* ${formattedDate} às ${formattedTime}\n` +
    `⚖️ *Volumes:* ${receipt.volumes} vol (${receipt.weightKg.toFixed(3)} kg)\n` +
    `📍 *Local:* ${HUB_INFO.name}\n` +
    `🔐 *Cód. Autenticação:* ${receipt.authCode}\n\n` +
    `Você pode acompanhar o status do reembolso pelo App Shopee em:\n` +
    `*Eu > Minhas Compras > Devolução/Reembolso*\n\n` +
    `Atendimento Shopee Express Canavieiras: ${HUB_INFO.phone}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    // Format full phone for international link: 55 + DDD + number
    let finalPhone = cleanPhone;
    if (!finalPhone.startsWith('55') && finalPhone.length >= 10) {
      finalPhone = `55${finalPhone}`;
    }
    const encoded = encodeURIComponent(messageText);
    const url = `https://wa.me/${finalPhone}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-emerald-600 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Send className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Enviar Comprovante via WhatsApp</h3>
              <p className="text-[11px] text-emerald-100">Disparo direto para o cliente</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Telefone do Cliente (DDD + Número)
            </label>
            <input
              type="text"
              value={cleanPhone}
              onChange={(e) => setCleanPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="Ex: 73998124321"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Cliente: <span className="font-semibold text-slate-700">{receipt.customerName}</span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Mensagem Pré-Formatada
            </label>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700 font-mono whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
              {messageText}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleCopy}
              className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
            </button>

            <button
              onClick={handleOpenWhatsApp}
              className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Abrir no WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
