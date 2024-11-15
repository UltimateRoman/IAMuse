// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IConditionalTokens } from "./interfaces/IConditionalTokens.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Clones } from "@openzeppelin/contracts/proxy/Clones.sol";
import { Game } from "./Game.sol";

contract GameFactory is Ownable {
    address public oracle;
    IERC20 public token;
    IConditionalTokens public conditionalTokens;

    address gameTemplate;

    mapping(bytes32 => address) games;

    event GameCreated(bytes32 gameId, address game, string metadataURI);

    constructor(
        address _oracle, 
        IERC20 _token,
        IConditionalTokens _conditionalTokens
    ) Ownable(msg.sender) {
        oracle = _oracle;
        token = _token;
        conditionalTokens = _conditionalTokens;
        gameTemplate = address(new Game());
    }

    function createGame(bytes32 gameId, string calldata metadataURI) public onlyOwner {
        address game = Clones.clone(gameTemplate);
        Game(game).initialize(gameId, oracle, token, conditionalTokens, metadataURI);
        games[gameId] = game;
        emit GameCreated(gameId, game, metadataURI);
    }

    function setOracle(address _oracle) public onlyOwner {
        oracle = _oracle;
    }

    function setToken(IERC20 _token) public onlyOwner {
        token = _token;
    }

    function setConditionalTokens(IConditionalTokens _conditionalTokens) public onlyOwner {
        conditionalTokens = _conditionalTokens;
    }

    function getGame(bytes32 gameId) public view returns (address) {
        return games[gameId];
    }
}