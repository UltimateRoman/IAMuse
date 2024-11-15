//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DeployHelpers.s.sol";
import { DeployContracts } from "./DeployContracts.s.sol";

contract DeployScript is ScaffoldETHDeploy {
  function run() external {
    DeployContracts deployContracts = new DeployContracts();
    deployContracts.run();

    // deploy more contracts here
    // DeployMyContract deployMyContract = new DeployMyContract();
    // deployMyContract.run();
  }
}
