const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const postToInsta = require("./publish");
const sharp = require("sharp");

const port = process.env.PORT || 3000;
dotenv.config();
const app = express();
app.use(cors({ origin: "*" }));
app.use(fileUpload());

app.get("/", (req, res) => {
  res.status(200).json({ status: 200, message: "Hello from api" });
});

app.post("/publish", async (req, res) => {
  const file = req.files.file;

  if (!file || !file.mimetype.startsWith("image/")) {
    res.status(400).json({ status: 400, message: "Invalid file format" });
    return;
  }

  sharp(file.data)
    .resize(1080, 1080)
    .toFile("output.jpg", async (err, info) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .json({ status: 500, message: "Failed to resize image" });
      } else {
        const isPublished = await postToInsta();
        if (isPublished) {
          res
            .status(201)
            .json({ status: 201, message: "Successfully published" });
        } else {
          res.status(500).json({ status: 500, message: "Failed to publish!" });
        }
      }
    });
});

app.listen(port, () => {
  console.log(`Server running: http://localhost:${port}`);
});
