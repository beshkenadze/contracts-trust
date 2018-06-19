pragma solidity 0.4.24;

contract TimeProvider {
    function getTime() view public returns (uint) {
        return now;
    }
}