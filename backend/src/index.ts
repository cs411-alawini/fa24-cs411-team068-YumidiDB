import express from "express";
import { testModel } from "./model/models";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("LettuceEat Server Running!");
});

app.listen(port, () => {
    console.log(`server listening on port ${port}`);
});
