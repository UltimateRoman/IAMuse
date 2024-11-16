// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IERC165 } from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import { IERC1155 } from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import { IERC1155Receiver } from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import { AccessControlUpgradeable } from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import { IConditionalTokens } from "./interfaces/IConditionalTokens.sol";

contract Game is IERC1155Receiver, AccessControlUpgradeable {
    bytes32 public gameId;
    address public oracle;
    string public metadataURI;

    uint256 numberOfOutcomes;
    bytes32 conditionId;
    uint256[] positionIds;
    uint256[] partitions;
    bytes32[] collectionIds;

    IERC20 token;
    IConditionalTokens conditionalTokens;
    mapping(address => uint256) bets;

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

    modifier gameStarted() {
        if (status != GameStatus.STARTED) {
            revert NotStarted();
        }
        _;
    }

    modifier gameNotStarted() {
        if (status == GameStatus.STARTED) {
            revert GameHasStarted();
        }
        _;
    }

    modifier inBidding() {
        if (status != GameStatus.BIDDING) {
            revert NotInBidding();
        }
        _;
    }

    modifier gameFinished() {
        if (status != GameStatus.FINISHED) {
            revert NotFinished();
        }
        _;
    }

    event PreparedForBidding(uint256 outcomeSlotCount);
    event PlacedBet(address wagerer, uint256 playerId, uint256 amount);
    event GameStarted();

    error NotOracle();
    error NotStarted();
    error NotFinished();
    error GameHasStarted();
    error NotInBidding();
    error InvalidOutcomeSlotCount();

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
        if (status != GameStatus.CREATED) {
            revert GameHasStarted();
        }
        if (outcomeSlotCount < 2) {
            revert InvalidOutcomeSlotCount();
        }

        numberOfOutcomes = outcomeSlotCount;
        conditionId = conditionalTokens.getConditionId(oracle, gameId, numberOfOutcomes);
        conditionalTokens.prepareCondition(oracle, gameId, numberOfOutcomes);

        for (uint8 i = 0; i < outcomeSlotCount; i++) {
            uint256 indexSet = 1 << i;

            bytes32 collectionId = conditionalTokens.getCollectionId(bytes32(0), conditionId, indexSet);
            collectionIds.push(collectionId);

            uint256 positionId = conditionalTokens.getPositionId(token, collectionId);
            positionIds.push(positionId);

            partitions.push(indexSet);
        }

        status = GameStatus.BIDDING;
        emit PreparedForBidding(outcomeSlotCount);
    }

    function placeBet(uint256 playerId, uint256 betAmount) external inBidding {
        token.transferFrom(msg.sender, address(this), betAmount);        

        token.approve(address(conditionalTokens), betAmount);

        conditionalTokens.splitPosition(
            token,
            bytes32(0),
            conditionId,
            partitions,
            betAmount
        );

        IERC1155(address(conditionalTokens)).safeTransferFrom(
            address(this),
            msg.sender,
            positionIds[playerId],
            betAmount,
            ""
        );

        bets[msg.sender] += betAmount;
        emit PlacedBet(msg.sender, playerId, betAmount);
    }

    function startGame() external inBidding onlyRole(OPERATOR_ROLE) {
        status = GameStatus.STARTED;
        emit GameStarted();
    }

    function setMetadataURI(string calldata _metadataURI) external {
        metadataURI = _metadataURI;
    }

    function getConditionalTokenBalance(
        uint256 playerId, 
        address account
    ) public view returns (uint256) {
        uint256 positionId = positionIds[playerId];
        return conditionalTokens.balanceOf(account, positionId);
    }

    function getBetAmount(address account) public view returns (uint256) {
        return bets[account];
    }

    function onERC1155Received(
        address, address, uint256, uint256, bytes calldata
    ) external virtual override returns (bytes4) {
        return bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"));
    }

    function onERC1155BatchReceived(
        address, address, uint256[] calldata, uint256[] calldata, bytes calldata
    ) external virtual override returns (bytes4) {
        return bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"));
    }

    function supportsInterface(bytes4 interfaceId) 
        public view virtual override(AccessControlUpgradeable, IERC165) returns (bool) {
        return interfaceId == type(IERC1155Receiver).interfaceId || super.supportsInterface(interfaceId);
    }
}