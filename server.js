import express from "express";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
dotenv.config()

const app = express();

const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static("public"));

const salt = 10;


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
