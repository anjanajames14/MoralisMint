require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const Moralis = require("moralis/node");

const nftRoutes = require("./routes/nft");

const app = express();
const {
  PORT,
  MORALIS_MAIN_SERVER_URL,
  MORALIS_MAIN_APP_ID,
  MORALIS_MAIN_MASTER_KEY,
} = process.env;
const port = PORT || 8000;
const jsonParser = bodyParser.json();
const upload = multer({ dest: __dirname + "/public/uploads/" });

app.use(jsonParser);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PATCH",
    credentials: true,
  })
);

app.use("/nft", upload.single("file"), nftRoutes);

app.listen(port, async () => {
  await Moralis.start({
    serverUrl: MORALIS_MAIN_SERVER_URL,
    appId: MORALIS_MAIN_APP_ID,
    masterKey: MORALIS_MAIN_MASTER_KEY,
  });
});
