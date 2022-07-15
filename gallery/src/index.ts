import express, { Request, Response, Application } from "express";
import multer from "multer";
const app:Application = express();
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

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

app.post("/upload", upload.array("images", 12), (req: any, res, next) => {
    var response = '<a href="/">Home</a>';
    response += "Files uploaded succesfully.";
    for (var i = 0; i < req.files.length; i++) {
        response += `<img src="${req.files[i].path}">`;
    }
    return res.send(response);
});

app.listen(PORT, ():void => console.log(`Server is running on port ${PORT}!`))