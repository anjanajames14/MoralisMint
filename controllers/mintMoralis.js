const Web3 = require("web3");
const Moralis = require("moralis/node");
const fs = require("fs");

const contract = require("../artifacts/contracts/MySampleNFT.sol/MySampleNFT.json");

const {
  MUMBAI_MORALIS_RPC,
  PRIVATE_KEY,
  PUBLIC_KEY,
  CONTRACT_ADDR_MORALIS_MUMBAI,
} = process.env;

const provider = new Web3.providers.HttpProvider(MUMBAI_MORALIS_RPC);
const web3 = new Web3(provider);
web3.eth.accounts.wallet.add(PRIVATE_KEY);
const nftContract = new web3.eth.Contract(
  contract.abi,
  CONTRACT_ADDR_MORALIS_MUMBAI
);

const uploadFile = async (name, data, contentType, res) => {
  try {
    const file = new Moralis.File(name, data, contentType);
    await file.saveIPFS({ useMasterKey: true });
    return file.ipfs();
  } catch (err) {
    const message = err.message
      ? err.message
      : "IPFS image upload is unsuccessful!";
    return res.status(400).send(err.message);
  }
};

const uploadJson = async (imageHash, body, res) => {
  const { name, description } = body;
  const object = {
    name,
    description,
    image: imageHash,
    attributes: [],
  };
  try {
    const toBtoa = Buffer.from(JSON.stringify(object)).toString("base64");
    const file = new Moralis.File(`${name}-meta.json`, { base64: toBtoa });
    await file.saveIPFS({ useMasterKey: true });
    return file.ipfs();
  } catch (err) {
    const message = err.message
      ? err.message
      : "IPFS json upload is unsuccessful!";
    return res.status(400).send(err.message);
  }
};

const getTokenId = async (hash, res) => {
  try {
    const data = await web3.eth.getTransactionReceipt(hash);
    if (data) {
      const { logs } = data;
      const tokenId = web3.utils.hexToNumber(logs[0].topics[3]);
      return tokenId;
    }
  } catch (err) {
    res.status(404).send("Invalid Token Id");
  }
};

const mintNFT = async (tokenURI, res) => {
  try {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest");
    const transaction = {
      from: PUBLIC_KEY,
      to: CONTRACT_ADDR_MORALIS_MUMBAI,
      nonce,
      gas: 500000,
      data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
    };
    const signPromise = await web3.eth.accounts.signTransaction(
      transaction,
      PRIVATE_KEY
    );
    const signedTransaction = await web3.eth.sendSignedTransaction(
      signPromise["rawTransaction"]
    );
    const hash = signedTransaction["transactionHash"];
    const tokenId = await getTokenId(hash, res);
    return { hash, tokenId };
  } catch (err) {
    const message = err.message
      ? err.message
      : "Something went wrong while signing the transaction!";
    return res.status(400).send(message);
  }
};

const create = async (req, res, next) => {
  const { name, description } = req.body;
  try {
    fs.readFile(req.file.path, async (err, buffer) => {
      // const image = buffer.toString("base64");
      // const ipfsImagePath = await Moralis.Cloud.run("ipfsbinary", {
      //   image,
      // });

      // const { path: imageHash } = ipfsImagePath;
      // const metadata = {
      //   name,
      //   image: imageHash,
      //   description,
      // };
      // const ipfsJsonPath = await Moralis.Cloud.run("ipfsjson", {
      //   metadata,
      // });
      // const { path: jsonHash } = ipfsJsonPath;
      const mintResponse = await mintNFT(
        "https://gateway.pinata.cloud/ipfs/QmPXnJRS9SdWmLCt4VLR6xJuqfMBxZ48vRKYPGNYBK9T13",
      );
      console.log(mintResponse);
      return res.status(200).send(mintResponse);
      
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

module.exports = { create };
