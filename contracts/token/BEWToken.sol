// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "./ERC20Extended.sol";
import "../control/Pausable.sol";
import "../control/AccessControl.sol";

/*
 * Be Whale Token [BEW]
 * Author: Oddysey Games: https://oddysey.games
 * Game: Be Whale [https://bew.dev]
 */

contract BEWToken is ERC20Extended, Pausable, AccessControl {
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    uint256 private dFactor = 10 ** uint256(18);

    constructor() ERC20("Be Whale Token", "BEW", 18) {
         // Binance Smart Chain network
        _setupSupply(30000000 * dFactor); // id:0; Founders [via Vesting]
        _setupSupply(15000000 * dFactor); // id:1; Advisors
        _setupSupply(90000000 * dFactor); // id:2; Public Sale via https://bew.dev
        _setupSupply(7500000 * dFactor);  // id:3; Affiliate
        _setupSupply(7500000 * dFactor);  // id:4; Airdrop
        _setupSupply(90000000 * dFactor); // id:5; Staking
        _setupSupply(60000000 * dFactor); // id:6; Whale Bridge

        // Init supply for Founders | 4.5 millions first allocation
        _mint(msg.sender, 4500000 * dFactor, 0);

        // Ethereum network
        //_setupSupply(50000000 * dFactor); // id:0; Rewards for completing game quests
        //_setupSupply(20000000 * dFactor); // id:1; DAO rewards
        //_setupSupply(40000000 * dFactor); // id:2; Staking
        //_setupSupply(30000000 * dFactor); // id:3; Marketing
        //_setupSupply(20000000 * dFactor); // id:4; Strategic reserve
        //_setupSupply(40000000 * dFactor); // id:5; Whale Bridge

        _setupRole(SUPER_ADMIN_ROLE, msg.sender);
        _setupRole(BURNER_ROLE, msg.sender);
    }

    function getAllocationRole(int8 allocationType) public pure returns (bytes32) {
        return keccak256(abi.encodePacked("ALLOCATION_ROLE_", allocationType));
    }

    /**
     * @dev
     * onlyRole(keccak256(abi.encodePacked("ALLOCATION_ROLE_", allocationType)))
     * cheaper than onlyRole(getAllocationRole(allocationType))
     */
    function mint(address to, uint256 amount, int8 allocationType)
        public
        onlyRole(keccak256(abi.encodePacked("ALLOCATION_ROLE_", allocationType)))
        override
        returns (bool)
    {
        _mint(to, amount, allocationType);
        return true;
    }

    function burn(uint256 amount, int8 allocationType)
        public
        onlyRole(BURNER_ROLE)
        override
        returns (bool)
    {
        _burn(amount, allocationType);
        return true;
    }

    function pause() public onlyRole(SUPER_ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(SUPER_ADMIN_ROLE) {
        _unpause();
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }
}
