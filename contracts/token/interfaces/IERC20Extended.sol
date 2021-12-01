// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "./IERC20.sol";

interface IERC20Extended is IERC20 {
    function maxSupply() external view returns (uint256);
    function circulationSupplyByType(int8) external view returns (uint256);
    function mint(address, uint256, int8) external returns (bool);
    function burn(uint256, int8) external returns (bool);

    event Minted(address indexed who, address indexed to, uint256 amount, int8 allocationType);
    event Burned(address indexed from, uint256 amount, int8 allocationType);
}
