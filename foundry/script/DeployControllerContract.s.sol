//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../src/GameController.sol";
import "./DeployHelpers.s.sol";


contract DeployControllerContract is ScaffoldETHDeploy {
  // use `deployer` from `ScaffoldETHDeploy`
  function run() external ScaffoldEthDeployerRunner {
    GameController gameController = new GameController();
    console.logString(
      string.concat(
        "GameController deployed at: ", vm.toString(address(gameController))
      )
    );
  }
}
