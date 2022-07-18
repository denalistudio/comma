import fs from "fs";
import path from "path";
import express, { Request, Response, Application } from "express";
import multer from "multer";
import serveIndex from "serve-index";
const app: Application = express();
const PORT = process.env.port || 8000;

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

app.use(express.static("views"));
app.use("/uploads", express.static("uploads"));
app.use("/uploads", serveIndex(path.join(__dirname, "/uploads")));

app.set("views", path.join("views"));
app.set("view engine", "ejs");

/*fs.readdir("uploads", (err, images) => {
    //handling error
    if (err) {
        return console.log("Unable to scan directory: " + err);
    }
    //listing all files using forEach
    images.forEach((image) => {
        // Do whatever you want to do with the file
        console.log(image);
    });
});*/

app.get("/", (req, res) => {
    fs.readdir("uploads", (err, result) => {
        if (err) {
            return console.log("Unable to scan directory: " + err);
        } else if (result && result.length) {
            const images = [];
            for (const item of result) {
                const img = "/upload/" + item;
                images.push({ img });
            }

            res.render("index", {
                title: "Studio Denali CMS",
                images
            })
        } else {
            res.render("index", {
                images: []
            })
        }
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

app.listen(PORT, (): void => console.log(`Server is running on port ${PORT}!`))