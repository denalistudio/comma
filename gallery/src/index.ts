import express, { Request, Response, Application } from "express";
import { Twilio } from "twilio";
import multer from "multer";
const app: Application = express();
const PORT = process.env.port || 8000;

/* SMS Verification from Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const myNumber = process.env.MY_NUMBER;

if (accountSid && authToken && myNumber && twilioNumber) {
    const client = new Twilio(accountSid, authToken);

    client.messages
        .create({
            from: twilioNumber,
            to: myNumber,
            body: "You just sent an SMS from TypeScript using Twilio!",
        })
        .then((message) => console.log(message.sid));
} else {
    console.error("You are missing one of the variables you need to send a message");
}*/

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

app.listen(PORT, (): void => console.log(`Server is running on port ${PORT}!`))