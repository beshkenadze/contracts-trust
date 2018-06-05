const Migration = artifacts.require("Migration.sol");
const Token = artifacts.require("TrustToken.sol");
const TokenHolder = artifacts.require("TokenHolder.sol");

const tests = require("@daonomic/tests-common");
const expectThrow = tests.expectThrow;
const randomAddress = tests.randomAddress;
const awaitEvent = tests.awaitEvent;
const increaseTime = tests.increaseTime;

contract('Migration', accounts => {

  let migration;
  let token;
  let reserve;
  let team;
  let advisors;

  function now() {
    return parseInt(new Date().getTime() / 1000);
  }

  before(async () => {
    migration = await Migration.new(now());
    token = Token.at(await migration.token());
    reserve = TokenHolder.at(await migration.getHolder("Reserve"));
    team = TokenHolder.at(await migration.getHolder("Team"));
    advisors = TokenHolder.at(await migration.getHolder("Advisors"));

    await reserve.transferOwnership(accounts[1]);
    await team.transferOwnership(accounts[2]);
    await advisors.transferOwnership(accounts[3]);
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

  it("should not allow to release from reserve/team holders at start", async () => {
	await expectThrow(
      reserve.release({from: accounts[1]})
	);
	await expectThrow(
      team.release({from: accounts[2]})
	);
  });

  it("should leave 54% (for sale + marketing) of tokens to owner", async () => {
    assert.equal((await token.balanceOf(accounts[0])).toFixed(), "64800000000000000000000000");
  });

  it("should allow to release from advisors holder at start", async () => {
    await advisors.release({from: accounts[3]});
    assert.equal((await token.balanceOf(accounts[3])).toFixed(), "1800000000000000000000000");
  })

  it("should allow to release more tokens for advisers after 3 months", async () => {
	await increaseTime(91 * 86400);

	await expectThrow(
      reserve.release({from: accounts[1]})
	);
	await expectThrow(
      team.release({from: accounts[2]})
	);
	await advisors.release({from: accounts[3]});
	assert.equal((await token.balanceOf(accounts[3])).toFixed(), "3600000000000000000000000");
  });
});