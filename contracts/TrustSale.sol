pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

import "@daonomic/sale/contracts/TransferringSale.sol";
import "@daonomic/sale/contracts/WhitelistSale.sol";
import "@daonomic/util/contracts/SecuredImpl.sol";
import "@daonomic/util/contracts/OwnableImpl.sol";
import "@daonomic/sale/contracts/RatesChangingSale.sol";

contract TrustSale is OwnableImpl, SecuredImpl, TransferringSale, WhitelistSale, RatesChangingSale {
    constructor(BasicToken _token) TransferringSale(_token) public {

    }

    function getBonus(uint256 sold) constant public returns (uint256) {
        return 0;
    }
}
