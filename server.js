const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for location data from the client
  socket.on('location', (data) => {
    console.log('Received location:', data);

    // Broadcast the location to all connected clients
    io.emit('updateLocation', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
