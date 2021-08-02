// SPDX-License-Identifier: MIT
pragma solidity =0.7.6;

import "./util/Context.sol";
import "./util/SafeMath.sol";
import "./util/IERC20.sol";
import "./util/ERC20.sol";

/** 
 * @title TestToken
 * @dev Implements a standard ERC20 token with a public mint function.
 */
contract TestToken is ERC20 {
   constructor() ERC20("TestToken", "TST") {
       _mint(msg.sender, 1000000 * (10**18));
   }
   
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}