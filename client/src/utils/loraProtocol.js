/**
 * ============================================================================
 * Ebyte E32 & Ashining AS32 Protocol Engine
 * ============================================================================
 * Supports both Ebyte (E32-433T20D, E32-433T30D, E32-868T20D, E32-915T20D)
 * and Ashining (AS32-TTL-100, AS32-TTL-1W, AS32-TTL-500, etc.)
 * Compatible with RF_Setting & ASDS official configuration tools.
 * ============================================================================
 */

export const BRANDS = {
  EBYTE: 'Ebyte',
  ASHINING: 'Ashining'
};

export const FREQ_BANDS = {
  '433': { name: '433 MHz (410 ~ 441 MHz)', baseFreq: 410, step: 1, defaultChan: 23, maxChan: 31 },
  '470': { name: '470 MHz (470 ~ 510 MHz)', baseFreq: 470, step: 1, defaultChan: 0, maxChan: 31 },
  '868': { name: '868 MHz (862 ~ 893 MHz)', baseFreq: 862, step: 1, defaultChan: 6, maxChan: 31 },
  '915': { name: '915 MHz (900 ~ 931 MHz)', baseFreq: 900, step: 1, defaultChan: 15, maxChan: 31 },
  '170': { name: '170 MHz (160 ~ 173 MHz)', baseFreq: 160, step: 0.5, defaultChan: 20, maxChan: 31 }
};

export const POWER_MODELS = {
  '100mW': {
    name: '100mW (20dBm)',
    levels: [
      { value: 0, label: '20 dBm (~100 mW)' },
      { value: 1, label: '17 dBm (~50 mW)' },
      { value: 2, label: '14 dBm (~25 mW)' },
      { value: 3, label: '10 dBm (~10 mW)' },
    ]
  },
  '1W': {
    name: '1W / 1000mW (30dBm)',
    levels: [
      { value: 0, label: '30 dBm (~1000 mW)' },
      { value: 1, label: '27 dBm (~500 mW)' },
      { value: 2, label: '24 dBm (~250 mW)' },
      { value: 3, label: '21 dBm (~125 mW)' },
    ]
  },
  '500mW': {
    name: '500mW (27dBm)',
    levels: [
      { value: 0, label: '27 dBm (~500 mW)' },
      { value: 1, label: '24 dBm (~250 mW)' },
      { value: 2, label: '21 dBm (~125 mW)' },
      { value: 3, label: '18 dBm (~63 mW)' },
    ]
  }
};

export const UART_PARITY = [
  { value: 0, label: '8N1 (None Parity)' },
  { value: 1, label: '8O1 (Odd Parity)' },
  { value: 2, label: '8E1 (Even Parity)' },
  { value: 3, label: '8N1 (Equal to 00)' }
];

export const UART_BAUD_RATES = [
  { value: 0, rate: 1200, label: '1200 bps' },
  { value: 1, rate: 2400, label: '2400 bps' },
  { value: 2, rate: 4800, label: '4800 bps' },
  { value: 3, rate: 9600, label: '9600 bps (Mặc định)' },
  { value: 4, rate: 19200, label: '19200 bps' },
  { value: 5, rate: 38400, label: '38400 bps' },
  { value: 6, rate: 57600, label: '57600 bps' },
  { value: 7, rate: 115200, label: '115200 bps' }
];

export const AIR_DATA_RATES = [
  { value: 0, rate: 300, label: '0.3 kbps (300 bps - Xuyên xa nhất)' },
  { value: 1, rate: 1200, label: '1.2 kbps' },
  { value: 2, rate: 2400, label: '2.4 kbps (Mặc định)' },
  { value: 3, rate: 4800, label: '4.8 kbps' },
  { value: 4, rate: 9600, label: '9.6 kbps' },
  { value: 5, rate: 19200, label: '19.2 kbps (Tốc độ cao nhất)' },
  { value: 6, rate: 19200, label: '19.2 kbps (Tương đương 101)' },
  { value: 7, rate: 19200, label: '19.2 kbps (Tương đương 101)' }
];

