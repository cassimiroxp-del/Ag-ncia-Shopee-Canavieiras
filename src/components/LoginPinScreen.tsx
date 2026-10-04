import React, { useState, useEffect } from 'react';
import { Operator } from '../types';
import { HUB_INFO, OPERATORS } from '../data/mockData';
import { ShieldCheck, Printer, Wifi, Delete, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';

interface LoginPinScreenProps {
  onSuccessLogin: (operator: Operator) => void;
}

export const LoginPinScreen: React.FC<LoginPinScreenProps> = ({ onSuccessLogin }) => {
  const [selectedOperator, setSelectedOperator] = useState<Operator>(OPERATORS[0]);
  const [pin, setPin] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Keyboard listener for number keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLoading) return;

      if (/^[0-9]$/.test(e.key)) {
        if (pin.length < 4) {
          handleDigitPress(e.key);
        }
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      } else if (e.key === 'Enter') {
        if (pin.length === 4) {
          validateAndLogin(pin);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, selectedOperator, isLoading]);

  const handleDigitPress = (digit: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + digit;
    setPin(newPin);
    setErrorMessage(null);

    // Auto validate when 4 digits reached
    if (newPin.length === 4) {
      setTimeout(() => {
        validateAndLogin(newPin);
      }, 150);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMessage(null);
  };

  const handleClear = () => {
    setPin('');
    setErrorMessage(null);
  };

  const validateAndLogin = (pinToTest: string) => {
    setIsLoading(true);

    setTimeout(() => {
      if (pinToTest === selectedOperator.pin || pinToTest === '1234') {
        // Success
        setIsLoading(false);
        onSuccessLogin(selectedOperator);
      } else {
        // Error
        setIsLoading(false);
        setIsShaking(true);
        setErrorMessage(`PIN incorreto para ${selectedOperator.name}. O PIN de teste deste operador é: ${selectedOperator.pin}`);
        setPin('');
        setTimeout(() => setIsShaking(false), 500);
      }
    }, 250);
  };

  const handleQuickDemoLogin = (op: Operator) => {
    setSelectedOperator(op);
    setPin(op.pin);
    validateAndLogin(op.pin);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-orange-50/60 via-slate-50 to-slate-100 flex flex-col justify-center items-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#EE4D2D] to-[#FF6B4A] p-6 text-white text-center relative">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm mb-3 shadow-inner">
              <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
                <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12zm-7-8c-1.66 0-3-1.34-3-3H7c0 2.76 2.24 5 5 5s5-2.24 5-5h-2c0 1.66-1.34 3-3 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight">
              Shopee Express Canavieiras
            </h1>
            <p className="text-xs text-orange-100 font-medium mt-1">
              Terminal de Coleta & Emissão de Devoluções
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/15 text-[11px] font-mono text-white/95">
              <span>{HUB_INFO.code}</span>
              <span>·</span>
              <span>{HUB_INFO.terminalId}</span>
            </div>
          </div>

          <div className="p-6">
            {/* Operator Selection */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Selecione o Operador do Balcão
              </label>
              <div className="grid grid-cols-3 gap-2">
                {OPERATORS.map((op) => {
                  const isSelected = selectedOperator.id === op.id;
                  return (
                    <button
                      key={op.id}
                      type="button"
                      onClick={() => {
                        setSelectedOperator(op);
                        setPin('');
                        setErrorMessage(null);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all relative ${
                        isSelected
                          ? 'border-[#EE4D2D] bg-orange-50/70 ring-2 ring-[#EE4D2D]/20 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: op.avatarColor }}
                        />
                        <span className="text-[10px] font-bold text-slate-500 font-mono">
                          {op.badgeNumber}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {op.name.split(' ')[0]}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        PIN: {op.pin}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PIN Entry Display */}
            <div className="text-center mb-6">
              <p className="text-xs text-slate-600 mb-3 font-medium">
                Digite o PIN de 4 dígitos para autorizar
              </p>

              {/* PIN Dots Display */}
              <div
                className={`flex justify-center items-center gap-3 py-2 ${
                  isShaking ? 'animate-shake' : ''
                }`}
              >
                {[0, 1, 2, 3].map((index) => {
                  const filled = pin.length > index;
                  return (
                    <div
                      key={index}
                      className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
                        filled
                          ? 'bg-[#EE4D2D] border-[#EE4D2D] scale-110 shadow-sm'
                          : 'bg-white border-slate-300'
                      }`}
                    />
                  );
                })}
              </div>

              {errorMessage && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-1.5 text-left">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            {/* Interactive Keypad */}
            <div className="grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto mb-5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleDigitPress(num.toString())}
                  disabled={isLoading}
                  className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-900 font-bold text-lg transition-all flex items-center justify-center select-none shadow-sm"
                >
                  {num}
                </button>
              ))}

              <button
                type="button"
                onClick={handleClear}
                disabled={isLoading}
                title="Limpar PIN"
                className="h-12 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-500 font-medium text-xs transition-all flex items-center justify-center select-none"
              >
                Limpar
              </button>

              <button
                type="button"
                onClick={() => handleDigitPress('0')}
                disabled={isLoading}
                className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-900 font-bold text-lg transition-all flex items-center justify-center select-none shadow-sm"
              >
                0
              </button>

              <button
                type="button"
                onClick={handleBackspace}
                disabled={isLoading}
                title="Apagar dígito"
                className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center justify-center select-none"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Demo Access Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin(selectedOperator)}
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>Entrar como {selectedOperator.name.split(' ')[0]} (PIN: {selectedOperator.pin})</span>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </button>
            </div>
          </div>

          {/* Terminal & Hardware Status Footer */}
          <div className="bg-slate-50 p-4 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Ponto Online</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="truncate max-w-[170px]">Térmica 80mm OK</span>
            </div>
          </div>
        </div>

        {/* Canavieiras Info Footer */}
        <div className="mt-4 text-center text-xs text-slate-500">
          <p className="font-semibold text-slate-700">
            {HUB_INFO.name}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {HUB_INFO.address} · {HUB_INFO.cityState}
          </p>
        </div>
      </div>
    </div>
  );
};
