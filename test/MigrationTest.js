const Migration = artifacts.require("Migration.sol");
const Token = artifacts.require("TSTToken.sol");
const TokenHolder = artifacts.require("TokenHolder.sol");
const TimeProvider = artifacts.require("TimeProvider.sol");

const tests = require("@daonomic/tests-common");
const expectThrow = tests.expectThrow;
const randomAddress = tests.randomAddress;
const awaitEvent = tests.awaitEvent;
const increaseTime = tests.increaseTime;

contract('Migration', accounts => {

  let token;
  let reserve;
  let team;
  let advisors;
  let timeProvider;

  async function now() {
    return (await timeProvider.getTime()).toNumber();
  }

  before(async () => {
    timeProvider = await TimeProvider.new();
  });

  async function increaseDays(days) {
    await increaseTime(86400 * days);
  }

  beforeEach(async () => {
    const migration = await Migration.new(accounts[5], await now());
    token = Token.at(await migration.token());
    reserve = TokenHolder.at(await migration.getHolder("reserve"));
    team = TokenHolder.at(await migration.getHolder("team"));
    advisors = TokenHolder.at(await migration.getHolder("advisors"));

    await reserve.transferOwnership(accounts[1], {from: accounts[5]});
    await team.transferOwnership(accounts[2], {from: accounts[5]});
    await advisors.transferOwnership(accounts[3], {from: accounts[5]});
  });

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
    assert.equal((await token.balanceOf(accounts[5])).toFixed(), "64800000000000000000000000");
  });

  it("should allow to release from advisors holder at start", async () => {
    await advisors.release({from: accounts[3]});
    assert.equal((await token.balanceOf(accounts[3])).toFixed(), "1800000000000000000000000");
  })

  it("should allow to release tokens", async () => {
    //after 3 months only advisors can release some more
	await increaseDays(91);
	await expectThrow(
      reserve.release({from: accounts[1]})
	);
	await expectThrow(
      team.release({from: accounts[2]})
	);
	await advisors.release({from: accounts[3]});
	assert.equal((await token.balanceOf(accounts[3])).toFixed(), "3600000000000000000000000");

	//after almost 6 months no one can release more tokens
	await increaseDays(90);
	await expectThrow(
      reserve.release({from: accounts[1]})
	);
	await expectThrow(
      team.release({from: accounts[2]})
	);
	await expectThrow(
	  advisors.release({from: accounts[3]})
	);

	//after 6 months every holder can release tokens
	await increaseDays(2);
	await reserve.release({from: accounts[1]});
	await team.release({from: accounts[2]});
	await advisors.release({from: accounts[3]});
	assert.equal((await token.balanceOf(accounts[1])).toFixed(), "7200000000000000000000000");
	assert.equal((await token.balanceOf(accounts[2])).toFixed(), "2500000000000000000000000");
	assert.equal((await token.balanceOf(accounts[3])).toFixed(), "5400000000000000000000000");

	//and noone can release more now
	await expectThrow(
      reserve.release({from: accounts[1]})
	);
	await expectThrow(
      team.release({from: accounts[2]})
	);
	await expectThrow(
	  advisors.release({from: accounts[3]})
	);
  });
});