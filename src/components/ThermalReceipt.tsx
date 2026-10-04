import React from 'react';
import { HUB_INFO } from '../data/mockData';
import { ReturnReceipt } from '../types';

interface ThermalReceiptProps {
  receipt: ReturnReceipt;
  showDuplicateBadge?: boolean;
}

export const ThermalReceipt: React.FC<ThermalReceiptProps> = ({
  receipt,
  showDuplicateBadge = false,
}) => {
  // Format date and time
  const dateObj = new Date(receipt.createdAt);
  const formattedDate = dateObj.toLocaleDateString('pt-BR');
  const formattedTime = dateObj.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div
      className="printable-thermal-receipt bg-white text-slate-950 font-thermal shadow-xl rounded-t-sm border border-slate-200 w-full max-w-[360px] mx-auto text-[11px] leading-relaxed select-text transition-all"
      style={{
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.15), 0 0 1px 1px rgba(0,0,0,0.05)',
      }}
    >
      {/* Top Header */}
      <div className="p-5 pb-3 text-center border-b border-dashed border-slate-300">
        <div className="flex items-center justify-center gap-1.5 mb-1 text-[#EE4D2D]">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12zm-7-8c-1.66 0-3-1.34-3-3H7c0 2.76 2.24 5 5 5s5-2.24 5-5h-2c0 1.66-1.34 3-3 3z" />
          </svg>
          <span className="font-bold text-sm tracking-wider uppercase text-slate-900">
            SHOPEE EXPRESS
          </span>
        </div>
        <p className="font-semibold text-xs text-slate-800 uppercase tracking-tight">
          {HUB_INFO.name}
        </p>
        <p className="text-[10px] text-slate-600 mt-0.5">{HUB_INFO.address}</p>
        <p className="text-[10px] text-slate-600">
          {HUB_INFO.cityState} · CEP: {HUB_INFO.cep}
        </p>
        <p className="text-[9px] text-slate-500 mt-0.5">
          CNPJ: {HUB_INFO.cnpj} · TEL: {HUB_INFO.phone}
        </p>
      </div>

      {/* Title & Document Info */}
      <div className="p-4 pt-3 pb-2 text-center border-b border-dashed border-slate-300">
        <div className="font-bold text-[13px] text-slate-900 tracking-tight">
          COMPROVANTE DE DEVOLUÇÃO
        </div>
        <div className="text-[10px] uppercase font-semibold text-slate-600">
          1ª VIA DO CLIENTE (GUARDE COM VOCÊ)
        </div>
        {showDuplicateBadge && (
          <div className="text-[10px] font-bold text-amber-700 bg-amber-50 rounded px-2 py-0.5 mt-1 inline-block border border-amber-200">
            ** 2ª VIA / REIMPRESSÃO **
          </div>
        )}
      </div>

      {/* Main Barcode & Tracking */}
      <div className="p-4 py-3 text-center bg-slate-50/60 border-b border-dashed border-slate-300">
        <p className="text-[9px] uppercase font-medium text-slate-500 mb-1">
          CÓDIGO DE RASTREAMENTO SPX
        </p>
        <div className="font-bold text-sm text-slate-900 tracking-wider mb-1.5">
          {receipt.trackingNumber}
        </div>

        {/* SVG Simulated Barcode */}
        <div className="flex justify-center items-center h-12 w-full max-w-[280px] mx-auto px-2 bg-white rounded border border-slate-200 py-1">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 260 40">
            <g fill="#000000">
              <rect x="0" y="0" width="3" height="40" />
              <rect x="5" y="0" width="1" height="40" />
              <rect x="8" y="0" width="4" height="40" />
              <rect x="15" y="0" width="2" height="40" />
              <rect x="19" y="0" width="1" height="40" />
              <rect x="23" y="0" width="3" height="40" />
              <rect x="28" y="0" width="2" height="40" />
              <rect x="33" y="0" width="4" height="40" />
              <rect x="40" y="0" width="1" height="40" />
              <rect x="44" y="0" width="3" height="40" />
              <rect x="50" y="0" width="2" height="40" />
              <rect x="54" y="0" width="1" height="40" />
              <rect x="58" y="0" width="4" height="40" />
              <rect x="65" y="0" width="2" height="40" />
              <rect x="70" y="0" width="3" height="40" />
              <rect x="75" y="0" width="1" height="40" />
              <rect x="79" y="0" width="4" height="40" />
              <rect x="86" y="0" width="2" height="40" />
              <rect x="91" y="0" width="1" height="40" />
              <rect x="95" y="0" width="3" height="40" />
              <rect x="101" y="0" width="2" height="40" />
              <rect x="106" y="0" width="4" height="40" />
              <rect x="113" y="0" width="1" height="40" />
              <rect x="117" y="0" width="3" height="40" />
              <rect x="123" y="0" width="2" height="40" />
              <rect x="128" y="0" width="4" height="40" />
              <rect x="135" y="0" width="1" height="40" />
              <rect x="139" y="0" width="2" height="40" />
              <rect x="144" y="0" width="4" height="40" />
              <rect x="151" y="0" width="1" height="40" />
              <rect x="155" y="0" width="3" height="40" />
              <rect x="161" y="0" width="2" height="40" />
              <rect x="166" y="0" width="4" height="40" />
              <rect x="173" y="0" width="2" height="40" />
              <rect x="178" y="0" width="1" height="40" />
              <rect x="182" y="0" width="3" height="40" />
              <rect x="188" y="0" width="2" height="40" />
              <rect x="193" y="0" width="4" height="40" />
              <rect x="200" y="0" width="1" height="40" />
              <rect x="204" y="0" width="3" height="40" />
              <rect x="210" y="0" width="2" height="40" />
              <rect x="215" y="0" width="4" height="40" />
              <rect x="222" y="0" width="1" height="40" />
              <rect x="226" y="0" width="2" height="40" />
              <rect x="231" y="0" width="3" height="40" />
              <rect x="237" y="0" width="2" height="40" />
              <rect x="242" y="0" width="4" height="40" />
              <rect x="249" y="0" width="1" height="40" />
              <rect x="253" y="0" width="3" height="40" />
              <rect x="258" y="0" width="2" height="40" />
            </g>
          </svg>
        </div>
        <p className="text-[9px] text-slate-500 mt-1">ID DEVOLUÇÃO: {receipt.returnId}</p>
      </div>

      {/* Package & Customer Details Table */}
      <div className="p-4 py-3 space-y-1.5 border-b border-dashed border-slate-300">
        <div className="flex justify-between items-baseline">
          <span className="text-slate-500">DATA / HORA:</span>
          <span className="font-semibold text-slate-900">
            {formattedDate} {formattedTime}
          </span>
        </div>

        <div className="flex justify-between items-baseline">
          <span className="text-slate-500">HUB / TERMINAL:</span>
          <span className="font-semibold text-slate-900">
            {HUB_INFO.code} / {HUB_INFO.terminalId}
          </span>
        </div>

        <div className="flex justify-between items-baseline">
          <span className="text-slate-500">OPERADOR:</span>
          <span className="font-semibold text-slate-900">{receipt.operatorName}</span>
        </div>

        <div className="h-px bg-slate-200 my-1"></div>

        <div className="flex justify-between items-baseline">
          <span className="text-slate-500">CLIENTE:</span>
          <span className="font-semibold text-slate-900 text-right truncate max-w-[190px]">
            {receipt.customerName}
          </span>
        </div>

        <div className="flex justify-between items-baseline">
          <span className="text-slate-500">DOCUMENTO CPF:</span>
          <span className="font-semibold text-slate-900">{receipt.customerCpf}</span>
        </div>

        <div className="flex justify-between items-baseline">
          <span className="text-slate-500">CONTATO:</span>
          <span className="font-semibold text-slate-900">{receipt.customerPhone}</span>
        </div>

        <div className="h-px bg-slate-200 my-1"></div>

        <div className="flex justify-between items-baseline">
          <span className="text-slate-500">LOJA / VENDEDOR:</span>
          <span className="font-semibold text-slate-900 text-right truncate max-w-[190px]">
            {receipt.sellerName}
          </span>
        </div>

        <div className="flex justify-between items-baseline">
          <span className="text-slate-500">MOTIVO:</span>
          <span className="font-semibold text-slate-900 text-right truncate max-w-[190px]">
            {receipt.returnReason}
          </span>
        </div>

        <div className="flex justify-between items-baseline">
          <span className="text-slate-500">ITEM:</span>
          <span className="font-semibold text-slate-900 text-right truncate max-w-[190px]">
            {receipt.itemDescription}
          </span>
        </div>

        <div className="flex justify-between items-baseline">
          <span className="text-slate-500">VOLUMES / PESO:</span>
          <span className="font-semibold text-slate-900">
            {receipt.volumes} vol · {receipt.weightKg.toFixed(3)} kg
          </span>
        </div>

        <div className="flex justify-between items-baseline">
          <span className="text-slate-500">CONDIÇÃO:</span>
          <span className="font-semibold text-slate-800 text-right text-[10px]">
            {receipt.packageCondition}
          </span>
        </div>
      </div>

      {/* QR Code and Validation Hash */}
      <div className="p-4 py-3 text-center border-b border-dashed border-slate-300 bg-slate-50/40">
        <div className="flex justify-center mb-2">
          {/* Simulated QR Code SVG */}
          <div className="p-1.5 bg-white border border-slate-200 rounded">
            <svg className="w-20 h-20" viewBox="0 0 25 25">
              <rect width="25" height="25" fill="#ffffff" />
              {/* Corner 1 */}
              <rect x="1" y="1" width="7" height="7" fill="#000000" />
              <rect x="2" y="2" width="5" height="5" fill="#ffffff" />
              <rect x="3" y="3" width="3" height="3" fill="#000000" />
              {/* Corner 2 */}
              <rect x="17" y="1" width="7" height="7" fill="#000000" />
              <rect x="18" y="2" width="5" height="5" fill="#ffffff" />
              <rect x="19" y="3" width="3" height="3" fill="#000000" />
              {/* Corner 3 */}
              <rect x="1" y="17" width="7" height="7" fill="#000000" />
              <rect x="2" y="18" width="5" height="5" fill="#ffffff" />
              <rect x="3" y="19" width="3" height="3" fill="#000000" />
              {/* Timing & random data bits */}
              <rect x="9" y="3" width="1" height="1" fill="#000000" />
              <rect x="11" y="3" width="2" height="1" fill="#000000" />
              <rect x="14" y="3" width="1" height="1" fill="#000000" />
              <rect x="3" y="9" width="1" height="1" fill="#000000" />
              <rect x="5" y="11" width="2" height="1" fill="#000000" />
              <rect x="10" y="10" width="5" height="5" fill="#000000" />
              <rect x="11" y="11" width="3" height="3" fill="#ffffff" />
              <rect x="12" y="12" width="1" height="1" fill="#000000" />
              <rect x="9" y="17" width="2" height="1" fill="#000000" />
              <rect x="12" y="18" width="3" height="1" fill="#000000" />
              <rect x="10" y="21" width="2" height="2" fill="#000000" />
              <rect x="17" y="11" width="3" height="1" fill="#000000" />
              <rect x="19" y="13" width="2" height="2" fill="#000000" />
              <rect x="16" y="18" width="4" height="2" fill="#000000" />
              <rect x="21" y="21" width="2" height="2" fill="#000000" />
            </svg>
          </div>
        </div>
        <p className="text-[9px] text-slate-500 uppercase">
          ESCANEIE PARA CONSULTAR O RASTREAMENTO SHOPEE
        </p>
        <p className="text-[10px] font-bold text-slate-800 tracking-wider mt-0.5">
          AUTENTICAÇÃO: {receipt.authCode}
        </p>
      </div>

      {/* Legal & App Guidance */}
      <div className="p-4 pt-3 pb-5 text-center text-[9px] text-slate-500 leading-tight space-y-1">
        <p className="font-semibold text-slate-700">
          ACOMPANHE O REEMBOLSO NO APLICATIVO SHOPEE:
        </p>
        <p>Aba &quot;Eu&quot; &gt; &quot;Minhas Compras&quot; &gt; &quot;Devolução / Reembolso&quot;</p>
        <p className="pt-1 text-slate-400">
          Este comprovante certifica a custódia temporária do pacote de devolução
          no Ponto Shopee Express Canavieiras até a transferência para a rota de coleta.
        </p>
        <div className="pt-2 font-bold text-[10px] text-slate-800">
          OBRIGADO POR UTILIZAR O PONTO CANAVIEIRAS!
        </div>
      </div>

      {/* Sawtooth edge simulation at the bottom */}
      <div className="h-3 w-full bg-slate-100 receipt-sawtooth-bottom print:hidden"></div>
    </div>
  );
};
