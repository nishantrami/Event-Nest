import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import os from 'os'

function getLocalIp() {
  const nets = os.networkInterfaces()
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address
      }
    }
  }
  return 'localhost'
}

function networkIpPlugin() {
  return {
    name: 'network-ip-plugin',
    configureServer(server) {
      server.middlewares.use('/api/network-ip', (req, res) => {
        const ip = getLocalIp()
        const port = server.config.server.port || 5173
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.end(JSON.stringify({ ip, port, host: `${ip}:${port}` }))
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    networkIpPlugin()
  ],
  server: {
    host: true, // Listen on 0.0.0.0 for mobile device access
    port: 5173
  }
})

