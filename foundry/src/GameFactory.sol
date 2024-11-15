// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract GameFactory is Ownable {
    address public oracle;
    IERC20 public token;

    mapping(bytes32 => address) games;

    constructor(
        address _oracle, 
        IERC20 _token
    ) Ownable(msg.sender) {
        oracle = _oracle;
        token = _token;
    }

    function setOracle(address _oracle) public onlyOwner {
        oracle = _oracle;
    }

    function setToken(IERC20 _token) public onlyOwner {
        token = _token;
    }

    function getGame(bytes32 gameId) public view returns (address) {
        return games[gameId];
    }
}