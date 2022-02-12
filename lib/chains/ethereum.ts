import { TransactionResponse } from "@ethersproject/abstract-provider";
import { Contract, Signer } from "ethers";
import lockerAbi from "../abi/ethereum/Locker.json";
import wrapperAbi from "../abi/ethereum/Wrapper.json";
import { ChainConfig } from "../config";
import { Chain } from "../types/chain";
import { Signature, UnsignedMessageType } from "../types/proof";
import { LockedTokenType, Token, WrappedTokenType } from "../types/token";

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
 * @param destinationAddress The addres on the target chain that will be receiving the token
 * @param signer The ethers.js signer created by setChainSignerEthereum
 * @returns a promise with the token's lock timestamp
 */
export function approveAndLockEthereum(
    chain: Chain,
    token: Token,
    destinationAddress: string,
    signer: Signer
): Promise<number> {
    const lockerContract = new Contract(
        ChainConfig[chain].lockerContract,
        lockerAbi.abi,
        signer
    );
    const tokenContract = new Contract(token.tokenContract, tokenAbi, signer);

    return (
        tokenContract.approve(
            ChainConfig[chain].lockerContract,
            token.tokenId
        ) as Promise<TransactionResponse>
    )
        .then((tx) => tx.wait())
        .then(
            () =>
                lockerContract.lock(
                    token.tokenContract,
                    token.tokenId,
                    destinationAddress
                ) as Promise<TransactionResponse>
        )
        .then((tx) => tx.wait())
        .then((confirm) =>
            signer
                .provider!.getBlock(confirm.blockNumber)
                .then((block) => block.timestamp)
        );
}

/**
 * Wraps a token on a specific chain with proofs from the federation.
 * TODO: Get the wrapped token id from storage
 * @param chain The wrapping chain
 * @param message The unsigned message returned by the nodes
 * @param signatures The signature of the message
 * @param signer The ethers.js signer created by setChainSignerEthereum
 * @returns a wrapped token
 */
export function wrapTokenEthereum(
    chain: Chain,
    message: UnsignedMessageType,
    signatures: Signature[],
    signer: Signer
): Promise<WrappedTokenType> {
    const wrapperContract = new Contract(
        ChainConfig[chain].wrapperContract,
        wrapperAbi.abi,
        signer
    );

    return (
        wrapperContract.wrap(
            message.tokenContract,
            message.tokenId,
            message.timestamp,
            message.metadata,
            signatures.map((signature) => signature.publicKey),
            signatures.map((signature) => signature.sig)
        ) as Promise<TransactionResponse>
    )
        .then((tx) => tx.wait())
        .then(() => ({
            tokenContract: wrapperContract.address,
            tokenId: 5,
            chain: chain,
        }));
}

/**
 * Burn a wrapped token to transfer it to another chain
 * @param chain The chain where the token is currently wrapped
 * @param token The wrapped token to burn
 * @param destinationAddress The address on the target chain that will receive the token
 * @param signer The ethers.js signer created by setChainSignerEthereum
 * @returns an empty promise
 */
export function burnTokenEthereum(
    chain: Chain,
    token: LockedTokenType,
    destinationAddress: string,
    signer: Signer
): Promise<void> {
    const wrapperContract = new Contract(
        ChainConfig[chain].wrapperContract,
        wrapperAbi.abi,
        signer
    );

    return (
        wrapperContract.burn(
            token.tokenContract,
            token.tokenId,
            token.timestamp,
            destinationAddress
        ) as Promise<TransactionResponse>
    )
        .then((tx) => tx.wait())
        .then();
}

/**
 * Withdraws a token on an Ethereum chain (sends back the initial token before the lock)
 * @param chain The initial chain of the token
 * @param message An unsigned message sent by the nodes
 * @param signatures signatures returned by the nodes proving the message
 * @param signer The signer instance from ethers.js
 * @returns an empty promise
 */
export function withdrawTokenEthereum(
    chain: Chain,
    message: UnsignedMessageType,
    signatures: Signature[],
    signer: Signer
): Promise<void> {
    const lockerContract = new Contract(
        ChainConfig[chain].lockerContract,
        lockerAbi.abi,
        signer
    );

    return (
        lockerContract.withdraw(
            message.tokenContract,
            message.tokenId,
            message.timestamp,
            [],
            []
        ) as Promise<TransactionResponse>
    )
        .then((tx) => tx.wait())
        .then();
}
