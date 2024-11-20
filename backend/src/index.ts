// index.ts
import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import topRecipe from "./routes/planner/planner.router";
import getRecipeByFilter from "./routes/planner/planner.router";
const app = express();
const PORT = 3007;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Homepage of LettuceEat.");
});

app.use("/api/planner", topRecipe);

app.use("/api/planner", getRecipeByFilter);

app.listen(PORT, () => {
    console.log(`LettuceEat is running on http://localhost:${PORT}`);
});
