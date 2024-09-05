// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract StudentStarage {
    uint public age;
    string public name;

    function set(uint _age, string memory _name) public {
        age = _age;
        name = _name;
        console.log("set age and name", _age, _name);
    }

    // view(视图函数，只访问不修改状态)，pure(纯函数，不访问也不修改状态)
    function get() public view returns (uint, string memory) {
        return (age, name);
    }
}
