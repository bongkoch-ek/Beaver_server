const {port,express,app,cors,morgan} = require("./model")
const {notFound,handleError} = require("./middlewares")

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET","POST","PUT","DELETE","PATCH"],
    credentials: true,
}))
app.use(express.json({limit:"20mb"}));
app.use(morgan("dev"));

app.use("/auth",()=>{})
app.use("/user",()=>{})
app.use("/dashboard",()=>{})
app.use("/",()=>{})



app.use("*", notFound);
app.use(handleError);

app.listen(port,()=> console.log(`server is running on port ${port}`))