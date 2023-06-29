const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Exchange:Swap Features", function () {
  let owner;

  before(async function () {
    [owner] = await ethers.getSigners();
  });

  describe("etherToTokenInput", function () {
    it("should correctly calculate the token output amount given an Ether input", async function () {
    });

    it("should revert if the Ether input is less than the minimum specified", async function () {
    });
  });

  describe("etherToTokenOutput", function () {
    it("should correctly calculate the Ether input amount given a token output", async function () {
    });

    it("should revert if the token output is more than the maximum specified", async function () {
    });
  });

  describe("tokenToEtherInput", function () {
    it("should correctly calculate the Ether output amount given a token input", async function () {
    });

    it("should revert if the token input is less than the minimum specified", async function () {
    });
  });

  describe("tokenToEtherOutput", function () {
    it("should correctly calculate the token input amount given an Ether output", async function () {
    });

    it("should revert if the Ether output is more than the maximum specified", async function () {
    });
  });
});
