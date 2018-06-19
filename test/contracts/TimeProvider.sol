pragma solidity 0.4.24;

contract TimeProvider {
    function getTime() constant returns (uint) {
        return now;
    }
}