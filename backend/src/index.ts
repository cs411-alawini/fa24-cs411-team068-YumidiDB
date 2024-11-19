// index.ts
import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import topRecipe from "../src/routes/topRecipe";

const app = express();
const PORT = 3007;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("server is running");
});

app.get("/api/", (req: Request, res: Response) => {
    res.send("Homepage of LettuceEat.");
});

app.use("/api/recipe", topRecipe);

app.listen(PORT, () => {
    console.log(`LettuceEat is running on http://localhost:${PORT}`);
});
