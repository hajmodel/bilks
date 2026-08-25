const express = require('express');
const { ExpressPeerServer } = require('peer');
const http = require('http');
const path = require('path');
 
const app = express();
const PORT = process.env.PORT || 3000;
 
// simple health endpoint for Railway checks
app.get('/healthz', (req, res) => res.json({ ok: true, game: 'neon-city-strike' }));
 
// serve the game
app.use(express.static(path.join(__dirname, 'public')));
 
const server = http.createServer(app);
 
// PeerJS signalling mounted DIRECTLY on the same app/port at /peerjs —
// same URL structure as the old standalone-server+proxy setup, but with
// no extra process and no proxy package (which broke under ESM).
// Rooms are just peer IDs; the game client prefixes them with 'ncs-v2-'.
const peerServer = ExpressPeerServer(server, {
  path: '/peerjs',
  allow_discovery: false,
  proxied: true,
});
app.use(peerServer);
 
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Neon City Strike running on port ${PORT}`);
  console.log(`PeerJS signalling available at /peerjs`);
});
 
