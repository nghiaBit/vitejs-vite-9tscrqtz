const express = require("express");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const cors = require("cors");
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");

const app = express();
const port = process.env.PORT || 8081;

dbConnect();

app.use(cors());
app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/user", UserRouter);
app.use("/user", UserRouter);

app.use("/api/photo", PhotoRouter);
app.use("/photo", PhotoRouter);
app.use("/", PhotoRouter);

app.get("/", (req, res) => {
  res.send({ message: "Photo Sharing API server running" });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
