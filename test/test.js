const { expect, use} = require("chai");
const { ethers } = require("hardhat");
const { solidity } = require ("ethereum-waffle");
use(solidity);

describe("DegenToken", function () {
  let DegenToken;
  let degenToken;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    DegenToken = await ethers.getContractFactory("DegenToken");
    [owner, addr1, addr2] = await ethers.getSigners();

    degenToken = await DegenToken.deploy();
    await degenToken.deployed();

    // Mint some initial tokens for testing
    await degenToken.mint(owner.address, ethers.utils.parseEther("1000"));
  });

  it("should have correct initial values", async function () {
    expect(await degenToken.name()).to.equal("Degen");
    expect(await degenToken.symbol()).to.equal("DGN");
    expect(await degenToken.decimals()).to.equal(18);
  });

  it("should mint new tokens", async function () {
    await degenToken.mint(addr1.address, ethers.utils.parseEther("500"));
    expect(await degenToken.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther("500"));
  });

  it("should redeem tokens for an item", async function () {
    const itemSelection = 1; // Select the first item
    const itemCost = (await degenToken.items(itemSelection - 1)).cost;

    await degenToken.redeemTokens(itemSelection);
    expect(await degenToken.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("1000").sub(itemCost));
    expect(await degenToken.nftSwordOwned(owner.address)).to.equal(true);
  });

  it("should check token balance", async function () {
    const balance = await degenToken.checkTokenBalance(owner.address);
    expect(balance).to.equal(ethers.utils.parseEther("1000"));
  });

  it("should display all items", async function () {
    const items = await degenToken.displayAllItems();
    expect(items.length).to.equal(3);
    expect(items[0].name).to.equal("Nft Sword");
    expect(items[1].name).to.equal("Nft Spear");
    expect(items[2].name).to.equal("Nft Shield");
  });

  it("should transfer tokens", async function () {
    const amount = ethers.utils.parseEther("100");
    await degenToken.transfer(addr1.address, amount);
    expect(await degenToken.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("900"));
    expect(await degenToken.balanceOf(addr1.address)).to.equal(amount);
  });

  it("should not transfer more tokens than balance", async function () {
    const amount = ethers.utils.parseEther("10000");
    await expect(degenToken.transfer(addr1.address, amount)).to.be.revertedWith("Insufficient balance for transfer");
  });

  it("should burn tokens", async function () {
    const amount = ethers.utils.parseEther("100");
    await degenToken.burnTokens(amount);
    expect(await degenToken.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("900"));
  });

  it("should not burn more tokens than balance", async function () {
    const amount = ethers.utils.parseEther("10000");
    await expect(degenToken.burnTokens(amount)).to.be.revertedWith("Insufficient balance for burning");
  });
});
