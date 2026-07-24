import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL }
});

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Routes will go here
// app.use('/api/tickets', ticketRoutes);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
});
app.get('/', (req, res) => {
  res.json({ message: 'CivicLens AI backend is running 🚀' });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));