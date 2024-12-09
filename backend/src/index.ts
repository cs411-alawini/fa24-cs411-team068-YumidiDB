// index.ts
import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import plannerRouter from "./routes/planner/planner.router";
import userRouter from "./routes/user/user.router";
import collectionRouter from "./routes/collection/collection.router"
import session from "express-session";
const app = express();
const PORT = 3007;
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allow cookies or session data
}));

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Specify allowed methods
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
// app.use(cors());
app.use(express.json());

app.use(
    session({
        secret: "your_secret_key", // Replace with your actual secret key
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Set to true if using HTTPS
    })
);

app.get("/", (req, res) => {
    res.send("Homepage of LettuceEat.");
});

app.use("/api/planner", plannerRouter);

app.use("/api/user", userRouter);

app.use("/api/collection", collectionRouter);


app.listen(PORT, () => {
    console.log(`LettuceEat is running on http://localhost:${PORT}`);
});
