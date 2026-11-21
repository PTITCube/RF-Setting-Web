import React from 'react';
import { Sliders, Zap, Shield, Clock, Cpu } from 'lucide-react';
import {
  TRANSMISSION_MODES,
  IO_DRIVE_MODES,
  WAKE_UP_TIMES,
  POWER_MODELS
} from '../utils/loraProtocol';

export default function AdvancedSettings({ config, onChange }) {
  const powerModel = POWER_MODELS[config.powerModel] || POWER_MODELS['100mW'];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <span>Cấu Hình Nâng Cao (Truyền Điểm, Công Suất, FEC)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Transmission Mode */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>Chế độ truyền tin (Transmission Mode)</span>
          </label>
          <div className="space-y-2">
            {TRANSMISSION_MODES.map((mode) => (
              <label
                key={mode.value}
                className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition text-xs ${
                  config.fixedPoint === mode.value
                    ? 'bg-indigo-600/10 border-indigo-500 text-indigo-200'
                    : 'bg-slate-800/70 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <input
                  type="radio"
                  name="fixedPoint"
                  checked={config.fixedPoint === mode.value}
                  onChange={() => onChange({ fixedPoint: mode.value })}
                  className="mt-0.5 accent-indigo-500"
                />
                <div>
                  <div className="font-semibold">{mode.label.split('(')[0]}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {mode.label.includes('(') ? '(' + mode.label.split('(')[1] : ''}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Transmission Power */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Công suất phát ({powerModel.name})</span>
            </span>
          </label>
          <div className="space-y-2">
            {powerModel.levels.map((lvl) => (
              <label
                key={lvl.value}
                className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition text-xs ${
                  config.powerLevel === lvl.value
                    ? 'bg-amber-500/10 border-amber-500 text-amber-200'
                    : 'bg-slate-800/70 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="powerLevel"
                    checked={config.powerLevel === lvl.value}
                    onChange={() => onChange({ powerLevel: lvl.value })}
                    className="accent-amber-500"
                  />
                  <span className="font-medium">{lvl.label}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  Bits: {lvl.value.toString(2).padStart(2, '0')}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* FEC & IO Drive */}
        <div className="space-y-4">
          {/* FEC */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sửa lỗi trước vô tuyến (Forward Error Correction - FEC)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChange({ fec: 1 })}
                className={`px-3 py-2 text-xs font-medium rounded-xl border transition ${
                  config.fec === 1
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
              >
                Bật FEC (Khuyên dùng)
              </button>
              <button
                type="button"
                onClick={() => onChange({ fec: 0 })}
                className={`px-3 py-2 text-xs font-medium rounded-xl border transition ${
                  config.fec === 0
                    ? 'bg-slate-700 text-white border-slate-600'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
                }`}
              >
                Tắt FEC
              </button>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              FEC tăng cường khả năng chống nhiễu gói tin vô tuyến nhưng làm tăng thời gian truyền tải một lượng nhỏ.
            </span>
          </div>

          {/* IO Drive Mode */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Chế độ điều khiển chân IO (TXD & AUX)
            </label>
            <select
              value={config.ioDrive}
              onChange={(e) => onChange({ ioDrive: Number(e.target.value) })}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
            >
              {IO_DRIVE_MODES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Wireless Wake-up Time */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Thời gian đánh thức vô tuyến (Wake-up Time - WOR)</span>
          </label>
          <select
            value={config.wakeUpTime}
            onChange={(e) => onChange({ wakeUpTime: Number(e.target.value) })}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
          >
            {WAKE_UP_TIMES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Dùng trong chế độ đánh thức Mode 1 (Wake-up) và tiết kiệm năng lượng Mode 2 (Power-saving).
          </span>
        </div>
      </div>
    </div>
  );
}
