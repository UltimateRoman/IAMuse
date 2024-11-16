import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, Address } from "@graphprotocol/graph-ts"
import {
  GameCreated,
  OwnershipTransferred
} from "../generated/GameFactory/GameFactory"

export function createGameCreatedEvent(
  gameId: Bytes,
  game: Address,
  metadataURI: string
): GameCreated {
  let gameCreatedEvent = changetype<GameCreated>(newMockEvent())

  gameCreatedEvent.parameters = new Array()

  gameCreatedEvent.parameters.push(
    new ethereum.EventParam("gameId", ethereum.Value.fromFixedBytes(gameId))
  )
  gameCreatedEvent.parameters.push(
    new ethereum.EventParam("game", ethereum.Value.fromAddress(game))
  )
  gameCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "metadataURI",
      ethereum.Value.fromString(metadataURI)
    )
  )

  return gameCreatedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}
