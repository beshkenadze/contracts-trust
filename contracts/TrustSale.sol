pragma solidity ^0.4.24;

import "@daonomic/sale/contracts/TransferringSale.sol";
import "@daonomic/sale/contracts/WhitelistSale.sol";
import "@daonomic/util/contracts/SecuredImpl.sol";
import "@daonomic/util/contracts/OwnableImpl.sol";

contract TrustSale is OwnableImpl, SecuredImpl, TransferringSale, WhitelistSale {
    uint256 public rate;

    constructor(BasicToken _token, uint256 _rate) TransferringSale(_token) public {
        rate = _rate;
    }

    function getBonus(uint256 sold) constant public returns (uint256) {
        return 0;
    }

    function getRate(address _token) constant public returns (uint256) {
        return rate;
    }

    function setRate(uint256 _rate) onlyOwner public {
        rate = _rate;
    }

    function transfer(address _buyer, uint256 _amount) onlyOwner public {
        setWhitelistInternal(_buyer, true);
        doPurchase(_buyer, _amount, 0);
        emit Purchase(_buyer, address(0), 0, _amount, 0, "");
        onPurchase(_buyer, address(0), 0, _amount, 0);
    }
}
