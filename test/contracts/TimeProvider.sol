pragma solidity ^0.4.23;

contract TimeProvider {
    function getTime() constant returns (uint) {
        return now;
    }
}