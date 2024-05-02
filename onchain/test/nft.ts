// test/Pacific.test.ts
import { expect } from "chai";
import { ethers } from "hardhat";
import { Pacific } from "../typechain";  // Assuming Hardhat TypeChain plugin is used for typings

describe("Pacific Contract", function () {
    let pacific: Pacific;
    let accounts: SignerWithAddress[];

    beforeEach(async function () {
        // Get test accounts
        accounts = await ethers.getSigners();
        
        // Deploy the contract before each test
        const Pacific = await ethers.getContractFactory("Pacific");
        pacific = await Pacific.deploy() as Pacific;
        await pacific.deployed();
    });

    it("Should mint a new NFT correctly", async function () {
        const recipient = accounts[1].address;
        const tokenURI = "https://token-cdn-domain.com/metadata/1";

        // Mint new NFT
        const tx = await pacific.mintCert(recipient, tokenURI);
        const receipt = await tx.wait();

        // Retrieve tokenId from transaction events
        const event = receipt.events?.find(e => e.event === 'Transfer');
        const tokenId = event?.args?.tokenId.toNumber();

        // Assertions to ensure minting worked correctly
        expect(tokenId).to.be.a('number');
        expect(await pacific.ownerOf(tokenId)).to.equal(recipient);
        expect(await pacific.tokenURI(tokenId)).to.equal(tokenURI);
    });
});
