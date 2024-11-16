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

    error GameAlreadyCreated();

    modifier notCreated(bytes32 gameId) {
        if (games[gameId] != address(0)) {
            revert GameAlreadyCreated();
        }
        _;
    }

    constructor(
        address _oracle, 
        address _token,
        address _conditionalTokens,
        address _gameTemplate
    ) Ownable(msg.sender) {
        oracle = _oracle;
        token = IERC20(_token);
        conditionalTokens = IConditionalTokens(_conditionalTokens);
        gameTemplate = _gameTemplate;
    }

    function createGame(bytes32 gameId, string calldata metadataURI) external notCreated(gameId) {
        address game = Clones.clone(gameTemplate);
        Game(game).initialize(gameId, oracle, token, conditionalTokens, metadataURI);
        games[gameId] = game;
        emit GameCreated(gameId, game, metadataURI);
    }

    function setOracle(address _oracle) external onlyOwner {
        oracle = _oracle;
    }

    function setToken(IERC20 _token) external onlyOwner {
        token = _token;
    }

    function setConditionalTokens(IConditionalTokens _conditionalTokens) external onlyOwner {
        conditionalTokens = _conditionalTokens;
    }

    function setGameTemplate(address _gameTemplate) external onlyOwner {
        gameTemplate = _gameTemplate;
    }

    function getGame(bytes32 gameId) public view returns (address) {
        return games[gameId];
    }
}