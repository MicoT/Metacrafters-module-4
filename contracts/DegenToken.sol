// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DegenToken is ERC20, ERC20Burnable, Ownable {
    struct Item {
        string name;
        uint256 cost;
    }
    mapping(address => bool) public nftSwordOwned;
    mapping(address => bool) public nftSpearOwned;
    mapping(address => bool) public nftShieldOwned;
    
    Item[] public items;
    
    constructor() ERC20("Degen", "DGN") {
        items.push(Item("Nft Sword", 100));
        items.push(Item("Nft Spear", 200));
        items.push(Item("Nft Shield", 300));
    }
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    function burnTokens(uint256 amount) public {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance for burning");
        _burn(msg.sender, amount);
    }

    function transfer(address to, uint256 amount) public override returns (bool) {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance for transfer");
        _transfer(_msgSender(), to, amount);
        return true;
    }
    function redeemTokens(uint8 itemSelection) public {
        require(balanceOf(msg.sender) > 0, "Insufficient balance");

    Item memory selectedItem = items[itemSelection - 1];
        require(balanceOf(msg.sender) >= selectedItem.cost, "Insufficient tokens for the selected item");

    if (itemSelection == 1) {
        nftSwordOwned[msg.sender] = true;
    } else if (itemSelection == 2) {
        nftSpearOwned[msg.sender] = true;
    } else if (itemSelection == 3) {
        nftShieldOwned[msg.sender] = true;
    } else {
        revert("Invalid item selection");
    }

        _burn(msg.sender, selectedItem.cost);
    }   


    function checkTokenBalance(address account) public view returns (uint256) {
        return balanceOf(account);
    }
    function displayAllItems() public view returns (Item[] memory) {
        return items;
    }
}