pragma solidity ^0.4.23;

import "@daonomic/tokens/contracts/MintableTokenImpl.sol";
import "@daonomic/util/contracts/SecuredImpl.sol";
import "@daonomic/util/contracts/OwnableImpl.sol";

contract MockToken is OwnableImpl, SecuredImpl, MintableTokenImpl {

}