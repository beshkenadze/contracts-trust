pragma solidity ^0.4.24;

import "@daonomic/util/contracts/OwnableImpl.sol";
import "@daonomic/tokens/contracts/TokenImpl.sol";
import "@daonomic/tokens/contracts/BurnableTokenImpl.sol";

contract TrustToken is OwnableImpl, TokenImpl, BurnableTokenImpl {
    string public constant name = "Trust";
    string public constant symbol = "TST";
    uint8 public constant decimals = 18;

    mapping(address => bool) public whitelist;

    constructor(uint _total) public {
        balances[msg.sender] = _total;
        total = _total;
        emitTransfer(address(0), msg.sender, _total);
    }

    function transfer(address _to, uint256 _value) public returns (bool) {
        onTransfer(msg.sender);
        return super.transfer(_to, _value);
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        onTransfer(_from);
        return super.transferFrom(_from, _to, _value);
    }

    function onTransfer(address _from) view internal {
        require(whitelist[address(0)] || whitelist[_from]);
    }

    function setWhitelist(address _address, bool _value) onlyOwner public {
        whitelist[_address] = _value;
    }
}