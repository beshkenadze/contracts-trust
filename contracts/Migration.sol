pragma solidity 0.4.24;


import "openzeppelin-solidity/contracts/token/ERC20/ERC20Basic.sol";
import "./TSTToken.sol";
import "./TokenHolder.sol";


contract Migration {
    TSTToken public token;
    mapping(string => address) private holders;

    constructor(address _owner, uint _start) public {
        token = new TSTToken(100000000 * 10 ** 18);
        token.setWhitelist(this, true);
        token.setWhitelist(_owner, true);
        createHolder(_owner, "reserve", 24000000 * 10 ** 18, _start, 183 * 86400, 6000000 * 10 ** 18);
        createHolder(_owner, "team", 16000000 * 10 ** 18, _start, 183 * 86400, 4000000 * 10 ** 18);
        createHolder(_owner, "advisors", 6000000 * 10 ** 18, _start - 91 * 86400, 91 * 86400, 1500000 * 10 ** 18);
        token.transfer(_owner, token.balanceOf(this));
        token.transferOwnership(_owner);
    }

    function createHolder(address _owner, string _name, uint _total, uint _start, uint _vestingInterval, uint _value) internal {
        TokenHolder holder = new TokenHolder(_start, _vestingInterval, _value, token);
        token.transfer(holder, _total);
        token.setWhitelist(holder, true);
        holder.transferOwnership(_owner);
        holders[_name] = holder;
    }

    function getHolder(string _name) view public returns (address) {
        return holders[_name];
    }
}
