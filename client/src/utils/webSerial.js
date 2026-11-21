/**
 * ============================================================================
 * Web Serial API Driver for E32 & AS32 RF Configurator
 * ============================================================================
 * Enables direct browser-to-hardware communication via USB-to-UART bridge
 * (CH340, CP2102, FT232, PL2303, ESP32 CDC, etc.) without installing any software.
 * ============================================================================
 */

export class WebSerialPort {
  constructor() {
    this.port = null;
    this.reader = null;
    this.writer = null;
    this.isOpen = false;
    this.isReading = false;
    this.onDataCallback = null;
    this.onErrorCallback = null;
    this.onCloseCallback = null;
  }

  static isSupported() {
    return typeof navigator !== 'undefined' && 'serial' in navigator;
  }

  /**
   * Yêu cầu người dùng chọn cổng COM và mở kết nối
   * @param {number} baudRate - Mặc định 9600 cho chế độ cấu hình E32/AS32
   */
  async connect(baudRate = 9600) {
    if (!WebSerialPort.isSupported()) {
      throw new Error('Trình duyệt của bạn không hỗ trợ Web Serial API. Vui lòng sử dụng Google Chrome, Microsoft Edge hoặc Opera trên máy tính.');
    }

    try {
      this.port = await navigator.serial.requestPort();
      await this.port.open({
        baudRate: Number(baudRate),
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
        bufferSize: 1024,
        flowControl: 'none'
      });

      this.isOpen = true;
      this.startReading();

      // Lắng nghe sự kiện ngắt kết nối vật lý (rút cáp USB)
      this.port.addEventListener('disconnect', () => {
        this.disconnect();
      });

      return true;
    } catch (err) {
      this.isOpen = false;
      throw err;
    }
  }

  /**
   * Bắt đầu luồng đọc dữ liệu từ cổng COM
   */
  async startReading() {
    if (!this.port || !this.port.readable || this.isReading) return;

    this.isReading = true;
    while (this.port && this.port.readable && this.isOpen) {
      try {
        this.reader = this.port.readable.getReader();
        while (true) {
          const { value, done } = await this.reader.read();
          if (done) break;
          if (value && value.length > 0) {
            if (this.onDataCallback) {
              this.onDataCallback(value);
            }
          }
        }
      } catch (error) {
        if (this.onErrorCallback) {
          this.onErrorCallback(error);
        }
        break;
      } finally {
        if (this.reader) {
          try {
            this.reader.releaseLock();
          } catch (e) {}
          this.reader = null;
        }
      }
    }
    this.isReading = false;
  }

  /**
   * Gửi dữ liệu (Uint8Array hoặc Array) ra cổng COM
   * @param {Uint8Array|Array} data 
   */
  async send(data) {
    if (!this.port || !this.port.writable || !this.isOpen) {
      throw new Error('Cổng COM chưa được mở!');
    }

    const payload = data instanceof Uint8Array ? data : new Uint8Array(data);
    this.writer = this.port.writable.getWriter();
    try {
      await this.writer.write(payload);
    } finally {
      this.writer.releaseLock();
      this.writer = null;
    }
  }

  /**
   * Đóng kết nối cổng COM an toàn
   */
  async disconnect() {
    this.isOpen = false;
    this.isReading = false;

    if (this.reader) {
      try {
        await this.reader.cancel();
        this.reader.releaseLock();
      } catch (e) {}
      this.reader = null;
    }

    if (this.writer) {
      try {
        this.writer.releaseLock();
      } catch (e) {}
      this.writer = null;
    }

    if (this.port) {
      try {
        await this.port.close();
      } catch (e) {}
      this.port = null;
    }

    if (this.onCloseCallback) {
      this.onCloseCallback();
    }
  }

  onData(cb) { this.onDataCallback = cb; }
  onError(cb) { this.onErrorCallback = cb; }
  onClose(cb) { this.onCloseCallback = cb; }
}

export const serialDriver = new WebSerialPort();
