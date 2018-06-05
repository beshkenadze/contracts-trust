var Migration = artifacts.require("./Migration.sol");

module.exports = function(deployer) {
  deployer.deploy(Migration, parseInt(new Date().getTime() / 1000));
};
