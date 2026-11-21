import React, { useState } from 'react';
import { SendHorizontal, Radio, Layers, Hash } from 'lucide-react';
import { bytesToHex } from '../utils/loraProtocol';

export default function PacketTester({ isConnected, onSendPacket }) {
  const [targetAddress, setTargetAddress] = useState(0x0000);
  const [targetChannel, setTargetChannel] = useState(23);
  const [payloadText, setPayloadText] = useState('ping');
  const [mode, setMode] = useState('fixed'); // 'fixed' or 'transparent'

  // Tạo gói tin theo định dạng E32 / AS32
  const buildPacket = () => {
    const textEncoder = new TextEncoder();
    const payloadBytes = textEncoder.encode(payloadText);

    if (mode === 'fixed') {
      const addh = (targetAddress >> 8) & 0xFF;
      const addl = targetAddress & 0xFF;
      const chan = targetChannel & 0x1F;
      const packet = new Uint8Array(3 + payloadBytes.length);
      packet[0] = addh;
      packet[1] = addl;
      packet[2] = chan;
      packet.set(payloadBytes, 3);
      return packet;
    } else {
      return payloadBytes;
    }
  };

  const packetBytes = buildPacket();
  const packetHex = bytesToHex(packetBytes);

  const handleSend = () => {
    if (!isConnected || !payloadText) return;
    onSendPacket(packetBytes, `Phát gói tin: "${payloadText}"`);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
          <SendHorizontal className="w-4 h-4 text-cyan-400" />
          <span>Công Cụ Thử Nghiệm Truyền Tin (Packet Builder & Tester)</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setMode('fixed')}
            className={`px-2.5 py-1 rounded-lg border transition ${
              mode === 'fixed'
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 font-semibold'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            Định Điểm (Fixed-point)
          </button>
          <button
            type="button"
            onClick={() => setMode('transparent')}
            className={`px-2.5 py-1 rounded-lg border transition ${
              mode === 'transparent'
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 font-semibold'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            Trong suốt (Transparent)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mode === 'fixed' && (
          <>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-blue-400" />
                <span>Địa chỉ đích (Target Address)</span>
              </label>
              <input
                type="number"
                min="0"
                max="65535"
                value={targetAddress}
                onChange={(e) => setTargetAddress(Math.max(0, Math.min(65535, Number(e.target.value) || 0)))}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Hex: 0x{targetAddress.toString(16).padStart(4, '0').toUpperCase()} (0xFFFF = Broadcast)
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kênh đích (Target Channel: 0 ~ 31)</span>
              </label>
              <input
                type="number"
                min="0"
                max="31"
                value={targetChannel}
                onChange={(e) => setTargetChannel(Math.max(0, Math.min(31, Number(e.target.value) || 0)))}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Tương ứng: {410 + targetChannel} MHz (Dải 433MHz)
              </span>
            </div>
          </>
        )}

        <div className={mode === 'fixed' ? '' : 'md:col-span-3'}>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">
            Nội dung chuỗi tin (Payload Message)
          </label>
          <input
            type="text"
            value={payloadText}
            onChange={(e) => setPayloadText(e.target.value)}
            placeholder="Nhập tin nhắn (VD: ping, telemetry, cmd)..."
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Frame Preview and Send */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[11px] text-slate-400 block mb-0.5 font-medium">
            Khung byte thực tế sẽ phát ra vô tuyến:
          </span>
          <span className="font-mono text-xs font-bold text-cyan-400 break-all">
            {packetHex}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Tổng chiều dài: {packetBytes.length} bytes
          </span>
        </div>

        <button
          onClick={handleSend}
          disabled={!isConnected || !payloadText}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-md shadow-cyan-500/10 disabled:opacity-40"
        >
          <SendHorizontal className="w-4 h-4" />
          <span>Phát Gói Tin Vô Tuyến</span>
        </button>
      </div>
    </div>
  );
}
