// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

abstract contract AccessControl {
    struct RoleData {
        mapping(address => bool) members;
        bytes32 adminRole;
    }

    mapping(bytes32 => RoleData) private _roles;
    bytes32 public constant SUPER_ADMIN_ROLE = 0x00;

    modifier onlyRole(bytes32 role) {
        require(_roles[role].members[msg.sender], "AccessControl: access is denied");
        _;
    }

    function hasRole(bytes32 role, address account) public view returns (bool) {
        return _roles[role].members[account];
    }

    function grantRole(bytes32 role, address account) public virtual onlyRole(SUPER_ADMIN_ROLE) {
        _setupRole(role, account);
    }

    function revokeRole(bytes32 role, address account) public virtual onlyRole(SUPER_ADMIN_ROLE) {
        if(_roles[role].members[account]) {
            _roles[role].members[account] = false;
        }
    }

    function _setupRole(bytes32 role, address account) internal virtual {
        if(!_roles[role].members[account]) {
            _roles[role].members[account] = true;
        }
    }
}
