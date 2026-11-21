import React, { useState } from 'react';
import { Cable, CheckCircle2, AlertTriangle, Power, RefreshCw, Info } from 'lucide-react';
import { WebSerialPort } from '../utils/webSerial';

export default function PortConnection({ isConnected, isConnecting, onConnect, onDisconnect, onRefresh }) {
  const [baudRate, setBaudRate] = useState(9600);
  const isSupported = WebSerialPort.isSupported();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Port status and mode notice */}
        <div className="flex items-center gap-3.5">
          <div className={`w-3.5 h-3.5 rounded-full ${isConnected ? 'bg-emerald-400 shadow-[0_0_12px_#34d399]' : 'bg-rose-500'}`} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-200">
                {isConnected ? 'Đã kết nối cổng COM' : 'Chưa kết nối cổng COM'}
              </span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md ${isConnected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'}`}>
                {baudRate} bps 8N1
              </span>
            </div>
            <p className="text-xs text-amber-400/90 flex items-center gap-1.5 mt-0.5">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Chế độ Cấu hình (Mode 3): Đặt <strong>M0 = VCC (1)</strong> và <strong>M1 = VCC (1)</strong></span>
            </p>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-3">
          {!isSupported && (
            <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>Trình duyệt cần hỗ trợ Web Serial (Khuyên dùng Chrome/Edge)</span>
            </div>
          )}

          {!isConnected ? (
            <div className="flex items-center gap-2">
              <select
                value={baudRate}
                onChange={(e) => setBaudRate(Number(e.target.value))}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-2 font-mono focus:outline-none focus:border-blue-500"
                title="Tốc độ Baud giao tiếp cổng COM (Mặc định 9600 cho chế độ config E32/AS32)"
              >
                <option value={9600}>9600 bps (Chuẩn E32/AS32)</option>
                <option value={115200}>115200 bps</option>
                <option value={19200}>19200 bps</option>
                <option value={4800}>4800 bps</option>
              </select>

              <button
                onClick={() => onConnect(baudRate)}
                disabled={!isSupported || isConnecting}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-md shadow-blue-500/10 disabled:opacity-50"
              >
                <Cable className="w-4 h-4" />
                <span>{isConnecting ? 'Đang mở cổng...' : 'Mở Cổng COM'}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onDisconnect}
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-md shadow-rose-500/10"
            >
              <Power className="w-4 h-4" />
              <span>Đóng Cổng COM</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
