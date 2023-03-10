const {
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const {anyValue} = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const {expect} = require("chai");

describe("OracleConsumer", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContracts() {
    // Contracts are deployed using the first signer/account by default
    const [owner, user] = await ethers.getSigners();

    const OracleConsumer = await ethers.getContractFactory("OracleConsumer");
    const oracleConsumer = await OracleConsumer.deploy();

    return {owner, user, oracleConsumer}
  }

  describe("Deployment", function () {
    it("Should have been deployed successfully", async function () {
      const {oracleConsumer} = await loadFixture(deployContracts);

      expect(await oracleConsumer.address).to.be.equal(oracleConsumer.address); // TODO: Check
    });
  });

  describe("Workflow", function () {
    describe("Validations", function () {
      it("Should revert if a not admin user tries to change the price index", async function () {
        const {oracleConsumer, user} = await loadFixture(deployContracts);

        // Expect to find it in the mapping as true
        await expect(oracleConsumer.connect(user).updateRateValue(1000))
          .to.be.reverted
      });
    });

    describe("Events", function () {
      it("Should emit an event UpdateRate on updating the rate", async function () {
        const {oracleConsumer, owner} = await loadFixture(deployContracts);

        await expect(await oracleConsumer.updateRateValue(ethers.utils.parseUnits("0.1", "ether")))
          .to.emit(oracleConsumer, "UpdateRate")
          .withArgs(ethers.utils.parseUnits("0.1", "ether"))
      });
    });

    describe("Transfers", function () {
      it("Should update the lastTokenRateValue", async function () {
        const {oracleConsumer} = await loadFixture(deployContracts);

        await expect(await oracleConsumer.lastTokenRateValue()).to.equal(0)

        await oracleConsumer.updateRateValue(ethers.utils.parseUnits("0.1", "ether")); // here we are converting the float to wei to work as "intFloat"

        await expect(await oracleConsumer.lastTokenRateValue()).to.equal(ethers.utils.parseUnits("0.1", "ether"))
      });
    });
  });
});
