import React, { useState } from 'react';
import {
  Code,
  Copy,
  Check,
  Download,
  Upload,
  Save,
  RotateCcw,
  Info,
  Radio,
  FileCode,
  CheckCircle2
} from 'lucide-react';
import {
  encodeConfig,
  bytesToHex,
  COMMANDS
} from '../utils/loraProtocol';

export default function HexPreview({
  config,
  isConnected,
  onSendCommand,
  onExportJson,
  onImportJson
}) {
  const [copied, setCopied] = useState(false);

  const permanentBytes = encodeConfig(config, true);
  const tempBytes = encodeConfig(config, false);

  const hexPermanent = bytesToHex(permanentBytes);
  const hexTemp = bytesToHex(tempBytes);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const byteDescriptions = [
    { name: 'HEAD', val: permanentBytes[0], desc: '0xC0: Lưu Flash | 0xC2: Không lưu', color: 'border-blue-500 text-blue-400 bg-blue-500/10' },
    { name: 'ADDH', val: permanentBytes[1], desc: 'Địa chỉ cao: 0x' + permanentBytes[1].toString(16).padStart(2, '0').toUpperCase(), color: 'border-purple-500 text-purple-400 bg-purple-500/10' },
    { name: 'ADDL', val: permanentBytes[2], desc: 'Địa chỉ thấp: 0x' + permanentBytes[2].toString(16).padStart(2, '0').toUpperCase(), color: 'border-purple-500 text-purple-400 bg-purple-500/10' },
    { name: 'SPED', val: permanentBytes[3], desc: 'Parity + Baud + AirRate: 0b' + permanentBytes[3].toString(2).padStart(8, '0'), color: 'border-cyan-500 text-cyan-400 bg-cyan-500/10' },
    { name: 'CHAN', val: permanentBytes[4], desc: 'Kênh tần số: ' + (permanentBytes[4] & 0x1F), color: 'border-emerald-500 text-emerald-400 bg-emerald-500/10' },
    { name: 'OPTION', val: permanentBytes[5], desc: 'Fixed + IO + Wake + FEC + Power: 0b' + permanentBytes[5].toString(2).padStart(8, '0'), color: 'border-amber-500 text-amber-400 bg-amber-500/10' }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
          <Code className="w-4 h-4 text-emerald-400" />
          <span>Khung Lệnh Cấu Hình Hex (6 Bytes E32 / AS32)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopy(hexPermanent)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã copy Hex' : 'Copy Hex'}</span>
          </button>

          <button
            onClick={onExportJson}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Lưu file Profile</span>
          </button>

          <label className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            <span>Nạp Profile</span>
            <input
              type="file"
              accept=".json"
              onChange={onImportJson}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Hex Frame Visual Breakdown */}
      <div>
        <div className="text-xs text-slate-400 mb-2 font-medium">
          Cấu trúc từng Byte theo datasheet:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {byteDescriptions.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border ${item.color} text-center flex flex-col justify-between`}
            >
              <div>
                <span className="text-[10px] font-mono tracking-widest block opacity-80 uppercase">
                  Byte {idx}: {item.name}
                </span>
                <span className="text-lg font-mono font-bold block my-1">
                  0x{item.val.toString(16).padStart(2, '0').toUpperCase()}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate" title={item.desc}>
                {item.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons: Read, Write, Version, Reset */}
      <div className="pt-2">
        <div className="text-xs text-slate-400 mb-2.5 font-medium flex items-center justify-between">
          <span>Thao tác trực tiếp với Module qua cổng COM:</span>
          {!isConnected && (
            <span className="text-amber-400 text-[11px]">
              * Cần mở cổng COM trước khi thực hiện
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {/* Read parameters */}
          <button
            onClick={() => onSendCommand(COMMANDS.READ_PARAMS, 'Đọc tham số (0xC1 0xC1 0xC1)')}
            disabled={!isConnected}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition shadow-md shadow-blue-500/10 disabled:opacity-40"
          >
            <Radio className="w-4 h-4" />
            <span>Đọc Tham Số</span>
          </button>

          {/* Write permanent */}
          <button
            onClick={() => onSendCommand(permanentBytes, `Ghi & Lưu Flash (0xC0...)`)}
            disabled={!isConnected}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition shadow-md shadow-emerald-500/10 disabled:opacity-40"
          >
            <Save className="w-4 h-4" />
            <span>Ghi & Lưu Flash</span>
          </button>

          {/* Write temporary */}
          <button
            onClick={() => onSendCommand(tempBytes, `Ghi tạm thời (0xC2...)`)}
            disabled={!isConnected}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold py-2.5 px-3 rounded-xl transition disabled:opacity-40"
          >
            <FileCode className="w-4 h-4 text-amber-400" />
            <span>Ghi Tạm Thời</span>
          </button>

          {/* Read version */}
          <button
            onClick={() => onSendCommand(COMMANDS.READ_VERSION, 'Đọc phiên bản (0xC3 0xC3 0xC3)')}
            disabled={!isConnected}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold py-2.5 px-3 rounded-xl transition disabled:opacity-40"
          >
            <Info className="w-4 h-4 text-indigo-400" />
            <span>Đọc Phiên Bản</span>
          </button>

          {/* Reset module */}
          <button
            onClick={() => onSendCommand(COMMANDS.RESET_MODULE, 'Reset Module (0xC4 0xC4 0xC4)')}
            disabled={!isConnected}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 text-xs font-semibold py-2.5 px-3 rounded-xl transition disabled:opacity-40"
          >
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <span>Reset Module</span>
          </button>
        </div>
      </div>
    </div>
  );
}
