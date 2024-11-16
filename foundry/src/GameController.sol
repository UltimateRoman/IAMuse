// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

contract GameController {
    struct Game {
        address[] players;
        mapping (address => string) cids;
    }

    mapping(bytes32 => Game) games;

    event JoinedGame(bytes32 gameId, address player);
    event AddedCid(bytes32 gameId, address player, string cid);

    function joinGame(bytes32 gameId) external {
        games[gameId].players.push(msg.sender);
        emit JoinedGame(gameId, msg.sender);
    }

    function addCid(bytes32 gameId, string memory cid) external {
        games[gameId].cids[msg.sender] = cid;
        emit AddedCid(gameId, msg.sender, cid);
    }

    function isValidGame(bytes32 gameId) public view returns (bool) {
        return games[gameId].players.length > 0;
    }

    function getPlayers(bytes32 gameId) public view returns (address[] memory) {
        return games[gameId].players;
    }

    function getCids(bytes32 gameId) public view returns (string[] memory) {
        address[] memory players = games[gameId].players;
        string[] memory cids = new string[](players.length);
        for (uint i = 0; i < players.length; i++) {
            cids[i] = games[gameId].cids[players[i]];
        }
        return cids;
    }
}