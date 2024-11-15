// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IConditionalTokens {
    function getConditionId(
        address oracle, 
        bytes32 questionId, 
        uint256 outcomeSlotCount
    ) external view returns (bytes32);

    function prepareCondition(
        address oracle, 
        bytes32 questionId, 
        uint256 outcomeSlotCount
    ) external;
}
