pragma solidity ^0.4.23;

import "@daonomic/interfaces/contracts/Token.sol";
import "@daonomic/util/contracts/OwnableImpl.sol";
import "@daonomic/util/contracts/SafeMath.sol";

/**
 * @title Token Holder with vesting period
 * @dev holds any amount of tokens and allows to withdraw selected number of tokens after every 6 months (183 days)
 */
contract TokenHolder is OwnableImpl {
    using SafeMath for uint256;

    /**
     * @dev every 6 (183 days) months owner can withdraw value tokens
     */
    uint constant public vestingInterval = 86400 * 183;
    /**
     * @dev start of the vesting period
     */
    uint public start;
    /**
     * @dev already withdrawn value
     */
    uint public withdrawn;
    /**
     * @dev value can be withdrawn every 6 months
     */
    uint public value;
    /**
     * @dev holding token
     */
    Token public token;

    constructor(uint _start, uint _value, Token _token) public {
        start = _start;
        value = _value;
        token = _token;
    }

    function withdraw() onlyOwner public {
        uint possibleToWithdraw = now.sub(start).div(vestingInterval).mul(value).sub(withdrawn);
        require(possibleToWithdraw > 0, "nothing to withdraw");
        token.transfer(msg.sender, possibleToWithdraw);
        withdrawn = withdrawn.add(possibleToWithdraw);
    }
}
