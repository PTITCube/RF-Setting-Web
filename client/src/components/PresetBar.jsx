import React from 'react';
import { Sparkles, SlidersHorizontal, Check } from 'lucide-react';
import { PRESETS } from '../utils/loraProtocol';

export default function PresetBar({ onApplyPreset, currentConfig }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Cấu Hình Nhanh Định Sẵn (Quick Presets)</span>
        </div>
        <span className="text-[11px] text-slate-500">
          Chọn cấu hình tối ưu chỉ với 1 cú nhấp chuột
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onApplyPreset(preset.config, preset.name)}
            className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900 transition text-left group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition">
                  {preset.name}
                </span>
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${preset.badgeColor}`}>
                  {preset.badge}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">
                {preset.desc}
              </p>
            </div>
            <div className="text-[10px] text-blue-400 font-medium mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
              <span>Áp dụng cấu hình này</span>
              <span>→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
