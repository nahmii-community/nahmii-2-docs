---
description: This page is all about how the communication between these chains and the
---

# Nahmii⇌Ethereum

### L1 ⇌ L2 communication



### Token Bridges


### Native Currency

The native currency on Nahmii 2.0 is Ether. The Ether token on Nahmii 2.0 is implemented as a wrapped ERC20 equivalent of the Ether deposited into the L1 ERC20 bridge smart contract. The address for the wrapped NVM Ether is: `0x4200000000000000000000000000000000000006`.

The wrapped NVM Ether can also be accessed by calling the native currency functions that exist within a regular Ethereum network, but there are a number of caveats attached. It is therefore recommended to use the wrapped NVM Ether as an ERC20. 

An example implementation of how to use the wrapped NVM Ether as an ERC20 token is shown below:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract FundMe {
    mapping(address => uint256) public addressToAmountFunded;
    address[] public funders;
    address public owner;
    address public WETH = 0x4200000000000000000000000000000000000006;
    
    event Deposit(address indexed _from, uint _value);
    
    constructor() public {
        owner = msg.sender;
    }
    
    // Fund contract through NVM ETH ERC20 contract
    function fund(uint value) public {
        IERC20(WETH).transferFrom(msg.sender, address(this), value);
        addressToAmountFunded[msg.sender] += value;
        funders.push(msg.sender);
        emit Deposit(msg.sender, value);
    }
    
    // Check the current NVM ETH balance for this contract
    function balanceOf() public view returns(uint256) {
        return IERC20(WETH).balanceOf(address(this));
    }
    
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
}
```

Note that, unlike in a situation where a native currency is used, the ERC20 approach requires the target smart contract to be approved to spend a users NVM Ether. This will thus result in an extra strep for the user where the user needs to do an approval for the respective token first.