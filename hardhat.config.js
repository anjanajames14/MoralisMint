/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 require("dotenv").config();
 require("@nomiclabs/hardhat-ethers");
 require("@nomiclabs/hardhat-etherscan");
 const { MUMBAI_MORALIS_RPC, PRIVATE_KEY } = process.env;
 module.exports = {
   solidity: "0.8.9",
   defaultNetwork: "mumbai",
   networks: {
     hardhat: {},
     mumbai: {
       url: MUMBAI_MORALIS_RPC,
       accounts: [`0x${PRIVATE_KEY}`],
     },
   },
 };
 