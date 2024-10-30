require("dotenv").config();
const {port,express,app,cors,morgan,io,server} = require("./model")
const {notFound,handleError} = require("./middlewares")
const {authRoutes} = require('./routes')

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET","POST","PUT","DELETE","PATCH"],
    credentials: true,
}))
app.use(express.json({limit:"20mb"}));
app.use(morgan("dev"));

/// socket.io section
io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("cardDragging", (cardId) => {
        console.log(cardId,"test message")
        socket.broadcast.emit("cardDragging", cardId);
    });

    socket.on("editCard", (updatedCard) => {
        socket.broadcast.emit("editCard", updatedCard);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

/// route section
app.use("/auth",authRoutes)
app.use("/user",()=>{})
app.use("/dashboard",()=>{})



app.use("*", notFound);
app.use(handleError);

server.listen(port,()=> console.log(`server is running on port ${port}`))