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

    function getCollectionId(
        bytes32 parentCollectionId, 
        bytes32 conditionId, 
        uint256 indexSet
    ) external view returns (bytes32);

    function getPositionId(
        IERC20 collateralToken, 
        bytes32 collectionId
    ) external view returns (uint256);

    function splitPosition(
        IERC20 collateralToken,
        bytes32 parentCollectionId,
        bytes32 conditionId,
        uint256[] calldata partition,
        uint256 amount
    ) external;

    function mergePositions(
        IERC20 collateralToken,
        bytes32 parentCollectionId,
        bytes32 conditionId,
        uint256[] calldata partition,
        uint256 amount
    ) external;

    function reportPayouts(bytes32 questionId, uint256[] calldata payouts) external;

    function redeemPositions(
        IERC20 collateralToken, 
        bytes32 parentCollectionId, 
        bytes32 conditionId, 
        uint256[] calldata indexSets
    ) external;

    function balanceOf(address account, uint256 id) external view returns (uint256);

    function balanceOfBatch(
        address[] calldata accounts, 
        uint256[] calldata ids
    ) external view returns (uint256[] memory);
}
