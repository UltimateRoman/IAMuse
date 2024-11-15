// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IERC165 } from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import { IERC1155 } from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import { IConditionalTokens } from "./interfaces/IConditionalTokens.sol";

contract Game {
    bytes32 public gameId;
    address public oracle;
    string public metadataURI;

    IERC20 token;
    IConditionalTokens conditionalTokens;

    function setMetadataURI(string calldata _metadataURI) external {
        metadataURI = _metadataURI;
    }
}