export const WAKE_UP_TIMES = [
  { value: 0, time: 250, label: '250 ms (Mặc định)' },
  { value: 1, time: 500, label: '500 ms' },
  { value: 2, time: 750, label: '750 ms' },
  { value: 3, time: 1000, label: '1000 ms' },
  { value: 4, time: 1250, label: '1250 ms' },
  { value: 5, time: 1500, label: '1500 ms' },
  { value: 6, time: 1750, label: '1750 ms' },
  { value: 7, time: 2000, label: '2000 ms' }
];

export const TRANSMISSION_MODES = [
  { value: 0, label: 'Truyền trong suốt (Transparent Transmission - Broadcast)' },
  { value: 1, label: 'Truyền điểm-điểm (Fixed-point Transmission: [ADDH][ADDL][CHAN][DATA])' }
];

export const IO_DRIVE_MODES = [
  { value: 1, label: 'Push-Pull (TXD/AUX đẩy kéo, RXD kéo lên - Mặc định)' },
  { value: 0, label: 'Open-Collector (Cực thu hở - Cần trở kéo ngoài)' }
];

export const DEFAULT_CONFIG = {
  brand: BRANDS.EBYTE,
  band: '433',
  powerModel: '100mW',
  address: 0x0000, // 0 - 65535
  uartParity: 0,   // 8N1
  uartBaud: 3,     // 9600 bps
  airDataRate: 2,  // 2.4 kbps
  channel: 23,     // 0x17 = 433 MHz
  fixedPoint: 0,   // Transparent
  ioDrive: 1,      // Push-Pull
  wakeUpTime: 0,   // 250ms
  fec: 1,          // Enable FEC
  powerLevel: 0    // 20dBm / max power
};

/**
 * Tính toán tần số thực tế dựa trên dải tần và kênh
 */
export function calculateFrequency(bandKey, channel) {
  const band = FREQ_BANDS[bandKey] || FREQ_BANDS['433'];
  const chan = Math.min(Math.max(0, Number(channel) || 0), band.maxChan);
  const freq = band.baseFreq + (chan * band.step);
  return freq.toFixed(band.step < 1 ? 1 : 0);
}

/**
 * Đóng gói 6-byte lệnh cấu hình
 * @param {Object} config 
 * @param {boolean} savePermanent - true = 0xC0 (lưu Flash), false = 0xC2 (tạm thời)
 * @returns {Uint8Array} Mảng 6 bytes
 */
export function encodeConfig(config, savePermanent = true) {
  const head = savePermanent ? 0xC0 : 0xC2;
  const addr = Number(config.address) & 0xFFFF;
  const addh = (addr >> 8) & 0xFF;
  const addl = addr & 0xFF;

  // SPED byte:
  // Bit 7-6: Parity (00=8N1, 01=8O1, 10=8E1)
  // Bit 5-3: UART Baud (000=1200 .. 111=115200)
  // Bit 2-0: Air Data Rate (000=0.3k .. 101=19.2k)
  const parity = (Number(config.uartParity) & 0x03) << 6;
  const baud = (Number(config.uartBaud) & 0x07) << 3;
  const airRate = (Number(config.airDataRate) & 0x07);
  const sped = parity | baud | airRate;

  // CHAN byte:
  // Bit 4-0: Channel (0x00 - 0x1F)
  const chan = Number(config.channel) & 0x1F;

  // OPTION byte:
  // Bit 7: Fixed-point transmission (0=Transparent, 1=Fixed)
  // Bit 6: IO drive mode (1=Push-Pull, 0=Open-Collector)
  // Bit 5-3: Wireless wake-up time (000=250ms .. 111=2000ms)
  // Bit 2: FEC (1=Enable, 0=Disable)
  // Bit 1-0: Transmission Power (00=Max .. 11=Min)
  const fixed = (Number(config.fixedPoint) & 0x01) << 7;
  const io = (Number(config.ioDrive) & 0x01) << 6;
  const wake = (Number(config.wakeUpTime) & 0x07) << 3;
  const fec = (Number(config.fec) & 0x01) << 2;
  const pwr = (Number(config.powerLevel) & 0x03);
  const option = fixed | io | wake | fec | pwr;

  return new Uint8Array([head, addh, addl, sped, chan, option]);
}

