const express = require("express");

const mintMoralisController = require("../controllers/mintMoralis");

const nftRouter = express.Router();

nftRouter.route("/mint-moralis").post(mintMoralisController.create);

module.exports = nftRouter;
