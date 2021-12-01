// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "./ERC20.sol";
import "./interfaces/IERC20Extended.sol";

abstract contract ERC20Extended is ERC20, IERC20Extended {
    struct Supply {
        uint256 maxSupply;
        uint256 circSupply;
    }

    int8 private _allocationType;
    mapping(int8 => Supply) private _supply;

    function _setupSupply(uint256 maxSupply_) internal virtual {
        _supply[_allocationType] = Supply(maxSupply_, 0);
        _allocationType++;
    }

    function totalSupply() public view virtual override returns (uint256) {
        uint256 _totalSupply;

        for(int8 i = 0; i < _allocationType; i++)
            _totalSupply += _supply[i].circSupply;

        return _totalSupply;
    }

    function maxSupply() public view virtual override returns (uint256) {
        uint256 _maxSupply;

        for(int8 i = 0; i < _allocationType; i++)
            _maxSupply += _supply[i].maxSupply;

        return _maxSupply;
    }

    function circulationSupplyByType(int8 allocationType_) public view virtual override returns (uint256) {
        return _supply[allocationType_].circSupply;
    }

    function _mint(address to, uint256 amount, int8 allocationType_) internal virtual {
        require(to != address(0), "ERC20Extended: mint to the zero address");
        require(
          _supply[allocationType_].circSupply + amount <= _supply[allocationType_].maxSupply,
          "ERC20Extended: supply limit"
        );

        super._mintERC20(to, amount);
        _supply[allocationType_].circSupply += amount;

        emit Minted(msg.sender, to, amount, allocationType_);
    }

    function _burn(uint256 amount, int8 allocationType_) internal virtual {
        require(
            _supply[allocationType_].circSupply >= amount,
            "ERC20Extended: not enough tokens in circulation"
        );

        super._burnERC20(msg.sender, amount);
        _supply[allocationType_].circSupply -= amount;

        emit Burned(msg.sender, amount, allocationType_);
    }
}
