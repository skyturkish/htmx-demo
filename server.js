const express = require("express");
const app = express();
const http = require("http");

const server = http.createServer(app);

const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const jsonData = { message: "Hello, this is WebSocket response!" };
    ws.send(JSON.stringify(jsonData));
  });
});

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/websocket", (req, res) => {
  res.render("websocket");
});

app.get("/api/data", (req, res) => {
  const jsonData = { message: "Hello, this is REST API response!" };
  res.json(jsonData);
});

app.get("/api/socket", (req, res) => {
  // WebSocket bağlantısını açın
  const ws = new WebSocket("ws://localhost:8080");

  ws.on("open", () => {
    console.log("WebSocket connection opened for /api/socket request.");

    // WebSocket üzerinden mesajı gönderin
    ws.send("API request");
  });

  ws.on("message", (data) => {
    console.log("WebSocket response received:", data);

    // JSON verisini istemciye gönderin
    res.json(JSON.parse(data));

    // WebSocket bağlantısını kapatın
    ws.close();
  });
});

server.listen(3000, () => {
  console.log(`Server listening at http://localhost:3000`);
});
