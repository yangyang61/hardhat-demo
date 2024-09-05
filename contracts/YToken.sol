// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract YToken {
    string public name = "YToken";

    string public symbol = "YT";

    uint256 public decimals = 18;

    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;

    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approve(address indexed from, address indexed to, uint256 value);

    constructor() {
        totalSupply = 1000000 * (10 ** decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address to, uint256 value) public returns (bool success) {
        require(to != address(0));

        _transfer(msg.sender, to, value);

        return true;
    }

    function approve(
        address _spender,
        uint256 value
    ) public returns (bool success) {
        // msg.sender 当前网页登录的账号
        // _spender 第三方的交易所的账号
        // value 授权的额度
        require(_spender != address(0));
        allowance[msg.sender][_spender] = value;
        emit Approve(msg.sender, _spender, value);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        // _from 放款账号
        // _to 收款账号
        // _value 转账金额
        // msg.sender 交易所的账号
        require(allowance[_from][msg.sender] >= _value);
        require(balanceOf[_from] >= _value);
        allowance[_from][msg.sender] -= _value;
        _transfer(_from, _to, _value);
        return true;
    }

    function _transfer(address _from, address _to, uint256 _value) internal {
        require(balanceOf[_from] >= _value);
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(_from, _to, _value);
    }
}
