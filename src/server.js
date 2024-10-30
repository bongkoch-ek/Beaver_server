const express = require("express")
const cors = require("cors")
const app = express()

app.use(express.json())
app.use(cors())

app.listen(8888,()=> console.log("server is running on port 8888"))