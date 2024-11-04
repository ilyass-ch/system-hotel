const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { notFound, errorHandler } = require('./middlewares/error');
const path = require('path');
// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 9000;
// For parsing JSON bodies
app.use(express.json());

// For parsing URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true // Allow credentials to be included
}));
app.use(cookieParser());

// Define routes (Example routes, adjust as needed)
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const hotelRoute = require('./routes/hotels');
const cityRoute = require('./routes/cities');
const roomRoute = require('./routes/rooms');
const reservationRoute = require('./routes/reservations');
const transactionRoute = require('./routes/transactions');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messages');
const imageRoute = require('./routes/image');
const braintreeRoutes = require('./routes/braintree'); // Uncomment if needed

console.log('Routes setup...');
app.use('/api/image', imageRoute);
app.use('/api', authRoute);
app.use('/api/user', userRoute);
app.use('/api/hotel', hotelRoute);
app.use('/api/city', cityRoute);
app.use('/api/room', roomRoute);
app.use('/api/reservation', reservationRoute);
app.use('/api/transaction', transactionRoute);
app.use('/api/braintree', braintreeRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/chat', chatRoutes);
console.log('Routes configured...');

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Create HTTP server
const server = http.createServer(app);

// Configure Socket.IO
const io = socketIo(server, {
  pingTimeout: 70000,
  cors: {
    origin: "http://localhost:3000", // Update according to your frontend URL
    // credentials: true, // Uncomment if credentials are needed
  },
});

// Connect to MongoDB
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true, // Deprecated in newer versions
})
.then(() => console.log('Successfully connected to MongoDB'))
.catch(err => console.error('Error connecting to database:', err));

// Socket.IO event handling
io.on('connection', (socket) => {
  console.log('Connected to socket.io');

  // Setup user in socket
  socket.on('setup', (userData) => {
    if (!userData || !userData._id) {
      console.error('Invalid user data provided.');
      return;
    }
    socket.join(userData._id);
    socket.emit('connected');
  });

  // Join chat room
  socket.on('join chat', (room) => {
    if (!room) {
      console.error('Room not specified.');
      return;
    }
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // Typing event
  socket.on('typing', (room) => {
    if (!room) {
      console.error('Room not specified for typing.');
      return;
    }
    socket.in(room).emit('typing');
  });

  // Stop typing event
  socket.on('stop typing', (room) => {
    if (!room) {
      console.error('Room not specified for stop typing.');
      return;
    }
    socket.in(room).emit('stop typing');
  });

  // New message event
  socket.on('new message', (newMessageReceived) => {
    if (!newMessageReceived || !newMessageReceived.chat || !newMessageReceived.sender) {
      console.error('Invalid message format received.');
      return;
    }

    const { chat, sender } = newMessageReceived;

    if (!chat.users) {
      console.error('Chat users not defined.');
      return;
    }

    chat.users.forEach((user) => {
      if (user._id === sender._id) return; // Skip sending to the sender
      socket.in(user._id).emit('message received', newMessageReceived);
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
    // Additional cleanup logic if needed
  });
});

// Start server
server.listen(PORT, () => console.log(`Server running on PORT ${PORT}...`));
