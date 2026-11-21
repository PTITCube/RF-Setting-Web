import React, { useState } from 'react';
import { X, Code2, Copy, Check, Terminal } from 'lucide-react';
import { generateCppCode } from '../utils/loraProtocol';

export default function CodeGeneratorModal({ isOpen, onClose, config }) {
  const [copied, setCopied] = useState(false);
  const code = generateCppCode(config);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Mã Nguồn C++ Khởi Tạo Module (Arduino / ESP32)
              </h2>
              <p className="text-xs text-slate-400">
                Tự động sinh mã nguồn tương thích với cấu hình hiện tại
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã sao chép' : 'Sao chép mã'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 p-5 overflow-y-auto bg-slate-950">
          <pre className="font-mono text-xs text-emerald-400 leading-relaxed overflow-x-auto selection:bg-emerald-900 selection:text-white">
            {code}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-between items-center text-xs text-slate-400">
          <span>Tương thích hoàn toàn với nền tảng PlatformIO & Arduino IDE</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
