// index.ts
import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import plannerRouter from "./routes/planner/planner.router";
import userRouter from "./routes/user/user.router";
const app = express();
const PORT = 3007;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Homepage of LettuceEat.");
});

app.use("/api/planner", plannerRouter);

app.use("/api/user", userRouter);


app.listen(PORT, () => {
    console.log(`LettuceEat is running on http://localhost:${PORT}`);
});
