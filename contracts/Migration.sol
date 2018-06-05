pragma solidity ^0.4.24;


import "openzeppelin-solidity/contracts/token/ERC20/ERC20Basic.sol";
import "./TrustToken.sol";
import "./TokenHolder.sol";


contract Migration {
    TrustToken public token;
    mapping(string => address) holders;

    constructor(uint _start) public {
        token = new TrustToken(100000000 * 10 ** 18);
        token.setWhitelist(this, true);
        createHolder("Reserve", 27000000 * 10 ** 18, _start, 183 * 86400, 4500000 * 10 ** 18);
        createHolder("Team", 15000000 * 10 ** 18, _start, 183 * 86400, 2500000 * 10 ** 18);
        createHolder("Advisors", 6000000 * 10 ** 18, _start, 91 * 86400, 1500000 * 10 ** 18);
        token.transfer(msg.sender, token.balanceOf(this));
        token.transferOwnership(msg.sender);
    }

    function createHolder(string _name, uint _total, uint _start, uint _vestingInterval, uint _value) internal {
        TokenHolder holder = new TokenHolder(_start, _vestingInterval, _value, token);
        token.transfer(holder, _total);
        holder.transferOwnership(msg.sender);
        holders[_name] = holder;
    }

    function getHolder(string _name) constant public returns (address) {
        return holders[_name];
    }
}