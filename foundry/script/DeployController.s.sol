//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { DeployControllerContract } from "./DeployControllerContract.s.sol";
import "../src/GameController.sol";
import "./DeployHelpers.s.sol";

contract DeployScript is ScaffoldETHDeploy {
  function run() external {
    DeployControllerContract deployControllerContract = new DeployControllerContract();
    deployControllerContract.run();

    // deploy more contracts here
    // DeployMyContract deployMyContract = new DeployMyContract();
    // deployMyContract.run();
  }
}
