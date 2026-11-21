import React, { useState } from 'react';
import { Cpu, Radio, Sparkles, Check, ArrowRight } from 'lucide-react';
import { BRANDS } from '../utils/loraProtocol';

export default function ModuleVisualizer({ config, isConnected, isTransmitting, isReceiving }) {
  const isEbyte = config.brand === BRANDS.EBYTE;
  const [virtualM0, setVirtualM0] = useState(1);
  const [virtualM1, setVirtualM1] = useState(1);

  const isConfigMode = virtualM0 === 1 && virtualM1 === 1;

  const pins = [
    { name: 'M0', role: 'Chọn Mode bit 0', state: virtualM0, isToggle: true, onToggle: () => setVirtualM0(v => v === 1 ? 0 : 1), color: virtualM0 ? 'text-amber-400 bg-amber-500/20 border-amber-500' : 'text-slate-400 bg-slate-800 border-slate-700' },
    { name: 'M1', role: 'Chọn Mode bit 1', state: virtualM1, isToggle: true, onToggle: () => setVirtualM1(v => v === 1 ? 0 : 1), color: virtualM1 ? 'text-amber-400 bg-amber-500/20 border-amber-500' : 'text-slate-400 bg-slate-800 border-slate-700' },
    { name: 'RXD', role: 'Nhận dữ liệu (Nối TXD USB)', state: 'IN', color: 'text-cyan-400 bg-cyan-500/20 border-cyan-500' },
    { name: 'TXD', role: 'Phát dữ liệu (Nối RXD USB)', state: 'OUT', color: 'text-cyan-400 bg-cyan-500/20 border-cyan-500' },
    { name: 'AUX', role: 'Chỉ báo rảnh/bận', state: 'READY', color: 'text-purple-400 bg-purple-500/20 border-purple-500' },
    { name: 'VCC', role: 'Nguồn 3.3V ~ 5.2V', state: '3.3V', color: 'text-rose-400 bg-rose-500/20 border-rose-500' },
    { name: 'GND', role: 'Mass đất chung', state: 'GND', color: 'text-slate-300 bg-slate-800 border-slate-600' }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-bold text-white">Mô Phỏng Trực Quan Phần Cứng Module</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Trạng thái logic:</span>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
            isConfigMode
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}>
            {isConfigMode ? 'Mode 3: Sleep / Cấu hình (M0=1, M1=1)' : 'Mode 0: Normal / Hoạt động (M0=0, M1=0)'}
          </span>
        </div>
      </div>

      {/* Visual Board Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Module Graphic */}
        <div className="lg:col-span-7 flex justify-center py-2">
          <div className="relative w-72 sm:w-80 bg-gradient-to-b from-blue-950/80 to-slate-900 border-2 border-blue-600/40 rounded-2xl p-4 shadow-2xl shadow-blue-950/50">
            {/* Top Antenna Connector */}
            <div className="absolute -top-3.5 left-8 w-10 h-4 bg-amber-600 rounded-t border-t border-x border-amber-400 flex items-center justify-center">
              <div className="w-4 h-1 bg-amber-300 rounded-full" />
            </div>

            {/* Header info */}
            <div className="flex justify-between items-start mb-4 pt-1">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-blue-400 font-bold block">
                  {config.brand} LoRa Transceiver
                </span>
                <span className="text-base font-black tracking-tight text-white font-mono">
                  {isEbyte ? `E32-${config.band}T20D` : `AS32-TTL-100`}
                </span>
              </div>

              {/* Status LEDs */}
              <div className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
                {/* Power LED */}
                <div className="flex flex-col items-center">
                  <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-slate-700'}`} />
                  <span className="text-[8px] font-mono text-slate-500 mt-0.5">PWR</span>
                </div>
                {/* TX LED */}
                <div className="flex flex-col items-center">
                  <div className={`w-2.5 h-2.5 rounded-full ${isTransmitting ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-ping' : 'bg-slate-700'}`} />
                  <span className="text-[8px] font-mono text-slate-500 mt-0.5">TX</span>
                </div>
                {/* RX LED */}
                <div className="flex flex-col items-center">
                  <div className={`w-2.5 h-2.5 rounded-full ${isReceiving ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24] animate-ping' : 'bg-slate-700'}`} />
                  <span className="text-[8px] font-mono text-slate-500 mt-0.5">RX</span>
                </div>
              </div>
            </div>

            {/* Metal Shield Can */}
            <div className="w-full bg-slate-800/90 border border-slate-700 rounded-xl p-4 mb-4 text-center shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Radio className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono font-bold text-slate-200">SEMTECH SX1276 / SX1278</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Tần số: {config.band} MHz • Công suất: {config.powerModel}</div>
            </div>

            {/* Bottom 7 Header Pins */}
            <div className="grid grid-cols-7 gap-1 pt-1 border-t border-slate-800">
              {pins.map((pin, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-2.5 h-4 bg-amber-400/80 rounded-t-sm shadow-sm mb-1" />
                  <span className="text-[10px] font-mono font-bold text-slate-300">{pin.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pin Status & Interactive Toggles */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs text-slate-400 font-medium">
            Trạng thái chân & Hướng dẫn gạt jumper:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {/* M0 Jumper Button */}
            <button
              onClick={() => setVirtualM0(v => v === 1 ? 0 : 1)}
              className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-left hover:border-slate-700 transition flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] text-slate-500 block">Chân M0:</span>
                <span className="font-mono font-bold text-slate-200">
                  {virtualM0 === 1 ? 'M0 = VCC (1)' : 'M0 = GND (0)'}
                </span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${virtualM0 === 1 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                {virtualM0 === 1 ? 'Config (VCC)' : 'Normal (GND)'}
              </span>
            </button>

            {/* M1 Jumper Button */}
            <button
              onClick={() => setVirtualM1(v => v === 1 ? 0 : 1)}
              className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-left hover:border-slate-700 transition flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] text-slate-500 block">Chân M1:</span>
                <span className="font-mono font-bold text-slate-200">
                  {virtualM1 === 1 ? 'M1 = VCC (1)' : 'M1 = GND (0)'}
                </span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${virtualM1 === 1 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                {virtualM1 === 1 ? 'Config (VCC)' : 'Normal (GND)'}
              </span>
            </button>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
            <span className="font-semibold text-slate-300 block">💡 Ghi nhớ nhanh cho kỹ sư CubeSat:</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              • Khi cấu hình tham số: Nối <strong>M0 và M1 lên 3.3V (VCC)</strong>.<br />
              • Khi bay / truyền nhận viễn trắc thực tế: Nối <strong>M0 và M1 xuống GND</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
