// test/MyToken.test.js
const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

let myToken, MyTokenV1, MyTokenV2, balanceDeployer, version;
const amount = "1000000000000000000000";

describe("MyTokenV1", function () {
  beforeEach(async () => {
    MyTokenV1 = await ethers.getContractFactory("MyTokenV1");
    MyTokenV2 = await ethers.getContractFactory("MyTokenV2");
    [deployer] = await ethers.getSigners();
  });
  it("deploys proxy V1", async function () {
    myToken = await upgrades.deployProxy(MyTokenV1, {
      kind: "uups",
    });
    await myToken.deployed();
    console.log(await myToken.address);
    version = await myToken.version();
    balanceDeployer = await myToken.balanceOf(deployer.address);
    expect(version.toString()).to.equal("1");
    expect(balanceDeployer.toString()).to.equal(amount);
  });
  it("upgrades V2", async function () {
    myToken = await upgrades.upgradeProxy(myToken.address, MyTokenV2);
    console.log(await myToken.address);
    version = await myToken.version();
    balanceDeployer = await myToken.balanceOf(deployer.address);
    expect(version.toString()).to.equal("2");
    expect(balanceDeployer.toString()).to.equal(amount);
  });
});
