# PTITCube RF Configurator (E32 & AS32 Setting Web)

[![Deploy to GitHub Pages](https://github.com/PTITCube/RF-Setting-Web/actions/workflows/deploy.yml/badge.svg)](https://github.com/PTITCube/RF-Setting-Web/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-blue?logo=github)](https://ptitcube.github.io/RF-Setting-Web/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**PTITCube RF Configurator** là ứng dụng web hiện đại dùng để đọc, kiểm tra và cài đặt tham số cho các dòng module truyền thông vô tuyến LoRa **Ebyte E32** (E32-433T20D, E32-433T30D, E32-868T20D, E32-915T20D, ...) và **Ashining AS32** (AS32-TTL-100, AS32-TTL-1W, AS32-TTL-500, ...). Ứng dụng cung cấp đầy đủ chức năng tương đương các phần mềm desktop chính hãng như **RF_Setting** của Ebyte và **ASDS** của Ashining nhưng hoạt động trực tiếp trên trình duyệt web thông qua **Web Serial API**.

---

## 🌟 Tính Năng Nổi Bật

1. **Giao tiếp trực tiếp phần cứng qua Web Serial API**:
   - Kết nối trực tiếp mạch nạp USB-UART (CH340, CP2102, FT232, PL2303, ESP32 CDC) qua cổng COM ngay trên trình duyệt mà không cần cài đặt driver phức tạp hay phần mềm ngoài.
2. **Hỗ trợ đầy đủ cả 2 thương hiệu**:
   - **Ebyte**: Toàn bộ dòng E32 (dải tần 410~441MHz, 470MHz, 868MHz, 915MHz, 170MHz; công suất 100mW, 500mW, 1W).
   - **Ashining**: Toàn bộ dòng AS32 tương thích pin-to-pin và register.
3. **Bộ cấu hình tham số trực quan**:
   - **Địa chỉ Module (ADDH / ADDL)**: Hỗ trợ nạp địa chỉ dạng Dec (0 ~ 65535) và Hex (0x0000 ~ 0xFFFF), nút gán nhanh Broadcast `0xFFFF`.
   - **Kênh truyền (CHAN)**: Tự động tính toán tần số thực tế (MHz) theo bước nhảy của từng dải băng tần.
   - **Tốc độ UART & Parity**: 1200 ~ 115200 bps; 8N1, 8O1, 8E1.
   - **Tốc độ vô tuyến (Air Data Rate)**: 0.3k, 1.2k, 2.4k, 4.8k, 9.6k, 19.2k bps.
   - **Chế độ truyền (Transmission Mode)**: Truyền trong suốt (Transparent) hoặc truyền định điểm (Fixed-point: `[ADDH][ADDL][CHAN][DATA]`).
   - **Công suất phát (Transmission Power)**: 20dBm / 17dBm / 14dBm / 10dBm (với bản 100mW) hoặc 30dBm / 27dBm / 24dBm / 21dBm (với bản 1W).
   - **Sửa lỗi trước vô tuyến (FEC)**: Bật/Tắt chống nhiễu gói tin.
   - **Thời gian đánh thức không dây (WOR)**: 250ms ~ 2000ms.
   - **Chế độ kích chân IO (TXD/AUX)**: Push-Pull hoặc Open-Collector.
4. **Trình trực quan hóa khung byte Hex (Hex Frame Visualizer)**:
   - Hiển thị cấu trúc chi tiết 6 byte lệnh cấu hình với màu sắc phân định theo từng trường dữ liệu.
   - Các nút thao tác phần cứng nhanh:
     - 📥 **Đọc Tham Số**: Gửi `0xC1 0xC1 0xC1`
     - 💾 **Ghi & Lưu Flash (EEPROM)**: Gửi `0xC0 [ADDH] [ADDL] [SPED] [CHAN] [OPTION]`
     - ⚡ **Ghi Tạm Thời (Mất khi tắt nguồn)**: Gửi `0xC2 ...`
     - ℹ️ **Đọc Model & Phiên Bản**: Gửi `0xC3 0xC3 0xC3`
     - 🔄 **Reset Module**: Gửi `0xC4 0xC4 0xC4`
5. **Công cụ kiểm tra & phát gói tin vô tuyến (Packet Builder & Tester)**:
   - Thử nghiệm gửi dữ liệu kiểm tra kết nối điểm-điểm hoặc phát tán (broadcast) với trường payload tùy ý.
6. **Nhật ký truyền thông thời gian thực (Terminal Log)**:
   - Hiển thị toàn bộ gói TX / RX kèm timestamp và dạng mã Hex.
   - Hỗ trợ gửi chuỗi Hex tùy ý.
7. **Lưu & Nạp Profile**:
   - Xuất cấu hình ra file `.json` và nhập lại profile bất cứ lúc nào.

---

## 🔌 Sơ Đồ Đấu Nối Phần Cứng

### 1. Bảng 4 Chế độ hoạt động qua chân M0 và M1

| Chế độ (Mode) | M1 | M0 | Mô tả chức năng |
|---|:---:|:---:|---|
| **Mode 0 (Normal)** | 0 (GND) | 0 (GND) | Chế độ truyền nhận dữ liệu thông thường. |
| **Mode 1 (Wake-up)** | 0 (GND) | 1 (VCC) | Tự động thêm preamble đánh thức máy thu ở Mode 2. |
| **Mode 2 (Power-saving)** | 1 (VCC) | 0 (GND) | Tiết kiệm năng lượng (WOR), lắng nghe preamble. |
| **Mode 3 (Sleep / Config)** | **1 (VCC)** | **1 (VCC)** | **BẮT BUỘC KHI ĐỌC/GHI CẤU HÌNH BẰNG WEB NÀY!** UART cố định 9600 8N1. |

> ⚠️ **LƯU Ý QUAN TRỌNG:**
> - Để web có thể **Đọc** hoặc **Ghi** tham số, bạn phải gạt switch hoặc nối chân **M0 lên VCC (3.3V)** và **M1 lên VCC (3.3V)**.
> - Sau khi cấu hình xong, đưa **M0 về GND** và **M1 về GND** để module hoạt động bình thường.

### 2. Sơ đồ nối dây với mạch USB-to-UART (CH340 / CP2102 / FT232):

```text
Mạch USB-to-UART                 Module E32 / AS32
   [ VCC (3.3V/5V) ] ------------> [ VCC ]
   [ GND ] ----------------------> [ GND ]
   [ RXD ] ----------------------> [ TXD ]
   [ TXD ] ----------------------> [ RXD ]
   [ 3.3V ] ---------------------> [ M0 ]  (Khi nạp cấu hình)
   [ 3.3V ] ---------------------> [ M1 ]  (Khi nạp cấu hình)
```

---

## 🚀 Cấu Trúc Mã Nguồn

Dự án gồm 2 phần được tổ chức khoa học:
- **`client/`**: Ứng dụng Frontend xây dựng bằng **ReactJS 18 + Vite + Tailwind CSS + Lucide Icons**.
  - `src/utils/loraProtocol.js`: Bộ mã hóa/giải mã toàn bộ khung truyền E32 & AS32.
  - `src/utils/webSerial.js`: Trình điều khiển Web Serial API cho cổng COM.
- **`server/`**: Backend xây dựng bằng **NodeJS + Express**:
  - Cung cấp REST API `/api/encode`, `/api/decode` phục vụ kiểm thử hoặc tích hợp mở rộng.
- **`.github/workflows/deploy.yml`**: Tự động hóa CI/CD build React app và deploy lên GitHub Pages mỗi khi push code lên nhánh `main`.

---

## 💻 Hướng Dẫn Cài Đặt & Chạy Cục Bộ (Local)

### 1. Yêu cầu hệ thống
- Node.js version 18 trở lên
- Trình duyệt hỗ trợ Web Serial API: Google Chrome, Microsoft Edge, Brave hoặc Opera.

### 2. Khởi chạy ứng dụng

```bash
# Clone repository
git clone https://github.com/PTITCube/RF-Setting-Web.git
cd RF-Setting-Web

# Cài đặt toàn bộ dependencies cho Client và Server
npm run install:all

# Chạy Frontend React (chạy tại http://localhost:5173)
npm run dev

# Hoặc chạy kèm NodeJS Backend Server (chạy tại http://localhost:3001)
npm run dev:server
```

---

## 🌐 Triển Khai GitHub Pages (CI/CD)

Repository này đã được tích hợp GitHub Actions trong file `.github/workflows/deploy.yml`:
1. Mỗi khi push vào nhánh `main`, action tự động chạy `npm run build` trên thư mục `client/`.
2. Toàn bộ thư mục `client/dist` sẽ được tự động triển khai lên nhánh `gh-pages`.
3. Ứng dụng trực tuyến luôn sẵn sàng tại địa chỉ:
   👉 **`https://ptitcube.github.io/RF-Setting-Web/`**

---

## 📜 Giấy Phép (License)

Dự án phát hành dưới giấy phép **MIT License** thuộc tổ chức **PTITCube**.
