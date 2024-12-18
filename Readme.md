# Introduction

IAmuse aspires to be a platform that can be used to derive the value of any item using a prediction market. 

## Hackathon Use Case

The project showcases a use-case for such a model with a unique PvP game where two contenders face off, showcasing their assets in a dynamic, wager-based environment. The platform allows players to pit their digital assets (like Nouns DAO NFTs, CryptoPunks, MEME's or any collectible art) against each other in PvP (Player vs. Player) battles, where the community wagers on the potential winner. It utilizes AI-powered valuation wherein the winner is determined not by human opinion or market trends alone, but by an LLM that evaluates the art based on a complex mix of aesthetic qualities, community sentiment, rarity, and other factors.

Wagerers can place bets and receive a share of tokens based on the winning contender. The winner of the challenge also receives a share from the betting pool.


<p align="center">
  <img src="assets/IAMuse-sequence.png" alt="IAmuse sequence" style="width: 100%;" />
</p>


## Phala 
curl https://wapo-testnet.phala.network/ipfs/Qmc7zrN4Pen3ML7FHfoBEZpAosUjtK3fKBvh81ndbTeDy7?key=6742e16566409f95&type=challenge
curl https://wapo-testnet.phala.network/logs/all/ipfs/QmXaXHKHY6usYaVfGHipqKTgtLmJEuaPppk3P1qHAsxteC\?key\=82ff40c7e5977a08

Logs Shared - 

https://red-pill.ai/shares/aaa73668-00aa-4728-a1f2-7d00afedd78a

<br/>

### Contract deployments

**Gnosis Chiado**

| Contract | Address  |
| :----- | :- |
| GameController | [`0xbda16b92cda4efdb6b059ed77b98bfcbda29973f`](https://gnosis-chiado.blockscout.com/address/0xbda16b92cda4efdb6b059ed77b98bfcbda29973f)|

**Chiliz Spicy**

| Contract | Address  |
| :----- | :- |
| GameFactory | [`0x8CFfFB42c942190d6e7fF2e3fcf1Fae1C772E323`](https://testnet.chiliscan.com/address/0x8CFfFB42c942190d6e7fF2e3fcf1Fae1C772E323)|
| Game base implementation | [`0xCEC24cFeca71A6Afd17b13363a0f2348DfAc295e`](https://testnet.chiliscan.com/address/0xCEC24cFeca71A6Afd17b13363a0f2348DfAc295e)|
| ConditionalTokens  | [`0xCEC24cFeca71A6Afd17b13363a0f2348DfAc295e`](https://testnet.chiliscan.com/address/0xcec24cfeca71a6afd17b13363a0f2348dfac295e) |
| USDX | [`0xe62bc5aac85e4e2e39888236a3b7128e69d9f6c3`](https://testnet.chiliscan.com/address/0xe62bc5aac85e4e2e39888236a3b7128e69d9f6c3)|


**Flow Testnet**

| Contract | Address  |
| :----- | :- |
| GameFactory | [`0x216205E0EEDAdcc15ee46D0965E217BCF91E881D`](https://evm-testnet.flowscan.io/address/0x216205E0EEDAdcc15ee46D0965E217BCF91E881D)|
| Game base implementation | [`0x37ce7eF05E7D93EeD602bB3A5352BC625578862C`](https://evm-testnet.flowscan.io/address/0x37ce7eF05E7D93EeD602bB3A5352BC625578862C)|
| ConditionalTokens  | [`0xaA3117cb5E45C6b4ACEaFb7D2AA011435f3cCe92`](https://evm-testnet.flowscan.io/address/0xaA3117cb5E45C6b4ACEaFb7D2AA011435f3cCe92) |
| USDX | [`0xd3d940D07Cea99E1aDc52dF368DfBA87558DE637`](https://evm-testnet.flowscan.io/address/0xd3d940D07Cea99E1aDc52dF368DfBA87558DE637)|
