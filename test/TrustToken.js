const Token = artifacts.require("TSTToken.sol");

const tests = require("@daonomic/tests-common");
const expectThrow = tests.expectThrow;
const randomAddress = tests.randomAddress;

contract('TSTToken', function(accounts) {

  let token;

  beforeEach(async function() {
    token = await Token.new(1000);
  });

  async function allow(address) {
    await token.setWhitelist(address, true);
  }

  async function allowAll() {
    await allow("0x0000000000000000000000000000000000000000");
  }

  it("should not allow transfer at start", async function() {
    await expectThrow(
        token.transfer(randomAddress(), 100)
    );
  })

  it("should not allow to alter allowed if not owner", async function() {
    await expectThrow(
        token.setWhitelist(accounts[0], true, {from: accounts[1]})
    );
  })

  it("should allow if added allowed address", async function() {
    await allow(accounts[0]);
    await token.transfer(accounts[1], 100);
    assert.equal(await token.balanceOf(accounts[1]), 100);

    await expectThrow(
        token.transfer(accounts[2], 80, {from: accounts[1]})
    );

    await allow(accounts[1]);
    token.transfer(accounts[2], 80, {from: accounts[1]});
    assert.equal(await token.balanceOf(accounts[1]), 20);
    assert.equal(await token.balanceOf(accounts[2]), 80);

  })

  it("should allow everybody to transfer if address(0) is whitelisted", async function() {
    await allowAll();
    await token.transfer(accounts[1], 100);
    assert.equal(await token.balanceOf(accounts[1]), 100);

    token.transfer(accounts[2], 80, {from: accounts[1]});
    assert.equal(await token.balanceOf(accounts[1]), 20);
    assert.equal(await token.balanceOf(accounts[2]), 80);
  })

});