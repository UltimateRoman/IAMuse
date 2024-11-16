import {
  GameCreated as GameCreatedEvent,
  OwnershipTransferred as OwnershipTransferredEvent
} from "../generated/GameFactory/GameFactory"
import { GameCreated, OwnershipTransferred } from "../generated/schema"

import {Game} from '../generated/templates'
import {PreparedForBidding as PreparedForBiddingEvent} from '../generated/templates/Game/Game'

export function handleGameCreated(event: GameCreatedEvent): void {
  let entity = new GameCreated(
    event.params.gameId
  )
  entity.gameId = event.params.gameId
  entity.game = event.params.game
  entity.metadataURI = event.params.metadataURI

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  Game.create(event.params.gameId);
  entity.status=0;
  entity.save()
}

export function handlePrepareForBidding(
  event: PreparedForBiddingEvent
): void {
  let entity = new Game.load()
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

