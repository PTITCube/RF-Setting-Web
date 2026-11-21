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
import {
  DEFAULT_CONFIG,
  decodeConfig,
  bytesToHex
} from './utils/loraProtocol';
import { serialDriver } from './utils/webSerial';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('ptitcube_rf_config');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_CONFIG;
  });

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [notification, setNotification] = useState(null);

  // Lưu cấu hình vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem('ptitcube_rf_config', JSON.stringify(config));
  }, [config]);

  // Thiết lập sự kiện cổng Serial
  useEffect(() => {
    serialDriver.onData((incomingBytes) => {
      const now = new Date().toLocaleTimeString();
      const hexStr = bytesToHex(incomingBytes);

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-medium ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40'
              : notification.type === 'error'
              ? 'bg-rose-950/90 text-rose-200 border-rose-500/40'
              : 'bg-slate-900/90 text-blue-200 border-blue-500/40'
          }`}>
            {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
            {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
            {notification.type === 'info' && <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <Header onOpenGuide={() => setIsGuideOpen(true)} />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Port Connection Bar */}
        <PortConnection
          isConnected={isConnected}
          isConnecting={isConnecting}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />

        {/* Brand & Model Selector */}
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

        {/* Hex Frame Visualizer & Hardware Actions */}
        <HexPreview
          config={config}
          isConnected={isConnected}
          onSendCommand={handleSendCommand}
          onExportJson={handleExportJson}
          onImportJson={handleImportJson}
        />

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
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        PTITCube Project • Universal RF Configurator for Ebyte E32 & Ashining AS32 • Open Source under MIT License
      </footer>

      {/* Pinout Guide Modal */}
      <PinoutGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
