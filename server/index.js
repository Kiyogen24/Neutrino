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


app.use(express.static("../../client/build"));

app.use(cors({origin : '*'}));
app.use(express.json({limit: '50mb'}));
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



app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
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
    origin: "*",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  console.log("Socket On");
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.emit("user-added", userId);
  });

  socket.on("send-msg", (data) => {
    console.log("1");
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      console.log("3");
      socket.to(sendUserSocket).emit("msg-recieve", (data));
    }
  });

  socket.on("send-msg-grp", (data) => {
    const members = data.members;
    if (Array.isArray(members)) {
      members.forEach((member) => {
        const sendUserSocket = onlineUsers.get(member);
        if (sendUserSocket) {
          socket.to(sendUserSocket).emit("msg-grp-recieve", data);
        }
      });
    } else {
      console.log("Invalid members data");
    }
  });

  socket.on("reception", () => {
    console.log("marche");
  });

    // Handle typing event
    socket.on("typing", (userId) => {
      if (userId) {
        socket.broadcast.emit("typing", userId);
      }
    });
  
    // Handle stopTyping event
    socket.on("stopTyping", (userId) => {
      if (userId) {
        socket.broadcast.emit("stopTyping", userId);
      }
    });

    socket.on("grp-typing", ([groupId, groupMembers]) => {
      if (groupId && Array.isArray(groupMembers)) {
      groupMembers.forEach((member) => {
        const sendUserSocket = onlineUsers.get(member);
        if (sendUserSocket) {
        socket.to(sendUserSocket).emit("grp-typing", groupId);
        }
      });
      } else {
      console.log("Invalid group typing data");
      }
    });
    
    socket.on("grp-stopTyping", ([groupId, groupMembers]) => {
      if (groupId && Array.isArray(groupMembers)) {
      groupMembers.forEach((member) => {
        const sendUserSocket = onlineUsers.get(member);
        if (sendUserSocket) {
        socket.to(sendUserSocket).emit("grp-stopTyping", groupId);
        }
      });
      } else {
      console.log("Invalid group stopTyping data");
      }
    });
  });
