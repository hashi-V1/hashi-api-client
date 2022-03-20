import { TransactionResponse } from "@ethersproject/abstract-provider";
import { Contract, Signer } from "ethers";
import erc721Abi from "../abi/ethereum/ERC721.json";
import lockerAbi from "../abi/ethereum/Locker.json";
import wrapperAbi from "../abi/ethereum/Wrapper.json";
import { chainConfig } from "../config";
import { Chain } from "../types/chain";
import { Progress } from "../types/progress";
import { Signature, UnsignedMessageType } from "../types/proof";
import { LockedTokenType, Token, WrappedTokenType } from "../types/token";

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
 * @param token The token that will be locked
 * @param destinationAddress The addres on the target chain that will be receiving the token
 * @param signer The ethers.js signer created by setChainSignerEthereum
 * @param setProgress optional callback to track the progress
 * @returns a promise with the token's lock timestamp
 */
export async function approveAndLockEthereum(
    token: Token,
    destinationAddress: string,
    signer: Signer,
    setProgress: (progress: Progress) => void
): Promise<number> {
    const lockerContract = new Contract(
        chainConfig[token.chain].lockerContract,
        lockerAbi,
        signer
    );
    const tokenContract = new Contract(token.tokenContract, erc721Abi, signer);

    setProgress(Progress.WaitingForUserApproval);
    const approveTx: TransactionResponse = await tokenContract.approve(
        chainConfig[token.chain].lockerContract,
        token.tokenId
    );

    setProgress(Progress.WaitingForConfirmationApproval);
    await approveTx.wait();

    setProgress(Progress.WaitingForUserLock);
    const lockTx: TransactionResponse = await lockerContract.lock(
        token.tokenContract,
        token.tokenId,
        destinationAddress
    );

    setProgress(Progress.WaitingForConfirmationLock);
    const confirm = await lockTx.wait();

    const block = await signer.provider!.getBlock(confirm.blockNumber);
    return block.timestamp;
}

/**
 * Wraps a token on a specific chain with proofs from the federation.
 * @param chain The wrapping chain
 * @param message The unsigned message returned by the nodes
 * @param signatures The signature of the message
 * @param signer The ethers.js signer created by setChainSignerEthereum
 * @param setProgress optional callback to track the progress
 * @returns a wrapped token
 */
export async function wrapTokenEthereum(
    chain: Chain,
    message: UnsignedMessageType,
    signatures: Signature[],
    signer: Signer,
    setProgress: (progress: Progress) => void
): Promise<WrappedTokenType> {
    const wrapperContract = new Contract(
        chainConfig[chain].wrapperContract,
        wrapperAbi,
        signer
    );

    setProgress(Progress.WaitingForUserWrap);
    const wrapTx: TransactionResponse = await wrapperContract.wrap(
        message.tokenContract,
        message.tokenId,
        message.timestamp,
        message.metadata,
        signatures.map((signature) => signature.publicKey),
        signatures.map((signature) => signature.sig)
    );

    setProgress(Progress.WaitingForConfirmationWrap);
    await wrapTx.wait();

    const tokenId: number = await wrapperContract.wrappedTokens(
        message.tokenContract,
        message.tokenId
    );

    if (isNaN(tokenId) || tokenId === 0)
        return Promise.reject("Failed to retrieve token id.");

    return {
        tokenContract: wrapperContract.address,
        tokenId,
        chain: chain,
    };
}

/**
 * Burn a wrapped token to transfer it to another chain
 * @param chain The chain where the token is currently wrapped
 * @param token The wrapped token to burn
 * @param destinationAddress The address on the target chain that will receive the token
 * @param signer The ethers.js signer created by setChainSignerEthereum
 * @param setProgress optional callback to track the progress
 * @returns an empty promise
 */
export async function burnTokenEthereum(
    chain: Chain,
    token: LockedTokenType,
    destinationAddress: string,
    signer: Signer,
    setProgress: (progress: Progress) => void
): Promise<void> {
    const wrapperContract = new Contract(
        chainConfig[chain].wrapperContract,
        wrapperAbi,
        signer
    );

    setProgress(Progress.WaitingForUserBurn);
    const burnTx: TransactionResponse = await wrapperContract.burn(
        token.tokenContract,
        token.tokenId,
        token.timestamp,
        destinationAddress
    );

    setProgress(Progress.WaitingForConfirmationBurn);
    await burnTx.wait();
}

/**
 * Withdraws a token on an Ethereum chain (sends back the initial token before the lock)
 * @param chain The initial chain of the token
 * @param message An unsigned message sent by the nodes
 * @param signatures signatures returned by the nodes proving the message
 * @param signer The signer instance from ethers.js
 * @param setProgress optional callback to track the progress
 * @returns an empty promise
 */
export async function withdrawTokenEthereum(
    chain: Chain,
    message: UnsignedMessageType,
    signatures: Signature[],
    signer: Signer,
    setProgress: (progress: Progress) => void
): Promise<void> {
    const lockerContract = new Contract(
        chainConfig[chain].lockerContract,
        lockerAbi,
        signer
    );

    setProgress(Progress.WaitingForUserWithdraw);
    const withdrawTx: TransactionResponse = await lockerContract.withdraw(
        message.tokenContract,
        message.tokenId,
        message.timestamp,
        [],
        []
    );

    setProgress(Progress.WaitingForConfirmationWithdraw);
    await withdrawTx.wait();
}

export async function getLockedTokenEthereum(
    wrapped: WrappedTokenType,
    signer: Signer
): Promise<LockedTokenType> {
    const wrapperContract = new Contract(
        chainConfig[wrapped.chain].wrapperContract,
        wrapperAbi,
        signer
    );

    const val: {
        tokenContract: string;
        tokenId: number;
        tokenLockTimestamp: number;
    } = await wrapperContract.wrappedId(wrapped.tokenId);

    return {
        tokenContract: val.tokenContract,
        tokenId: val.tokenId,
        timestamp: val.tokenLockTimestamp,
    };
}
