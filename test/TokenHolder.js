const Holder = artifacts.require("TokenHolder.sol");
const Token = artifacts.require("MockToken.sol");

const tests = require("@daonomic/tests-common");
const expectThrow = tests.expectThrow;
const randomAddress = tests.randomAddress;

contract('TokenHolder', function(accounts) {

  function now() {
    return parseInt(new Date().getTime() / 1000);
  }

  it("should not allow to withdraw at start", async function() {
    var token = await Token.new();
    var holder = await Holder.new(now(), 100, token.address);
    await token.mint(holder.address, 100000);

    await expectThrow(
        holder.withdraw()
    );
  })

  it("should allow to withdraw 100 after 6 months", async function() {
    var token = await Token.new();
    var holder = await Holder.new(now() - 86400 * 200, 100, token.address);
    await token.mint(holder.address, 100000);

    await holder.withdraw();
    assert.equal(await token.balanceOf(accounts[0]), 100);
  })

  it("should allow to withdraw 200 after 12 months", async function() {
    var token = await Token.new();
    var holder = await Holder.new(now() - 86400 * 400, 100, token.address);
    await token.mint(holder.address, 100000);

    await holder.withdraw();
    assert.equal(await token.balanceOf(accounts[0]), 200);
  })

});