//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../src/ctf/ConditionalTokens.sol";
import "../src/GameFactory.sol";
import "../src/mocks/Token.sol";
import "./DeployHelpers.s.sol";


contract DeployContracts is ScaffoldETHDeploy {
  // use `deployer` from `ScaffoldETHDeploy`
  function run() external ScaffoldEthDeployerRunner {
    address owner = msg.sender;

    Game game = new Game();
    console.logString(
      string.concat(
        "Game template deployed at: ", vm.toString(address(game))
      )
    );

    Token token = new Token(owner, owner);
    console.logString(
      string.concat(
        "Token deployed at: ", vm.toString(address(token))
      )
    );

    ConditionalTokens conditionalTokens = new ConditionalTokens();
    console.logString(
      string.concat(
        "ConditionalTokens deployed at: ", vm.toString(address(conditionalTokens))
      )
    );

    GameFactory gameFactory = new GameFactory(
      owner, IERC20(address(token)),  IConditionalTokens(address(conditionalTokens)), game);
    console.logString(
      string.concat(
        "GameFactory deployed at: ", vm.toString(address(gameFactory))
      )
    );
  }
}
