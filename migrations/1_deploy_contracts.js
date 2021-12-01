const BN = web3.utils.BN;
const BEWToken = artifacts.require("BEWToken");

// BEW Token Decimals
const decimals = new BN(18);
const bits = new BN(10).pow(decimals);

module.exports = async function(deployer, network) {
    console.log("Deploying Be Whale Token [BEW]");
    await deployer.deploy(BEWToken);

    const bewTokenInstance = await BEWToken.deployed();
    const maxSupply = await bewTokenInstance.maxSupply();

    console.log("\x1b[36m%s\x1b[0m", `
    -------------------------------------------------------
    ---- BE WHALE TOKEN CONTRACT SUCCESSFULLY DEPLOYED ----
    -------------------------------------------------------
    - Network: ${network}
    - Be Whale Token [BEW] contract address: ${BEWToken.address}
    - Max supply: ${maxSupply.div(bits)} BEW
    `);
};
