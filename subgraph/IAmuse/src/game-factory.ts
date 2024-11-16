import { Entity } from "@graphprotocol/graph-ts"
import {
  GameCreated as GameCreatedEvent,
  OwnershipTransferred as OwnershipTransferredEvent
} from "../generated/GameFactory/GameFactory"
import { GameCreated, OwnershipTransferred } from "../generated/schema"

import {GameInst} from '../generated/templates'
import {PreparedForBidding as PreparedForBiddingEvent
  ,GameFinished as GameFinishedEvent
} from '../generated/templates/GameInst/Game'

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

  GameInst.create(event.params.game);
  entity.status=0;
  entity.save()
}

export function handlePrepareForBidding(
  event: PreparedForBiddingEvent
): void {
  let entity = GameCreated.load(event.params.gameId);
  if (entity == null) {
    entity = new GameCreated(event.params.gameId)
  }
  entity.status=1;
  entity.save()
}

export function handleGameFinished(
  event: GameFinishedEvent
): void {
  let entity = GameCreated.load(event.params.gameId);
  if (entity == null) {
    entity = new GameCreated(event.params.gameId)
  }

  entity.status=2;
  entity.save()
}

