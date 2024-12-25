const express = require("express");
const app = express();
const port = process.env.port || 5000;
const mongoose = require("mongoose");
const { mongoUrl } = require("./keys");
const cors = require("cors");
const { METHODS } = require("http");
const { options } = require("./routes/auth");
const path = require("path");
const http = require("http").createServer(app);
const env = require("dotenv");
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["POST", "GET", "PUT", "UPDATE"],
    credentials: true,
  },
});

app.use(cors());
env.config();

require("./models/model");
require("./models/post");
app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/createPost"));
app.use(require("./routes/user"));
mongoose.set("strictQuery", true);
mongoose.connect(mongoUrl);

mongoose.connection.on("connected", () => {
  console.log("successfully connected to mongo");
  console.log("new added")
});

mongoose.connection.on("error", () => {
  console.log("Not connected to mongo");

});

//serving the frontend

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  socket.join(userId);

  socket.on("sendmsg", (msg) => {
    const recipentId = msg.user;
    io.emit("servermsg", msg.message);
    socket.emit("servermsg", msg.message);
  });
});
app.use(express.static(path.join(__dirname, "./frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "./frontend/build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});

http.listen(port, () => {
  console.log("server is running on port" + " " + port);
});
