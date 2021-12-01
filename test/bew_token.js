const { BN, constants, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { ZERO_ADDRESS } = constants;

const BEWToken = artifacts.require("BEWToken");

contract('BEWToken', (accounts) => {
  const [owner, recipient, somebody] = accounts;
  const tokenName = "Be Whale Token";
  const tokenSymbol = "BEW";
  const tokenDecimals = 18;
  const tokenMaxSupply = 300000000;
  const initFounderAllocation = 4500000;
  const SUPER_ADMIN_ROLE = "0x00";
  const bits = new BN(10).pow(new BN(tokenDecimals));

  // allocation types for BSC network
  const allocationTypes = {
      FOUNDERS: 0,
      ADVISORS: 1,
      PUBLIC_SALE: 2,
      AFFILIATE: 3,
      AIRDROP: 4,
      STAKING: 5,
      WHALE_BRIDGE:6
}

  beforeEach(async () => {
      this.token = await BEWToken.new();
  });

  it(`token name equal ${tokenName}`, async () => {
      expect(await this.token.name()).to.eql(tokenName);
  });

  it(`token symbol equal ${tokenSymbol}`, async () => {
      expect(await this.token.symbol()).to.eql(tokenSymbol);
  });

  it(`token has ${tokenDecimals} decimals`, async () => {
      expect((await this.token.decimals()).toNumber()).to.eql(tokenDecimals);
  });

  it(`max supply equal ${tokenMaxSupply} ${tokenSymbol}`, async () => {
      expect(((await this.token.maxSupply()).div(bits)).toNumber()).to.eql(tokenMaxSupply);
  });

  it(`total supply equal ${initFounderAllocation} ${tokenSymbol}`, async () => {
      expect(((await this.token.totalSupply()).div(bits)).toNumber()).to.eql(initFounderAllocation);
  });

  describe('How about access to the BEW token?...', () => {

    describe('let\'s check AccessControl module...', () => {
        it('hasRole owner', async () => {
            expect(await this.token.hasRole(SUPER_ADMIN_ROLE, owner)).to.eql(true);
        });

        it('hasRole somebody', async () => {
            expect(await this.token.hasRole(SUPER_ADMIN_ROLE, somebody)).to.eql(false);
        });

        it('grantRole recipient', async () => {
            expect(await this.token.hasRole(SUPER_ADMIN_ROLE, recipient)).to.eql(false);

            await this.token.grantRole(SUPER_ADMIN_ROLE, recipient);
            expect(await this.token.hasRole(SUPER_ADMIN_ROLE, recipient)).to.eql(true);
        });

        it('revokeRole recipient', async () => {
            await this.token.grantRole(SUPER_ADMIN_ROLE, recipient);
            expect(await this.token.hasRole(SUPER_ADMIN_ROLE, recipient)).to.eql(true);

            await this.token.revokeRole(SUPER_ADMIN_ROLE, recipient);
            expect(await this.token.hasRole(SUPER_ADMIN_ROLE, recipient)).to.eql(false);
        });

        it('revert grantRole from somebody to recipient', async () => {
            await expectRevert(this.token.grantRole(SUPER_ADMIN_ROLE, recipient, { from: somebody }), 'AccessControl: access is denied.');
        });

        it(`grantRole [allocationRole] FOUNDERS to owner`, async () => {
            let founderAllocationRole = await this.token.getAllocationRole(allocationTypes.FOUNDERS);
            await this.token.grantRole(founderAllocationRole, owner);
            expect(await this.token.hasRole(founderAllocationRole, owner)).to.eql(true);;
        });

        it('revert revokeRole from somebody to owner', async () => {
            await expectRevert(this.token.grantRole(SUPER_ADMIN_ROLE, owner, { from: somebody }), 'AccessControl: access is denied.');
        });

        it(`revokeRole [allocationRole] FOUNDERS from owner`, async () => {
            let founderAllocationRole = await this.token.getAllocationRole(allocationTypes.FOUNDERS);
            await this.token.revokeRole(founderAllocationRole, owner);
            expect(await this.token.hasRole(founderAllocationRole, owner)).to.eql(false);
        });
    });

    describe('check access to the mint function...', () => {
        for(let allocationType in allocationTypes) {
            it(`revert minting without roles for ${allocationType}`, async () => {
                await expectRevert(this.token.mint(owner, new BN(1000).mul(bits), allocationTypes[allocationType]), 'AccessControl: access is denied.');
            });
        };
    });

    describe('check access to the burn function...', () => {
        it(`revert burning from somebody`, async () => {
            await expectRevert(this.token.burn(new BN(1000).mul(bits), allocationTypes.FOUNDERS, { from: somebody }), 'AccessControl: access is denied.');
        });
    });

  });

  describe('minting...', () => {

    it(`minting with role ...`, async () => {
        let founderAllocationRole = await this.token.getAllocationRole(allocationTypes.FOUNDERS);
        await this.token.grantRole(founderAllocationRole, owner);
        await this.token.mint(owner, new BN(1000).mul(bits), allocationTypes.FOUNDERS);
        expect((await this.token.balanceOf(owner)).div(bits).toNumber()).to.eql(initFounderAllocation + 1000);
     });

     it(`revert a null account ...`, async () => {
         let founderAllocationRole = await this.token.getAllocationRole(allocationTypes.FOUNDERS);
         await this.token.grantRole(founderAllocationRole, owner);

         await expectRevert(this.token.mint(ZERO_ADDRESS, new BN(100), allocationTypes.FOUNDERS), 'ERC20Extended: mint to the zero address');
     });

  });

  describe('burning...', () => {
    it(`burning from owner...`, async () => {
        await this.token.burn(new BN(1000).mul(bits), allocationTypes.FOUNDERS);
        expect((await this.token.balanceOf(owner)).div(bits).toNumber()).to.eql(initFounderAllocation - 1000);
    });

    it(`revert burning if not enough tokens in circulation...`, async () => {
        await expectRevert(this.token.burn(new BN(10000000000).mul(bits), allocationTypes.FOUNDERS), 'ERC20Extended: not enough tokens in circulation');
    });
  });

  describe('transfer...', () => {

  });
});
