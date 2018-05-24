pragma solidity ^0.4.24;

import "@daonomic/util/contracts/OwnableImpl.sol";
import "@daonomic/tokens/contracts/TokenImpl.sol";

contract TrustToken is OwnableImpl, TokenImpl {
    string public constant name = "Trust Coin";
    string public constant symbol = "TRUST";
    uint8 public constant decimals = 18;

    mapping(address => bool) public allowed;

    constructor(uint _total) public {
        balances[msg.sender] = _total;
        total = _total;
        emitTransfer(address(0), msg.sender, _total);
    }

    function transfer(address _to, uint256 _value) public returns (bool) {
        onTransfer(msg.sender);
        super.transfer(_to, _value);
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        onTransfer(_from);
        super.transferFrom(_from, _to, _value);
    }

    function onTransfer(address _from) internal {
        require(allowed[address(0)] || allowed[_from]);
    }

    function setAllowed(address _address, bool _value) onlyOwner public {
        allowed[_address] = _value;
    }
}