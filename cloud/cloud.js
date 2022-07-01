Moralis.Cloud.define("ipfsurl", async (request) => {
    const result = await Moralis.Cloud.toIpfs({
      sourceType: "url",
      source: request.params.image,
    });
    return result;
  });
  
  Moralis.Cloud.define("ipfsbinary", async (request) => {
    const result = await Moralis.Cloud.toIpfs({
      sourceType: "base64Binary",
      source: request.params.image,
    });
    return result;
  });
  
  Moralis.Cloud.define("ipfsjson", async (request) => {
    const result = await Moralis.Cloud.toIpfs({
      sourceType: "object",
      source: request.params.metadata,
    });
    return result;
  });
  