/**
 * Giải mã chuỗi 6-byte nhận được từ Module thành cấu hình
 * @param {Uint8Array|Array} bytes 
 * @returns {Object|null}
 */
export function decodeConfig(bytes) {
  if (!bytes || bytes.length < 6) return null;

  const head = bytes[0];
  if (head !== 0xC0 && head !== 0xC2) {
    return null; // Không phải frame phản hồi tham số hợp lệ
  }

  const addh = bytes[1];
  const addl = bytes[2];
  const address = (addh << 8) | addl;

  const sped = bytes[3];
  const uartParity = (sped >> 6) & 0x03;
  const uartBaud = (sped >> 3) & 0x07;
  const airDataRate = sped & 0x07;

  const chan = bytes[4];
  const channel = chan & 0x1F;

  const option = bytes[5];
  const fixedPoint = (option >> 7) & 0x01;
  const ioDrive = (option >> 6) & 0x01;
  const wakeUpTime = (option >> 3) & 0x07;
  const fec = (option >> 2) & 0x01;
  const powerLevel = option & 0x03;

  return {
    head,
    savePermanent: head === 0xC0,
    address,
    uartParity,
    uartBaud,
    airDataRate,
    channel,
    fixedPoint,
    ioDrive,
    wakeUpTime,
    fec,
    powerLevel
  };
}

/**
 * Lệnh chuẩn của E32 / AS32
 */
export const COMMANDS = {
  READ_PARAMS: new Uint8Array([0xC1, 0xC1, 0xC1]),
  READ_VERSION: new Uint8Array([0xC3, 0xC3, 0xC3]),
  RESET_MODULE: new Uint8Array([0xC4, 0xC4, 0xC4])
};

/**
 * Chuyển đổi Uint8Array sang chuỗi Hex format: "C0 00 00 1A 17 44"
 */
export function bytesToHex(bytes) {
  if (!bytes) return '';
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0').toUpperCase())
    .join(' ');
}

/**
 * Chuyển đổi chuỗi Hex thành Uint8Array
 */
export function hexToBytes(hexStr) {
  const clean = hexStr.replace(/[^0-9a-fA-F]/g, '');
  if (clean.length % 2 !== 0) return null;
  const result = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    result[i / 2] = parseInt(clean.substring(i, i + 2), 16);
  }
  return result;
}

/**
 * Phân tích chi tiết từng bit của byte để hiển thị trực quan
 */
export function inspectBits(byte) {
  const binary = (byte >>> 0).toString(2).padStart(8, '0');
  return binary.split('').map((bit, idx) => ({
    bitIndex: 7 - idx,
    value: Number(bit)
  }));
}

/**
 * Cấu hình mẫu định sẵn (Presets)
 */
