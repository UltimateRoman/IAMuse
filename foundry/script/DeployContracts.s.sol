//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../src/GameFactory.sol";
import "../src/mocks/Token.sol";
import "./DeployHelpers.s.sol";


contract DeployContracts is ScaffoldETHDeploy {
  // use `deployer` from `ScaffoldETHDeploy`
  function run() external ScaffoldEthDeployerRunner {
    address owner = msg.sender;

    Token token = new Token(owner, owner);
    console.logString(
      string.concat(
        "Token deployed at: ", vm.toString(address(token))
      )
    );

    GameFactory gameFactory = new GameFactory(
      owner, IERC20(address(token)));
    console.logString(
      string.concat(
        "GameFactory deployed at: ", vm.toString(address(gameFactory))
      )
    );
  }
}
