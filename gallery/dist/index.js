"use strict";
const express = require("express");
const multer = require("multer");
const app = express();
const port = 8000;
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));
app.post("/upload", upload.array("images", 12), (req, res, next) => {
    var response = '<a href="/">Home</a>';
    response += "Files uploaded succesfully.";
    for (var i = 0; i < req.files.length; i++) {
        response += `<img src="${req.files[i].path}">`;
    }
    return res.send(response);
});
app.listen(port, () => console.log(`Server is running on port ${port}!`));
