import React from 'react';
import { X, BookOpen, AlertCircle, CheckCircle, Cpu, Cable, ArrowRight } from 'lucide-react';

export default function PinoutGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-5 p-6 text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Hướng Dẫn Đấu Nối & Trạng Thái Chân M0 / M1
              </h2>
              <p className="text-xs text-slate-400">
                Chuẩn giao tiếp mạch chuyển đổi USB-UART (CH340/CP2102) với Module E32/AS32
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Operating Modes Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            1. Bảng 4 Chế Độ Hoạt Động (M0 & M1)
          </h3>
          <div className="border border-slate-800 rounded-2xl overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/80 text-slate-300 font-semibold border-b border-slate-700">
                  <th className="p-3">Chế độ (Mode)</th>
                  <th className="p-3 text-center">M1</th>
                  <th className="p-3 text-center">M0</th>
                  <th className="p-3">Chức năng & Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-sans font-medium text-slate-200">Mode 0 (Normal)</td>
                  <td className="p-3 text-center font-bold text-slate-400">0 (GND)</td>
                  <td className="p-3 text-center font-bold text-slate-400">0 (GND)</td>
                  <td className="p-3 font-sans text-slate-300">Hoạt động bình thường (UART mở, Vô tuyến mở, truyền nhận dữ liệu thông thường)</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-sans font-medium text-slate-200">Mode 1 (Wake-up)</td>
                  <td className="p-3 text-center font-bold text-slate-400">0 (GND)</td>
                  <td className="p-3 text-center font-bold text-cyan-400">1 (VCC)</td>
                  <td className="p-3 font-sans text-slate-300">Tự động thêm mã đánh thức (Preamble) trước gói tin để đánh thức bên nhận</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-sans font-medium text-slate-200">Mode 2 (Power-saving)</td>
                  <td className="p-3 text-center font-bold text-cyan-400">1 (VCC)</td>
                  <td className="p-3 text-center font-bold text-slate-400">0 (GND)</td>
                  <td className="p-3 font-sans text-slate-300">Tiết kiệm năng lượng (WOR), UART không phát, định kỳ thức dậy nghe Preamble</td>
                </tr>
                <tr className="bg-blue-500/10 hover:bg-blue-500/15">
                  <td className="p-3 font-sans font-bold text-blue-400 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Mode 3 (Sleep / Config)</span>
                  </td>
                  <td className="p-3 text-center font-bold text-blue-400">1 (VCC)</td>
                  <td className="p-3 text-center font-bold text-blue-400">1 (VCC)</td>
                  <td className="p-3 font-sans text-blue-200 font-semibold">
                    CHẾ ĐỘ CẤU HÌNH: Cần thiết để đọc/ghi tham số bằng web này (UART cố định 9600 8N1)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pinout Wiring Guide */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            2. Sơ Đồ Đấu Nối Dây (USB-to-UART sang E32 / AS32)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl space-y-2">
              <div className="font-semibold text-slate-300 flex items-center gap-2">
                <Cable className="w-4 h-4 text-blue-400" />
                <span>Nguồn & Tín hiệu cơ bản</span>
              </div>
              <ul className="space-y-1.5 text-slate-400 text-[11px] font-mono">
                <li>• <strong className="text-slate-200">VCC</strong>: Nối 3.3V hoặc 5.0V của mạch USB</li>
                <li>• <strong className="text-slate-200">GND</strong>: Nối GND chung</li>
                <li>• <strong className="text-slate-200">TXD</strong>: Nối RXD của mạch USB</li>
                <li>• <strong className="text-slate-200">RXD</strong>: Nối TXD của mạch USB</li>
                <li>• <strong className="text-slate-200">AUX</strong>: Để trống (hoặc nối LED/chân GPIO báo rảnh)</li>
              </ul>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl space-y-2">
              <div className="font-semibold text-slate-300 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>Chân chọn chế độ khi nạp tham số</span>
              </div>
              <div className="text-[11px] text-slate-300 space-y-1.5">
                <p>Để web đọc/ghi tham số thành công:</p>
                <div className="bg-blue-500/10 border border-blue-500/20 p-2.5 rounded-xl font-mono text-blue-300 font-semibold">
                  M0 nối VCC (3.3V)<br />
                  M1 nối VCC (3.3V)
                </div>
                <p className="text-slate-400 text-[10px]">
                  * Sau khi cấu hình xong, chuyển M0 và M1 về GND để sử dụng truyền nhận bình thường!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-2xl flex items-start gap-3 text-xs text-amber-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold">Mẹo khắc phục khi không đọc được tham số:</span>
            <ul className="list-disc list-inside text-[11px] text-amber-200/80 space-y-0.5">
              <li>Kiểm tra đã đảo chéo dây TXD ↔ RXD và RXD ↔ TXD chưa.</li>
              <li>Kiểm tra M0 và M1 đã được cấp mức CAO (VCC 3.3V) hay chưa.</li>
              <li>Đảm bảo đã gắn anten trước khi cấp nguồn để tránh hỏng tầng công suất RF.</li>
            </ul>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition"
          >
            Đã hiểu, đóng hướng dẫn
          </button>
        </div>
      </div>
    </div>
  );
}
