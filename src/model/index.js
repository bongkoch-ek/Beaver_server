const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
port = process.env.PORT
const bcrypt = require("bcryptjs")
const app = express()
const jwt = require("jsonwebtoken")



module.exports = {
    express,
    cors,
    morgan,
    port,
    bcrypt,
    app,
    jwt
}