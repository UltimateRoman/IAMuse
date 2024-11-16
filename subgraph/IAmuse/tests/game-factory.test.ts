import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Bytes, Address } from "@graphprotocol/graph-ts"
import { GameCreated } from "../generated/schema"
import { GameCreated as GameCreatedEvent } from "../generated/GameFactory/GameFactory"
import { handleGameCreated } from "../src/game-factory"
import { createGameCreatedEvent } from "./game-factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let gameId = Bytes.fromI32(1234567890)
    let game = Address.fromString("0x0000000000000000000000000000000000000001")
    let metadataURI = "Example string value"
    let newGameCreatedEvent = createGameCreatedEvent(gameId, game, metadataURI)
    handleGameCreated(newGameCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("GameCreated created and stored", () => {
    assert.entityCount("GameCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "GameCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "gameId",
      "1234567890"
    )
    assert.fieldEquals(
      "GameCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "game",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "GameCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "metadataURI",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
