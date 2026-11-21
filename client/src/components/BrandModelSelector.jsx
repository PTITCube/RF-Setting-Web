import React from 'react';
import { BRANDS, FREQ_BANDS, POWER_MODELS } from '../utils/loraProtocol';
import { Layers, ShieldCheck, Zap } from 'lucide-react';

export default function BrandModelSelector({ config, onChange }) {
  // Suy ra tên model ước tính (VD: E32-433T20D hoặc AS32-TTL-100)
  const getEstimatedModel = () => {
    const isEbyte = config.brand === BRANDS.EBYTE;
    const band = config.band;
    const power = config.powerModel;

    if (isEbyte) {
      const pwrSuffix = power === '1W' ? 'T30D' : power === '500mW' ? 'T27D' : 'T20D';
      return `E32-${band}${pwrSuffix}`;
    } else {
      const pwrSuffix = power === '1W' ? 'TTL-1W' : power === '500mW' ? 'TTL-500' : 'TTL-100';
      return `AS32-${pwrSuffix}`;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
          <Layers className="w-4 h-4 text-blue-400" />
          <span>Dòng Module & Phần Cứng</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Model nhận diện:</span>
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {getEstimatedModel()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Brand Selector */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">
            Hãng sản xuất
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[BRANDS.EBYTE, BRANDS.ASHINING].map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() => onChange({ brand })}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border transition flex items-center justify-center gap-1.5 ${
                  config.brand === brand
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{brand}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Frequency Band */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">
            Dải tần hoạt động
          </label>
          <select
            value={config.band}
            onChange={(e) => {
              const band = e.target.value;
              const defChan = FREQ_BANDS[band].defaultChan;
              onChange({ band, channel: defChan });
            }}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500 font-medium"
          >
            {Object.entries(FREQ_BANDS).map(([key, item]) => (
              <option key={key} value={key}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* Power Variant */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">
            Phiên bản công suất
          </label>
          <select
            value={config.powerModel}
            onChange={(e) => onChange({ powerModel: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500 font-medium"
          >
            {Object.entries(POWER_MODELS).map(([key, item]) => (
              <option key={key} value={key}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
