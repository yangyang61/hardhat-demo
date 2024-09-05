// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./YToken.sol";

contract Exchange {
    // 收费账户地址
    address public feeAccount;
    // 费率
    uint256 public feePercent;

    address constant ETHER = address(0);

    mapping(address => mapping(address => uint256)) public tokens;

    // 流动性 订单结构体
    struct _Order {
        uint256 id;
        address user;
        address tokenGet;
        uint256 amountGet;
        address tokenGive;
        uint256 amountGive;
        uint256 timestamp;
    }

    mapping(uint256 => _Order) public orders;

    mapping(uint256 => bool) public orderCancel;
    mapping(uint256 => bool) public orderFill;

    uint256 public orderCount;

    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event Withdraw(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );
    event NewOrder(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );
    event Cancel(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );
    event Trade(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );

    // 存ETH
    function depositEther() public payable {
        // msg.sender 是当前调用者
        // msg.value 是当前调用者发送的ETH数量
        tokens[ETHER][msg.sender] += msg.value;

        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
    }

    // 存 token
    function depositToken(address _token, uint256 _amount) public {
        // 调用某个方法强行从你账户往当前账户转钱
        require(_token != ETHER, "Cannot deposit Ether");
        require(_amount > 0, "Amount must be greater than 0");
        require(
            YToken(_token).transferFrom(msg.sender, address(this), _amount)
        );
        tokens[_token][msg.sender] += _amount;

        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    // 取ETH
    function withdrawEther(uint256 _amount) public {
        require(tokens[ETHER][msg.sender] >= _amount, "Insufficient balance");
        payable(msg.sender).transfer(_amount);

        emit Withdraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
    }

    // 取Token
    function withdrawToken(address _token, uint256 _amount) public {
        require(_token != ETHER, "Cannot withdraw Ether");
        require(tokens[_token][msg.sender] >= _amount, "Insufficient balance");
        require(YToken(_token).transfer(msg.sender, _amount));
        tokens[_token][msg.sender] -= _amount;
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    function balanceOf(
        address _token,
        address _user
    ) public view returns (uint256) {
        return tokens[_token][_user];
    }

    // makeOrder
    function makeOrder(
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) public {
        require(
            balanceOf(_tokenGive, msg.sender) >= _amountGive,
            "Insufficient balance"
        );
        orderCount += 1;
        orders[orderCount] = _Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );
        emit NewOrder(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );
    }

    // cancelOrder
    function cancelOrder(uint256 _id) public {
        _Order memory _order = orders[_id];
        require(_order.id == _id, "Order id is not exist or has been canceled");
        orderCancel[_id] = true;

        emit Cancel(
            _order.id,
            msg.sender,
            _order.tokenGet,
            _order.amountGet,
            _order.tokenGive,
            _order.amountGive,
            block.timestamp
        );
    }

    // fillOrder
    function fillOrder(uint256 _id) public {
        require(!orderFill[_id], "Order has been filled");
        require(!orderCancel[_id], "Order has been canceled");
        _Order memory _order = orders[_id];
        require(_order.id == _id, "Order id is not exist or has been canceled");
        orderFill[_id] = true;
        // 账户余额 互换  && 手续费
        require(
            _order.amountGet <= tokens[_order.tokenGet][msg.sender] &&
                _order.amountGive <= tokens[_order.tokenGive][msg.sender]
        );

        // 手续费
        uint256 _feeAmount = (_order.amountGive * feePercent) / 100;

        tokens[_order.tokenGet][msg.sender] -= (_order.amountGet + _feeAmount);
        tokens[_order.tokenGet][_order.user] += _order.amountGet;

        tokens[_order.tokenGet][feeAccount] += _feeAmount;

        tokens[_order.tokenGive][msg.sender] += _order.amountGive;
        tokens[_order.tokenGive][_order.user] -= _order.amountGive;
        orderFill[_id] = true;
        emit Trade(
            _order.id,
            _order.user,
            _order.tokenGet,
            _order.amountGet,
            _order.tokenGive,
            _order.amountGive,
            block.timestamp
        );
    }
}
