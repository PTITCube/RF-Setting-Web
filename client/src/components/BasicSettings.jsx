import React from 'react';
import { Settings, Sliders, Radio, Hash, Signal } from 'lucide-react';
import {
  UART_BAUD_RATES,
  UART_PARITY,
  AIR_DATA_RATES,
  FREQ_BANDS,
  calculateFrequency
} from '../utils/loraProtocol';

export default function BasicSettings({ config, onChange }) {
  const currentBand = FREQ_BANDS[config.band] || FREQ_BANDS['433'];
  const calculatedFreq = calculateFrequency(config.band, config.channel);

  const handleAddressChange = (val) => {
    let num = parseInt(val, 10);
    if (isNaN(num)) num = 0;
    num = Math.max(0, Math.min(65535, num));
    onChange({ address: num });
  };

  const handleAddressHexChange = (hexStr) => {
    const clean = hexStr.replace(/[^0-9a-fA-F]/g, '');
    let num = parseInt(clean, 16);
    if (isNaN(num)) num = 0;
    num = Math.max(0, Math.min(65535, num));
    onChange({ address: num });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
          <Settings className="w-4 h-4 text-blue-400" />
          <span>Cấu Hình Cơ Bản (Kênh, Địa Chỉ, UART)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Module Address */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-blue-400" />
              <span>Địa chỉ Module (ADDH / ADDL)</span>
            </label>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => onChange({ address: 0x0000 })}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              >
                0x0000 (Mặc định)
              </button>
              <button
                type="button"
                onClick={() => onChange({ address: 0xFFFF })}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700"
              >
                0xFFFF (Broadcast)
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-slate-500 block mb-0.5">Thập phân (0 ~ 65535)</span>
              <input
                type="number"
                min="0"
                max="65535"
                value={config.address}
                onChange={(e) => handleAddressChange(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block mb-0.5">Hex (0x0000 ~ 0xFFFF)</span>
              <input
                type="text"
                value={'0x' + (Number(config.address) || 0).toString(16).padStart(4, '0').toUpperCase()}
                onChange={(e) => handleAddressHexChange(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-blue-400 text-xs rounded-xl px-3 py-2 font-mono font-bold focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Channel & Frequency */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kênh truyền thông (CHAN)</span>
            </label>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
              {calculatedFreq} MHz
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max={currentBand.maxChan}
              value={config.channel}
              onChange={(e) => onChange({ channel: Number(e.target.value) })}
              className="flex-1 accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="w-20 text-center font-mono text-xs font-bold bg-slate-800 border border-slate-700 py-1.5 rounded-xl text-slate-200">
              CH {config.channel} (0x{config.channel.toString(16).padStart(2, '0').toUpperCase()})
            </div>
          </div>
        </div>

        {/* UART Baud Rate */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">
            Tốc độ UART truyền thông (Baud rate hoạt động)
          </label>
          <select
            value={config.uartBaud}
            onChange={(e) => onChange({ uartBaud: Number(e.target.value) })}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 font-mono focus:outline-none focus:border-blue-500"
          >
            {UART_BAUD_RATES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <span className="text-[10px] text-slate-500 mt-1 block">
            * Lưu ý: Tốc độ này dùng khi module hoạt động ở Mode 0 (Normal). Ở Mode 3 (Config) module luôn cố định 9600 bps.
          </span>
        </div>

        {/* UART Parity */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">
            Kiểm tra chẵn lẻ UART (Parity)
          </label>
          <select
            value={config.uartParity}
            onChange={(e) => onChange({ uartParity: Number(e.target.value) })}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
          >
            {UART_PARITY.slice(0, 3).map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Air Data Rate */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tốc độ truyền vô tuyến (Air Data Rate)</span>
            </span>
            <span className="text-[11px] text-slate-400">
              Tốc độ thấp hơn = Khoảng cách xa hơn & độ nhạy cao hơn
            </span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {AIR_DATA_RATES.slice(0, 6).map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => onChange({ airDataRate: item.value })}
                className={`px-2.5 py-2 text-xs rounded-xl border text-center transition font-mono ${
                  config.airDataRate === item.value
                    ? 'bg-cyan-600 text-white border-cyan-400 shadow-sm shadow-cyan-500/20 font-bold'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <div>{item.rate >= 1000 ? `${item.rate / 1000} kbps` : `${item.rate} bps`}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
