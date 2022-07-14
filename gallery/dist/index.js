"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const app = (0, express_1.default)();
const PORT = process.env.port || 8000;
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
app.use(express_1.default.static(__dirname + "/public"));
app.use("/uploads", express_1.default.static("uploads"));
app.post("/upload", upload.array("images", 12), (req, res, next) => {
    var response = '<a href="/">Home</a>';
    response += "Files uploaded succesfully.";
    for (var i = 0; i < req.files.length; i++) {
        response += `<img src="${req.files[i].path}">`;
    }
    return res.send(response);
});
app.listen(PORT, () => console.log(`Server is running on port ${PORT}!`));
