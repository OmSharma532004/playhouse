const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const ExpressError = require("./utils/ExpressError");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");

// Express setup
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5175', 'http://localhost:5174','http://localhost:5173'],
    credentials: true
  }
});

const PORT = process.env.PORT || 4000;
const dbURL = process.env.DB_URL;
mongoose.connect(dbURL);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json());

// Routes
const userRouter = require("./routes/user");
app.use("/user", userRouter);

const warehouseRouter = require("./routes/warehouse");
app.use("/warehouse", warehouseRouter);

const productRouter = require("./routes/products");
app.use("/product", productRouter);

const spoilageRouter = require("./routes/spoilage");
app.use("/spoilage", spoilageRouter);

const alert = require("./routes/alert");
app.use("/alert", alert);

const crops = require("./routes/crop");
app.use("/crops", crops);

const chats = require("./routes/chat");
app.use("/chat", chats);

// ML dashboard proxy
app.post("/dashboard/ml", async (req, res) => {
  try {
    const cropData = req.body;
    console.log("cropData :", cropData);

    const apiUrl2 = "https://dummy-ug4x.onrender.com/spoilage";
    const response2 = await fetch(apiUrl2, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cropData),
    });

    if (!response2.ok) {
      throw new Error(`Error: ${response2.statusText}`);
    }

    const data2 = await response2.json();
    console.log("data2 :", data2);
    res.json(data2);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Default and error routes
app.use("/", (req, res) => {
  res.send("Hello World!");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).json({ message });
});

// Socket.io setup
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on("sendMessage", (msg) => {
    const { receiverId } = msg;
    io.to(receiverId).emit("receiveMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
