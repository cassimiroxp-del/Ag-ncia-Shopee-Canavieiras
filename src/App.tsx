/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Screen, Operator, ReturnReceipt, ReturnStatus } from './types';
import { OPERATORS, INITIAL_RECEIPTS, HUB_INFO } from './data/mockData';
import { Navbar } from './components/Navbar';
import { LoginPinScreen } from './components/LoginPinScreen';
import { PrintPreviewScreen } from './components/PrintPreviewScreen';
import { HistoryScreen } from './components/HistoryScreen';

const STORAGE_KEY_RECEIPTS = 'spx_canavieiras_receipts_v1';
const STORAGE_KEY_OPERATOR = 'spx_canavieiras_operator_v1';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [activeOperator, setActiveOperator] = useState<Operator | null>(null);

  // Receipts state with localStorage fallback
  const [receipts, setReceipts] = useState<ReturnReceipt[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECEIPTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load receipts from localStorage', e);
    }
    return INITIAL_RECEIPTS;
  });

  // Current receipt being created/viewed in Print Preview
  const [currentReceipt, setCurrentReceipt] = useState<ReturnReceipt>(() => {
    return (
      INITIAL_RECEIPTS[0] || {
        id: 'RET-2026-0046',
        trackingNumber: 'BR2604899999SPX',
        orderNumber: '2610049900X',
        returnId: 'IDV-98449900',
        customerName: 'Fernanda Oliveira Santos',
        customerCpf: '***.458.915-**',
        customerPhone: '(73) 99812-4321',
        sellerName: 'Moda Bahia Oficial',
        returnReason: 'Arrependimento / Compra por engano',
        itemDescription: 'Vestido Linho Midi Elegance - Tam M',
        weightKg: 0.42,
        volumes: 1,
        packageCondition: 'Embalagem original com etiqueta',
        createdAt: new Date().toISOString(),
        operatorId: OPERATORS[0].id,
        operatorName: OPERATORS[0].name,
        status: 'aguardando_coleta',
        authCode: 'SPX-CNV-9821-F7A',
        printedCount: 1,
      }
    );
  });

  // Sync receipts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RECEIPTS, JSON.stringify(receipts));
    } catch (e) {
      console.error('Failed to save receipts', e);
    }
  }, [receipts]);

  // Handlers for authentication and navigation
  const handleSuccessLogin = (operator: Operator) => {
    setActiveOperator(operator);
    setCurrentScreen('print_preview');
  };

  const handleLogout = () => {
    setActiveOperator(null);
    setCurrentScreen('login');
  };

  const handleSaveAndPrint = (updatedReceipt: ReturnReceipt) => {
    setCurrentReceipt(updatedReceipt);

    setReceipts((prev) => {
      const index = prev.findIndex((r) => r.id === updatedReceipt.id);
      if (index >= 0) {
        const copy = [...prev];
        copy[index] = updatedReceipt;
        return copy;
      } else {
        return [updatedReceipt, ...prev];
      }
    });
  };

  const handleSelectReceiptForPreview = (receipt: ReturnReceipt) => {
    setCurrentReceipt(receipt);
  };

  const handleUpdateReceiptStatus = (
    receiptId: string,
    status: ReturnStatus,
    driverName?: string
  ) => {
    setReceipts((prev) =>
      prev.map((r) => {
        if (r.id === receiptId) {
          return {
            ...r,
            status,
            driverName: driverName || r.driverName,
            collectedAt: status === 'coletado_spx' ? new Date().toISOString() : r.collectedAt,
          };
        }
        return r;
      })
    );
  };

  const handleMarkAllCollected = (driverName: string) => {
    const nowIso = new Date().toISOString();
    setReceipts((prev) =>
      prev.map((r) => {
        if (r.status === 'aguardando_coleta') {
          return {
            ...r,
            status: 'coletado_spx',
            driverName: driverName,
            collectedAt: nowIso,
          };
        }
        return r;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-[#EE4D2D] selection:text-white">
      {/* Universal Top Bar */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          if ((screen === 'print_preview' || screen === 'history') && !activeOperator) {
            // Default to first operator if reviewer wants to navigate directly
            setActiveOperator(OPERATORS[0]);
          }
          setCurrentScreen(screen);
        }}
        activeOperator={activeOperator}
        onLogout={handleLogout}
        historyCount={receipts.length}
      />

      {/* Main Screen Body */}
      <main className="flex-1">
        {currentScreen === 'login' && (
          <LoginPinScreen onSuccessLogin={handleSuccessLogin} />
        )}

        {currentScreen === 'print_preview' && (
          <PrintPreviewScreen
            activeOperator={activeOperator || OPERATORS[0]}
            currentReceipt={currentReceipt}
            onChangeReceipt={setCurrentReceipt}
            onSaveAndPrint={handleSaveAndPrint}
            onNavigate={setCurrentScreen}
            historyCount={receipts.length}
          />
        )}

        {currentScreen === 'history' && (
          <HistoryScreen
            receipts={receipts}
            activeOperator={activeOperator || OPERATORS[0]}
            onNavigate={setCurrentScreen}
            onSelectReceiptForPreview={handleSelectReceiptForPreview}
            onUpdateReceiptStatus={handleUpdateReceiptStatus}
            onMarkAllCollected={handleMarkAllCollected}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium text-slate-700">
            {HUB_INFO.name} · CNPJ {HUB_INFO.cnpj}
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>Terminal 01</span>
            <span>·</span>
            <span>Impressora Térmica 80mm ESC/POS</span>
            <span>·</span>
            <span className="text-[#EE4D2D] font-bold">Shopee Express BA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
