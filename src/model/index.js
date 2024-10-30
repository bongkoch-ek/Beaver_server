const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
port = process.env.PORT
const bcrypt = require("bcryptjs")
const app = express()
const jwt = require("jsonwebtoken")
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});



module.exports = {
    express,
    cors,
    morgan,
    port,
    bcrypt,
    app,
    jwt,
    io
}