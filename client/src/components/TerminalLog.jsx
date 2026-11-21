import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Trash2, Send, ArrowUpRight, ArrowDownLeft, CornerDownLeft } from 'lucide-react';
import { hexToBytes, bytesToHex } from '../utils/loraProtocol';

export default function TerminalLog({ logs, onClear, onSendCustomHex, isConnected }) {
  const [customHex, setCustomHex] = useState('');
  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!customHex.trim() || !isConnected) return;
    const bytes = hexToBytes(customHex);
    if (!bytes) {
      alert('Chuỗi Hex không hợp lệ! Vui lòng nhập số chẵn các ký tự Hex (Ví dụ: C1 C1 C1 hoặc C0 00 00 1A 17 44)');
      return;
    }
    onSendCustomHex(bytes, `Tùy chỉnh: ${bytesToHex(bytes)}`);
    setCustomHex('');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>Nhật Ký Truyền Thông Cổng COM (TX / RX Log)</span>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Xóa Log</span>
        </button>
      </div>

      {/* Log Console Box */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 h-56 overflow-y-auto font-mono text-xs space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
        {logs.length === 0 ? (
          <div className="text-slate-600 italic text-center py-10">
            Chưa có dữ liệu truyền thông. Nhấn "Đọc Tham Số" hoặc gửi lệnh để xem nhật ký.
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className={`flex items-start gap-2 leading-relaxed ${
                log.type === 'tx'
                  ? 'text-cyan-400'
                  : log.type === 'rx'
                  ? 'text-emerald-400'
                  : log.type === 'error'
                  ? 'text-rose-400'
                  : 'text-slate-400'
              }`}
            >
              <span className="text-slate-600 text-[11px] select-none flex-shrink-0">
                [{log.time}]
              </span>

              {log.type === 'tx' && (
                <span className="flex items-center gap-0.5 text-cyan-400 font-semibold select-none flex-shrink-0">
                  <ArrowUpRight className="w-3.5 h-3.5" /> TX:
                </span>
              )}

              {log.type === 'rx' && (
                <span className="flex items-center gap-0.5 text-emerald-400 font-semibold select-none flex-shrink-0">
                  <ArrowDownLeft className="w-3.5 h-3.5" /> RX:
                </span>
              )}

              <span className="break-all font-bold">
                {log.hex}
              </span>

              {log.desc && (
                <span className="text-slate-500 font-sans text-[11px]">
                  ({log.desc})
                </span>
              )}
            </div>
          ))
        )}
        <div ref={logEndRef} />
      </div>

      {/* Custom Hex Sender */}
      <form onSubmit={handleSend} className="flex gap-2 pt-1">
        <input
          type="text"
          value={customHex}
          onChange={(e) => setCustomHex(e.target.value)}
          placeholder="Nhập chuỗi Hex cần gửi (VD: C1 C1 C1 hoặc C4 C4 C4)..."
          className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2 font-mono focus:outline-none focus:border-blue-500 placeholder:text-slate-600"
        />
        <button
          type="submit"
          disabled={!isConnected || !customHex.trim()}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition disabled:opacity-40"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Gửi Hex</span>
        </button>
      </form>
    </div>
  );
}