export const PRESETS = [
  {
    id: 'default',
    name: 'Mặc Định Nhà Sản Xuất',
    desc: 'Baud 9600, AirRate 2.4k, CH 23 (433MHz), Max Power, FEC Bật',
    badge: 'Khuyên dùng',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    config: {
      address: 0x0000,
      uartBaud: 3,     // 9600
      uartParity: 0,   // 8N1
      airDataRate: 2,  // 2.4k
      channel: 23,     // 433 MHz
      fixedPoint: 0,   // Transparent
      powerLevel: 0,   // Max Power
      fec: 1,          // FEC On
      ioDrive: 1,      // Push-Pull
      wakeUpTime: 0    // 250ms
    }
  },
  {
    id: 'max-range',
    name: 'Khoảng Cách Tối Đa (Long Range)',
    desc: 'AirRate 0.3k (300bps) độ nhạy cao nhất, Max Power 20/30dBm, FEC Bật',
    badge: 'Xuyên xa',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    config: {
      address: 0x0000,
      uartBaud: 3,     // 9600
      uartParity: 0,   // 8N1
      airDataRate: 0,  // 0.3k (300 bps)
      channel: 23,
      fixedPoint: 0,
      powerLevel: 0,
      fec: 1,
      ioDrive: 1,
      wakeUpTime: 0
    }
  },
  {
    id: 'high-speed',
    name: 'Tốc Độ Cao (High Speed)',
    desc: 'UART 115200 bps, AirRate 19.2 kbps, độ trễ thấp cho luồng dữ liệu lớn',
    badge: 'Nhanh nhất',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    config: {
      address: 0x0000,
      uartBaud: 7,     // 115200
      uartParity: 0,
      airDataRate: 5,  // 19.2k
      channel: 23,
      fixedPoint: 0,
      powerLevel: 0,
      fec: 1,
      ioDrive: 1,
      wakeUpTime: 0
    }
  },
  {
    id: 'fixed-point',
    name: 'Truyền Điểm-Điểm (Fixed-point Mesh)',
    desc: 'Địa chỉ 0x0001, Chế độ truyền định điểm [ADDH][ADDL][CHAN][DATA]',
    badge: 'Mạng lưới',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    config: {
      address: 0x0001,
      uartBaud: 3,
      uartParity: 0,
      airDataRate: 2,
      channel: 23,
      fixedPoint: 1,   // Fixed point
      powerLevel: 0,
      fec: 1,
      ioDrive: 1,
      wakeUpTime: 0
    }
  }
];

/**
 * Tạo mã nguồn C/C++ mẫu cho Arduino / ESP32
 */
export function generateCppCode(config, savePermanent = true) {
  const bytes = encodeConfig(config, savePermanent);
  const hexArray = Array.from(bytes).map(b => '0x' + b.toString(16).padStart(2, '0').toUpperCase()).join(', ');
  const freq = calculateFrequency(config.band, config.channel);
  const baudItem = UART_BAUD_RATES.find(b => b.value === config.uartBaud);
  const baudRate = baudItem ? baudItem.rate : 9600;

  return `// ============================================================================
// Mã khởi tạo cấu hình E32 / AS32 cho Arduino / ESP32
// Tần số: ${freq} MHz | Kênh: ${config.channel} | Baudrate: ${baudRate} bps
// ============================================================================
#include <Arduino.h>

// Mảng 6-byte lệnh cấu hình
const uint8_t LORA_CFG[6] = { ${hexArray} };

void configureLoRa() {
    // 1. Kéo chân M0=HIGH, M1=HIGH để module vào Mode 3 (Sleep/Config)
    pinMode(32, OUTPUT); // M0
    pinMode(33, OUTPUT); // M1
    digitalWrite(32, HIGH);
    digitalWrite(33, HIGH);
    delay(50); // Chờ ổn định

    // 2. Giao tiếp UART cấu hình luôn ở 9600 bps 8N1
    Serial1.begin(9600, SERIAL_8N1, 26, 25); // RX=26, TX=25
    delay(20);

    // 3. Gửi chuỗi 6-byte cấu hình
    Serial1.write(LORA_CFG, sizeof(LORA_CFG));
    Serial1.flush();
    delay(100);

    // 4. Đưa M0=LOW, M1=LOW để trở lại Mode 0 (Normal) hoạt động
    digitalWrite(32, LOW);
    digitalWrite(33, LOW);
    delay(50);

    // 5. Khởi tạo lại UART với baudrate hoạt động đã cài đặt (${baudRate} bps)
    Serial1.begin(${baudRate}, SERIAL_8N1, 26, 25);
}
`;
}

