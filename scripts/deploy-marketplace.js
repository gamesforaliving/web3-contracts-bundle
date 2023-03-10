// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat")

async function main() {
  const owner = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY)

  const GFALToken = await hre.ethers.getContractFactory("GFALToken")
  const OracleConsumer = await hre.ethers.getContractFactory("OracleConsumer")
  const ElementalRaidersSkill = await hre.ethers.getContractFactory("ElementalRaidersSkill")
  const GFALMarketplace = await hre.ethers.getContractFactory("GFALMarketplace")

  const gfalToken = await GFALToken.deploy()
  const oracleConsumer = await OracleConsumer.deploy()
  const elementalRaidersSkill = await ElementalRaidersSkill.deploy(gfalToken.address, "")
  const gfalMarkeplace = await GFALMarketplace.deploy(oracleConsumer.address, gfalToken.address, owner.address, 1000)


  await gfalToken.deployed()
  await oracleConsumer.deployed()
  await elementalRaidersSkill.deployed()
  await gfalMarkeplace.deployed()

  // Executing functions

  await gfalMarkeplace.addCollection(elementalRaidersSkill.address)

  await elementalRaidersSkill.updateBaseURI("https://prod-web3-token-tracker-tqkvar3wjq-uc.a.run.app/metadata/"+elementalRaidersSkill.address+"/")
  await elementalRaidersSkill.updateMintingPrice(1, hre.ethers.utils.parseEther('50'))
  await elementalRaidersSkill.updateMintingPrice(2, hre.ethers.utils.parseEther('100'))
  await elementalRaidersSkill.updateMintingPrice(3, hre.ethers.utils.parseEther('150'))
  await elementalRaidersSkill.updateMintingPrice(4, hre.ethers.utils.parseEther('200'))

  console.log(
    `GFALToken deployed to ${gfalToken.address}`,
    `OracleConsumer deployed to ${oracleConsumer.address}`,
    `ElementalRaidersSkill deployed to ${elementalRaidersSkill.address}`,
    `GFALMarketplace deployed to ${gfalMarkeplace.address}`
  )
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
