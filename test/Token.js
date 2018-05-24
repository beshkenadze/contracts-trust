const Token = artifacts.require("TrustToken.sol");

const tests = require("@daonomic/tests-common");
const expectThrow = tests.expectThrow;
const randomAddress = tests.randomAddress;

contract('TrustToken', function(accounts) {

  it("should not allow transfer at start", async function() {
    var token = await Token.new(1000);
    await expectThrow(
        token.transfer(randomAddress(), 100)
    );
  })

  it("should not allow to alter allowed if not owner", async function() {
    var token = await Token.new(1000);
    await expectThrow(
        await token.setAllowed(accounts[0], true, {from: accounts[1]})
    );
  })

  it("should allow if added allowed address", async function() {
    var token = await Token.new(1000);
    await token.setAllowed(accounts[0], true);
    await token.transfer(accounts[1], 100);
    assert.equal(await token.balanceOf(accounts[1]), 100);

    await expectThrow(
        token.transfer(accounts[2], 80, {from: accounts[1]})
    );

    await token.setAllowed(accounts[1], true);
    token.transfer(accounts[2], 80, {from: accounts[1]});
    assert.equal(await token.balanceOf(accounts[1]), 20);
    assert.equal(await token.balanceOf(accounts[2]), 80);

  })

  it("should allow everybody to transfer if address(0) is whitelisted", async function() {
    var token = await Token.new(1000);
    await token.setAllowed("0x0000000000000000000000000000000000000000", true);
    await token.transfer(accounts[1], 100);
    assert.equal(await token.balanceOf(accounts[1]), 100);

    token.transfer(accounts[2], 80, {from: accounts[1]});
    assert.equal(await token.balanceOf(accounts[1]), 20);
    assert.equal(await token.balanceOf(accounts[2]), 80);
  })

});