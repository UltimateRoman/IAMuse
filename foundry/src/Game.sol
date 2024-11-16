// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IERC165 } from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import { IERC1155 } from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import { AccessControlUpgradeable } from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import { IConditionalTokens } from "./interfaces/IConditionalTokens.sol";

contract Game is AccessControlUpgradeable {
    bytes32 public gameId;
    address public oracle;
    string public metadataURI;

    bytes32 conditionId;
    uint256[] positionIds;
    uint256[] partitions;
    bytes32[] collectionIds;

    IERC20 token;
    IConditionalTokens conditionalTokens;

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    enum GameStatus {
        CREATED,
        BIDDING,
        STARTED,
        FINISHED
    }

    GameStatus public status = GameStatus.CREATED;

    modifier onlyOracle() {
        if (msg.sender != oracle) {
            revert NotOracle();
        }
        _;
    }

    error NotOracle();

    constructor() {
        _disableInitializers();
    }

    function initialize(
        bytes32 _gameId,
        address _oracle, 
        IERC20 _token, 
        IConditionalTokens _conditionalTokens,
        string calldata _metadataURI
    ) 
        initializer
        external
    {
        gameId = _gameId;
        oracle = _oracle;
        token = _token;
        conditionalTokens = _conditionalTokens;
        metadataURI = _metadataURI;
        __AccessControl_init();
        _grantRole(DEFAULT_ADMIN_ROLE, _oracle);
        _grantRole(OPERATOR_ROLE, _oracle);
    }

    function prepareForBidding(uint256 outcomeSlotCount) external onlyRole(OPERATOR_ROLE) {
        conditionId = conditionalTokens.getConditionId(oracle, gameId, outcomeSlotCount);
        conditionalTokens.prepareCondition(oracle, gameId, outcomeSlotCount);

        for (uint8 i = 0; i < outcomeSlotCount; i++) {
            uint256 indexSet = 1 << i;

            bytes32 collectionId = conditionalTokens.getCollectionId(bytes32(0), conditionId, indexSet);
            collectionIds.push(collectionId);

            uint256 positionId = conditionalTokens.getPositionId(token, collectionId);
            positionIds.push(positionId);

            partitions.push(indexSet);
        }

        status = GameStatus.BIDDING;
    }

    function setMetadataURI(string calldata _metadataURI) external {
        metadataURI = _metadataURI;
    }
}