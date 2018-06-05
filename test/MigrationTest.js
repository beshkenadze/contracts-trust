const Migration = artifacts.require("Migration.sol");
const Token = artifacts.require("TrustToken.sol");
const TokenHolder = artifacts.require("TokenHolder.sol");

const tests = require("@daonomic/tests-common");
const expectThrow = tests.expectThrow;
const randomAddress = tests.randomAddress;

contract('Migration', function(accounts) {

  let migration;
  let token;

  beforeEach(async function() {
    migration = await Migration.deployed();
    token = Token.at(await migration.token());
  });

  function bn(value) {
    return new web3.BigNumber(value);
  }

  async function allow(address) {
    await token.setWhitelist(address, true);
  }

  async function allowAll() {
    await allow("0x0000000000000000000000000000000000000000");
  }

  it("should have totalSupply=100M", async () => {
    assert.equal((await token.totalSupply()).toFixed(), "120000000000000000000000000");
  });

  it("should not allow transfer at start", async function() {
    await expectThrow(
      token.transfer(randomAddress(), 100)
    );
  })

});