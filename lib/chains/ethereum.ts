import { Contract, Signer } from "ethers";
import lockerAbi from "../abi/ethereum/Locker.json";
import { ChainConfig } from "../config";
import { Chain } from "../types/chain";
import { Token } from "../types/token";

/**
 * Abi represeting the approve function in ERC721 tokens.
 * TODO: Move this abi in a json file in ../abi/ethereum
 */
const tokenAbi = [
    "function approve(address _approved, uint256 _tokenId) external payable",
];

/**
 * Sets the instance for the ethereum signer
 * @param chain The signer's current chain (used to know whether we are using a testnet or the mainnet)
 * @param signer The ethereum Signer (from ethers.js)
 * @returns The instance for this chain
 */
export function setChainSignerEthereum(chain: Chain, signer: Signer) {
    return signer;
}

/**
 * Approves and locks at the same time a token on an Ethereum network.
 * @param chain The token's current chain (used to know whether we are using a testnet or the mainnet)
 * @param token The token that will be locked
 * @param signer The ethers.js signer created by setChainSignerEthereum
 * @param destinationAddress The addres on the target chain that will be receiving the token
 * @returns
 */
export function approveAndLockEthereum(
    chain: Chain,
    token: Token,
    signer: Signer,
    destinationAddress: string
) {
    const lockerContract = new Contract(
        ChainConfig[chain].lockerContract,
        lockerAbi.abi,
        signer
    );
    const tokenContract = new Contract(token.tokenContract, tokenAbi, signer);

    return tokenContract
        .approve(ChainConfig[chain].lockerContract, token.tokenId)
        .then((tx: any) => tx.wait())
        .then(() =>
            lockerContract.lock(
                token.tokenContract,
                token.tokenId,
                destinationAddress
            )
        )
        .then((tx: any) => tx.wait())
        .then((confirm: any) =>
            signer
                .provider!.getBlock(confirm.blockNumber)
                .then((block) => block.timestamp)
        );
}
