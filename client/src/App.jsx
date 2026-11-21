import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PortConnection from './components/PortConnection';
import BrandModelSelector from './components/BrandModelSelector';
import BasicSettings from './components/BasicSettings';
import AdvancedSettings from './components/AdvancedSettings';
import HexPreview from './components/HexPreview';
import TerminalLog from './components/TerminalLog';
import PacketTester from './components/PacketTester';
import PinoutGuideModal from './components/PinoutGuideModal';
import ModuleVisualizer from './components/ModuleVisualizer';
import PresetBar from './components/PresetBar';
import CodeGeneratorModal from './components/CodeGeneratorModal';
import {
  DEFAULT_CONFIG,
  decodeConfig,
  encodeConfig,
  bytesToHex,
  COMMANDS
} from './utils/loraProtocol';
import { serialDriver } from './utils/webSerial';
import {
  CheckCircle2,
  AlertCircle,
  Info,
  Sliders,
  Code,
  SendHorizontal,
  Save,
  Radio,
  RotateCcw,
  FileCode
} from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('ptitcube_rf_config');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_CONFIG;
  });

  const [activeTab, setActiveTab] = useState('settings'); // 'settings' | 'inspector' | 'terminal'
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isCodeOpen, setIsCodeOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isTxActive, setIsTxActive] = useState(false);
  const [isRxActive, setIsRxActive] = useState(false);

  // Lưu cấu hình vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem('ptitcube_rf_config', JSON.stringify(config));
  }, [config]);

  // Thiết lập sự kiện cổng Serial
  useEffect(() => {
    serialDriver.onData((incomingBytes) => {
      const now = new Date().toLocaleTimeString();
      const hexStr = bytesToHex(incomingBytes);

      // Nhấp nháy LED RX
      setIsRxActive(true);
      setTimeout(() => setIsRxActive(false), 300);

      // Thêm vào log nhận
      setLogs((prev) => [
        ...prev,
        { time: now, type: 'rx', hex: hexStr, desc: 'Dữ liệu nhận từ Module' }
      ]);

      // Tự động phân tích nếu nhận được frame 6-byte tham số 0xC0 hoặc 0xC2
      if (incomingBytes.length >= 6 && (incomingBytes[0] === 0xC0 || incomingBytes[0] === 0xC2)) {
        const decoded = decodeConfig(incomingBytes);
        if (decoded) {
          setConfig((prev) => ({
            ...prev,
            address: decoded.address,
            uartParity: decoded.uartParity,
            uartBaud: decoded.uartBaud,
            airDataRate: decoded.airDataRate,
            channel: decoded.channel,
            fixedPoint: decoded.fixedPoint,
            ioDrive: decoded.ioDrive,
            wakeUpTime: decoded.wakeUpTime,
            fec: decoded.fec,
            powerLevel: decoded.powerLevel
          }));

          showNotification('success', `Đã nhận diện và đồng bộ tham số từ Module (Kênh ${decoded.channel}, Địa chỉ 0x${decoded.address.toString(16).toUpperCase()})!`);
        }
      } else if (incomingBytes.length >= 4 && incomingBytes[0] === 0xC3) {
        showNotification('info', `Thông tin phiên bản Module: ${hexStr} (Model 0x${incomingBytes[1].toString(16).toUpperCase()}, Ver 0x${incomingBytes[2].toString(16).toUpperCase()})`);
      }
    });

    serialDriver.onError((err) => {
      const now = new Date().toLocaleTimeString();
      setLogs((prev) => [
        ...prev,
        { time: now, type: 'error', hex: 'ERR', desc: err.message }
      ]);
      showNotification('error', 'Lỗi cổng Serial: ' + err.message);
    });

    serialDriver.onClose(() => {
      setIsConnected(false);
      showNotification('info', 'Cổng COM đã đóng kết nối.');
    });
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleUpdateConfig = (newProps) => {
    setConfig((prev) => ({ ...prev, ...newProps }));
  };

  const handleApplyPreset = (presetConfig, presetName) => {
    setConfig((prev) => ({ ...prev, ...presetConfig }));
    showNotification('success', `Đã áp dụng cấu hình: "${presetName}"!`);
  };

  const handleConnect = async (baudRate) => {
    setIsConnecting(true);
    try {
      await serialDriver.connect(baudRate);
      setIsConnected(true);
      showNotification('success', `Mở cổng COM thành công với tốc độ ${baudRate} bps!`);
    } catch (err) {
      if (err.name !== 'NotFoundError') {
        showNotification('error', 'Không thể mở cổng COM: ' + err.message);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await serialDriver.disconnect();
      setIsConnected(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendCommand = async (bytes, desc) => {
    try {
      // Nhấp nháy LED TX
      setIsTxActive(true);
      setTimeout(() => setIsTxActive(false), 300);

      await serialDriver.send(bytes);
      const now = new Date().toLocaleTimeString();
      setLogs((prev) => [
        ...prev,
        { time: now, type: 'tx', hex: bytesToHex(bytes), desc }
      ]);
      showNotification('info', `Đã gửi: ${desc}`);
    } catch (err) {
      showNotification('error', 'Lỗi khi gửi lệnh: ' + err.message);
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `E32_AS32_Config_${config.band}MHz_CH${config.channel}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('success', 'Đã xuất file cấu hình JSON thành công!');
  };

  const handleImportJson = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        setConfig(parsed);
        showNotification('success', 'Đã nạp file cấu hình thành công!');
      } catch (err) {
        showNotification('error', 'File JSON không hợp lệ!');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const permanentBytes = encodeConfig(config, true);
  const tempBytes = encodeConfig(config, false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-medium backdrop-blur-md ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40 shadow-emerald-950/50'
              : notification.type === 'error'
              ? 'bg-rose-950/90 text-rose-200 border-rose-500/40 shadow-rose-950/50'
              : 'bg-slate-900/95 text-blue-200 border-blue-500/40 shadow-blue-950/50'
          }`}>
            {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
            {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
            {notification.type === 'info' && <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <Header
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenCode={() => setIsCodeOpen(true)}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Port Connection Bar */}
        <PortConnection
          isConnected={isConnected}
          isConnecting={isConnecting}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />

        {/* Hardware Visualizer */}
        <ModuleVisualizer
          config={config}
          isConnected={isConnected}
          isTransmitting={isTxActive}
          isReceiving={isRxActive}
        />

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 space-x-2">
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition ${
              activeTab === 'settings'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Cấu Hình Tham Số & Mẫu</span>
          </button>

          <button
            onClick={() => setActiveTab('inspector')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition ${
              activeTab === 'inspector'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Trực Quan Khung Hex & Lệnh</span>
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition ${
              activeTab === 'terminal'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <SendHorizontal className="w-4 h-4" />
            <span>Thử Nghiệm Gói Tin & Nhật Ký Serial</span>
          </button>
        </div>

        {/* TAB 1: SETTINGS & PRESETS */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Quick Presets Bar */}
            <PresetBar
              onApplyPreset={handleApplyPreset}
              currentConfig={config}
            />

            {/* Brand & Model Selection */}
            <BrandModelSelector
              config={config}
              onChange={handleUpdateConfig}
            />

            {/* Basic & Advanced Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BasicSettings
                config={config}
                onChange={handleUpdateConfig}
              />
              <AdvancedSettings
                config={config}
                onChange={handleUpdateConfig}
              />
            </div>
          </div>
        )}

        {/* TAB 2: HEX INSPECTOR */}
        {activeTab === 'inspector' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <HexPreview
              config={config}
              isConnected={isConnected}
              onSendCommand={handleSendCommand}
              onExportJson={handleExportJson}
              onImportJson={handleImportJson}
            />
          </div>
        )}

        {/* TAB 3: PACKET TESTER & TERMINAL */}
        {activeTab === 'terminal' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Packet Builder & Tester */}
            <PacketTester
              isConnected={isConnected}
              onSendPacket={handleSendCommand}
            />

            {/* Serial Communication Terminal Log */}
            <TerminalLog
              logs={logs}
              onClear={() => setLogs([])}
              onSendCustomHex={handleSendCommand}
              isConnected={isConnected}
            />
          </div>
        )}
      </main>

      {/* Floating Action Bar for Quick Hardware Operations */}
      <div className="sticky bottom-0 z-30 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 py-3 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Thao tác nhanh:</span>
            <span className="font-mono text-xs font-bold text-slate-200 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              {bytesToHex(permanentBytes)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSendCommand(COMMANDS.READ_PARAMS, 'Đọc tham số (0xC1 0xC1 0xC1)')}
              disabled={!isConnected}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition disabled:opacity-40 shadow-sm"
              title="Đọc thông số hiện tại từ module E32/AS32"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Đọc Tham Số</span>
            </button>

            <button
              onClick={() => handleSendCommand(permanentBytes, 'Ghi & Lưu Flash (0xC0...)')}
              disabled={!isConnected}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition disabled:opacity-40 shadow-sm"
              title="Lưu vĩnh viễn vào EEPROM của module"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Ghi & Lưu Flash</span>
            </button>

            <button
              onClick={() => handleSendCommand(tempBytes, 'Ghi tạm thời (0xC2...)')}
              disabled={!isConnected}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition disabled:opacity-40"
              title="Cấu hình tạm thời, mất khi tắt nguồn"
            >
              <FileCode className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Ghi Tạm Thời</span>
            </button>

            <button
              onClick={() => handleSendCommand(COMMANDS.RESET_MODULE, 'Reset Module (0xC4 0xC4 0xC4)')}
              disabled={!isConnected}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 transition disabled:opacity-40"
              title="Khởi động lại module"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden md:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        PTITCube Project • Universal RF Configurator for Ebyte E32 & Ashining AS32 • Open Source under MIT License
      </footer>

      {/* Pinout Guide Modal */}
      <PinoutGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Code Generator Modal */}
      <CodeGeneratorModal
        isOpen={isCodeOpen}
        onClose={() => setIsCodeOpen(false)}
        config={config}
      />
    </div>
  );
}
