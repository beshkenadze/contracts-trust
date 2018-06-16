pragma solidity ^0.4.23;


import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Basic.sol";


/**
 * @title Token Holder with vesting period
 * @dev holds any amount of tokens and allows to release selected number of tokens after every vestingInterval seconds
 */
contract TokenHolder is Ownable {
    using SafeMath for uint;

    event Released(uint amount);

    /**
     * @dev start of the vesting period
     */
    uint public start;
    /**
     * @dev interval between token releases
     */
    uint public vestingInterval;
    /**
     * @dev already released value
     */
    uint public released;
    /**
     * @dev value can be released every period
     */
    uint public value;
    /**
     * @dev holding token
     */
    ERC20Basic public token;

    constructor(uint _start, uint _vestingInterval, uint _value, ERC20Basic _token) public {
        start = _start;
        vestingInterval = _vestingInterval;
        value = _value;
        token = _token;
    }

    /**
     * @dev transfers vested tokens to beneficiary (to the owner of the contract)
     * @dev automatically calculates amount to release
     */
    function release() onlyOwner public {
        uint toRelease = calculateVestedAmount().sub(released);
        uint left = token.balanceOf(this);
        if (left < toRelease) {
            toRelease = left;
        }
        require(toRelease > 0, "nothing to release");
        released = released.add(toRelease);
        require(token.transfer(msg.sender, toRelease));
        emit Released(toRelease);
    }

    function calculateVestedAmount() view internal returns (uint) {
        return now.sub(start).div(vestingInterval).mul(value);
    }
}
