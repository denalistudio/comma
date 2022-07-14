const fs = require("fs");
const path = require("path");
const multer = require("multer");
const express = require("express");
const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "Images")
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage});

app.set("view engine", "ejs");
app.use("/static", express.static(path.join(__dirname, "uploads")));

app.get("/upload", (req, res) => {
    res.render("upload");
});

app.get("/get-images", (req, res) => {
    let images = getImagesFromDir(path.join(__dirname, "uploads"));
    res.render("index", { title: "Galerie" })
});

function getImagesFromDir(dirPath) {
    let allImages = [];
    let files = fs.readdirSync(dirPath);
    for (file of files) {
        let fileLocation = path.join(dirPath, file);
        var stat = fs.statSync(fileLocation);
        if (stat && stat.isDirectory()) {
            getImagesFromDir(fileLocation);
        } else if (stat && stat.isFile() && [".jpg", ".png"].indexOf(path.extname(fileLocation))) {
            allImages.push("static/" + file);
        }
    }
    return allImages
}

app.post("/upload", upload.single("image"), (req, res) => {
    res.send("Image uploaded");
});

app.listen(8000);
console.log("Listening on port 8000");