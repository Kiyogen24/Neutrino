const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const groupMessageRoutes = require("./routes/grpmessages");
const app = express();
const socket = require("socket.io");
require("dotenv").config();
const path = require('path');
const helmet = require("helmet");
const expectCt = require('expect-ct');


app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/grpmessages", groupMessageRoutes);
app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  })
);

app.use(helmet.referrerPolicy({ policy: 'same-origin' }));

app.use(
  expectCt({
    enforce: true,
    maxAge: 30,
  })
);

app.use(express.static("build"));


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});



mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });




const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });

    // Handle typing event
    socket.on("typing", () => {
      const userId = Array.from(onlineUsers.entries()).find(([key, value]) => value === socket.id)?.[0];
      if (userId) {
        socket.broadcast.emit("typing", userId);
      }
    });
  
    // Handle stopTyping event
    socket.on("stopTyping", () => {
      const userId = Array.from(onlineUsers.entries()).find(([key, value]) => value === socket.id)?.[0];
      if (userId) {
        socket.broadcast.emit("stopTyping", userId);
      }
    });
  });
