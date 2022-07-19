import fs from "fs";
import path from "path";

import express, { Request, Response, Application } from "express";
import bodyParser from "body-parser";
import multer from "multer";
import uuid from "uuid";
import serveIndex from "serve-index";

const app: Application = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("view engine", "ejs");  // Sets EJS as default view engine

app.use(express.static(path.join(__dirname, "../public")));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

//app.use("/uploads", serveIndex(path.join(__dirname, "/uploads")));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads")
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, file.originalname)
    }
});
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
    fs.readdir("uploads", (err, result) => {
        if (err) {
            return console.log("Unable to scan directory: " + err);
        }

        const images = [];
        for (const item of result) {
            const img = "/uploads/" + item;
            images.push({ img });
        }
        console.log(images);
        res.render("index", {
            title: "Studio Denali CMS",
            images
        })
    })
})

app.post("/upload", upload.array("images", 12), (req: any, res, next) => {
    var response = '<a href="/">Home</a>';
    response += "Files uploaded succesfully.";
    for (var i = 0; i < req.files.length; i++) {
        response += `<img src="${req.files[i].path}">`;
    }
    return res.send(response);
});

const PORT = process.env.port || 8000;
app.listen(PORT, (): void => console.log(`Server is running on port ${PORT}!`))