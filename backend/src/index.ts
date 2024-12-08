// index.ts
import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import plannerRouter from "./routes/planner/planner.router";
import userRouter from "./routes/user/user.router";
import session from 'express-session';
const app = express();
const PORT = 3007;

app.use(cors());
app.use(express.json());

app.use(session({
    secret: 'your_secret_key', // Replace with your actual secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.get("/", (req, res) => {
    res.send("Homepage of LettuceEat.");
});

app.use("/api/planner", plannerRouter);

app.use("/api/user", userRouter);


app.listen(PORT, () => {
    console.log(`LettuceEat is running on http://localhost:${PORT}`);
});
