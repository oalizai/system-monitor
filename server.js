const express = require('express');
const si = require('systeminformation');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/stats', async (req, res) => {
  try {
    const [cpu, mem, disk] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize()
    ]);

    res.json({
      cpu: Math.round(cpu.currentLoad),
      memory: {
        used: Math.round(mem.used / 1024 / 1024 / 1024 * 10) / 10,
        total: Math.round(mem.total / 1024 / 1024 / 1024 * 10) / 10,
        percent: Math.round(mem.used / mem.total * 100)
      },
      disk: {
        used: Math.round(disk[0].used / 1024 / 1024 / 1024 * 10) / 10,
        total: Math.round(disk[0].size / 1024 / 1024 / 1024 * 10) / 10,
        percent: Math.round(disk[0].use)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`System Monitor running at http://localhost:${3000}`);
});