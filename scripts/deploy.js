async function main() {
    const sampleNFT = await ethers.getContractFactory("MySampleNFT");
    const myNFT = await sampleNFT.deploy();
    const txHash = myNFT.deployTransaction.hash;
    const txReceipt = await ethers.provider.waitForTransaction(txHash);
    console.log("Contract deployed to address:", txReceipt.contractAddress);
  }
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      process.exit(1);
    });
  