import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API: Kiểm tra trạng thái server
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'PTITCube RF Configurator Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API: Mã hóa cấu hình sang chuỗi Hex
app.post('/api/encode', (req, res) => {
  try {
    const config = req.body;
    const savePermanent = req.query.save !== 'false';

    const head = savePermanent ? 0xC0 : 0xC2;
    const addr = Number(config.address || 0) & 0xFFFF;
    const addh = (addr >> 8) & 0xFF;
    const addl = addr & 0xFF;

    const parity = (Number(config.uartParity || 0) & 0x03) << 6;
    const baud = (Number(config.uartBaud || 3) & 0x07) << 3;
    const airRate = (Number(config.airDataRate || 2) & 0x07);
    const sped = parity | baud | airRate;

    const chan = Number(config.channel || 23) & 0x1F;

    const fixed = (Number(config.fixedPoint || 0) & 0x01) << 7;
    const io = (Number(config.ioDrive !== undefined ? config.ioDrive : 1) & 0x01) << 6;
    const wake = (Number(config.wakeUpTime || 0) & 0x07) << 3;
    const fec = (Number(config.fec !== undefined ? config.fec : 1) & 0x01) << 2;
    const pwr = (Number(config.powerLevel || 0) & 0x03);
    const option = fixed | io | wake | fec | pwr;

    const bytes = [head, addh, addl, sped, chan, option];
    const hex = bytes.map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');

    res.json({ success: true, bytes, hex });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// API: Giải mã chuỗi Hex sang cấu hình
app.post('/api/decode', (req, res) => {
  try {
    const { hex } = req.body;
    if (!hex) return res.status(400).json({ error: 'Missing hex parameter' });

    const clean = hex.replace(/[^0-9a-fA-F]/g, '');
    if (clean.length < 12) return res.status(400).json({ error: 'Hex string must be at least 6 bytes (12 chars)' });

    const bytes = [];
    for (let i = 0; i < 12; i += 2) {
      bytes.push(parseInt(clean.substring(i, i + 2), 16));
    }

    const head = bytes[0];
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

    res.json({
      success: true,
      data: {
        head: '0x' + head.toString(16).toUpperCase(),
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
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Phục vụ frontend tĩnh khi build production
const clientDist = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDist));

app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('Frontend not built. Run "npm run build" in client directory.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`[RF-Setting Backend] Server running at http://localhost:${PORT}`);
});
