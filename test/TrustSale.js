const Token = artifacts.require("TrustToken.sol");
const Sale = artifacts.require("TrustSale.sol");

const tests = require("@daonomic/tests-common");
const expectThrow = tests.expectThrow;
const randomAddress = tests.randomAddress;

contract('TrustSale', function(accounts) {

  let token;
  let sale;

  beforeEach(async function() {
    token = await Token.new(1000);
    sale = await Sale.new(token.address, "10000000000000000000");
    await allow(accounts[0]);
    await allow(sale.address);
    await token.transfer(sale.address, 1000);
  });

  async function allow(address) {
    await token.setWhitelist(address, true);
  }

  async function allowAll() {
    await allow("0x0000000000000000000000000000000000000000");
  }

  it("should sell tokens for eth", async function() {
    await sale.setWhitelist(accounts[1], true);

    await sale.sendTransaction({from: accounts[1], value: 5});
    assert.equal(await token.balanceOf(accounts[1]), 50);
    assert.equal(await token.balanceOf(sale.address), 950);
    assert.equal(await token.totalSupply(), 1000);
  })

  it("should not sell if not whitelisted", async function() {
    await expectThrow(
        sale.sendTransaction({from: accounts[1], value: 5})
    );
    assert.equal(await token.balanceOf(accounts[1]), 0);
    assert.equal(await token.totalSupply(), 1000);
  })

  it("should let change rate", async function() {
    await sale.setRate("1000000000000000000");
    await sale.setWhitelist(accounts[1], true);

    await sale.sendTransaction({from: accounts[1], value: 5});
    assert.equal(await token.balanceOf(accounts[1]), 5);
    assert.equal(await token.balanceOf(sale.address), 995);
    assert.equal(await token.totalSupply(), 1000);
  })

  it("should let direct transfers", async function() {
    assert.equal(await sale.canBuy(accounts[5]), false);
    await sale.transfer(accounts[5], 100);
    assert.equal(await token.balanceOf(accounts[5]), 100);
    assert.equal(await token.balanceOf(sale.address), 900);
    assert.equal(await token.totalSupply(), 1000);
    assert.equal(await sale.canBuy(accounts[5]), true);
  })

  it("should not let direct transfers from others", async function() {
    await expectThrow(
      sale.transfer(accounts[5], 100, {from: accounts[1]})
    );
  });

});