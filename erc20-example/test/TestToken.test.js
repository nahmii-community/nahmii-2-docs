const { expect } = require("chai");

describe("TestToken contract", function () {

  let Token;
  let token;
  let owner;
  let addr1;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("TestToken");
    token = await Token.deploy();
    [owner, addr1] = await ethers.getSigners();
  });

  it("Should return the correct token name", async function () {
    expect(await token.name()).to.equal("TestToken");
  });

  it("Should return the correct token symbol", async function () {
    expect(await token.symbol()).to.equal("TST");
  });

  it("Should return the correct token decimals", async function () {
    expect(await token.decimals()).to.equal(18);
  });

  it("Should return the correct token supply", async function () {
    expect(await token.totalSupply()).to.equal(ethers.BigNumber.from("1000000000000000000000000"));
  });

  it("Should mint tokens for the token owner", async function () {
    expect(await token.balanceOf(owner.address)).to.equal(ethers.BigNumber.from("1000000000000000000000000"));
    expect(await token.mint(owner.address, "500"));
    expect(await token.balanceOf(owner.address)).to.equal(ethers.BigNumber.from("1000000000000000000000500"));
  });

  it("Should mint tokens for a random address", async function () {
    expect(await token.balanceOf(addr1.address)).to.equal(ethers.BigNumber.from("0"));
    expect(await token.connect(addr1).mint(addr1.address, "500"));
    expect(await token.balanceOf(addr1.address)).to.equal(ethers.BigNumber.from("500"));
  });

  it("Should mint tokens on someone else's behalf", async function () {
    expect(await token.balanceOf(addr1.address)).to.equal(ethers.BigNumber.from("0"));
    expect(await token.connect(owner).mint(addr1.address, "500"));
    expect(await token.balanceOf(addr1.address)).to.equal(ethers.BigNumber.from("500"));
  });
});
