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
 * @param chain The token's current chain (used to know whether we are using a testnet or the mainnet)
 * @param token The token that will be locked
 * @param destinationAddress The addres on the target chain that will be receiving the token
 * @param signer The ethers.js signer created by setChainSignerEthereum
 * @param setProgress optional callback to track the progress
 * @returns a promise with the token's lock timestamp
 */
export function approveAndLockEthereum(
    chain: Chain,
    token: Token,
    destinationAddress: string,
    signer: Signer,
    setProgress: (progress: Progress) => void
): Promise<number> {
    const lockerContract = new Contract(
        chainConfig[chain].lockerContract,
        lockerAbi.abi,
        signer
    );
    const tokenContract = new Contract(token.tokenContract, erc721Abi, signer);

    setProgress(Progress.WaitingForUserApproval);
    return (
        tokenContract.approve(
            chainConfig[chain].lockerContract,
            token.tokenId
        ) as Promise<TransactionResponse>
    )
        .then((tx) => {
            setProgress(Progress.WaitingForConfirmationApproval);
            return tx.wait();
        })
        .then(() => {
            setProgress(Progress.WaitingForUserLock);
            return lockerContract.lock(
                token.tokenContract,
                token.tokenId,
                destinationAddress
            ) as Promise<TransactionResponse>;
        })
        .then((tx) => {
            setProgress(Progress.WaitingForConfirmationLock);
            return tx.wait();
        })
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
 * @param setProgress optional callback to track the progress
 * @returns a wrapped token
 */
export function wrapTokenEthereum(
    chain: Chain,
    message: UnsignedMessageType,
    signatures: Signature[],
    signer: Signer,
    setProgress: (progress: Progress) => void
): Promise<WrappedTokenType> {
    const wrapperContract = new Contract(
        chainConfig[chain].wrapperContract,
        wrapperAbi.abi,
        signer
    );

    setProgress(Progress.WaitingForUserWrap);
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
        .then((tx) => {
            setProgress(Progress.WaitingForConfirmationWrap);
            return tx.wait();
        })
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
 * @param setProgress optional callback to track the progress
 * @returns an empty promise
 */
export function burnTokenEthereum(
    chain: Chain,
    token: LockedTokenType,
    destinationAddress: string,
    signer: Signer,
    setProgress: (progress: Progress) => void
): Promise<void> {
    const wrapperContract = new Contract(
        chainConfig[chain].wrapperContract,
        wrapperAbi.abi,
        signer
    );

    setProgress(Progress.WaitingForUserBurn);
    return (
        wrapperContract.burn(
            token.tokenContract,
            token.tokenId,
            token.timestamp,
            destinationAddress
        ) as Promise<TransactionResponse>
    )
        .then((tx) => {
            setProgress(Progress.WaitingForConfirmationBurn);
            return tx.wait();
        })
        .then();
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
export function withdrawTokenEthereum(
    chain: Chain,
    message: UnsignedMessageType,
    signatures: Signature[],
    signer: Signer,
    setProgress: (progress: Progress) => void
): Promise<void> {
    const lockerContract = new Contract(
        chainConfig[chain].lockerContract,
        lockerAbi.abi,
        signer
    );

    setProgress(Progress.WaitingForUserWithdraw);
    return (
        lockerContract.withdraw(
            message.tokenContract,
            message.tokenId,
            message.timestamp,
            [],
            []
        ) as Promise<TransactionResponse>
    )
        .then((tx) => {
            setProgress(Progress.WaitingForConfirmationWithdraw);
            return tx.wait();
        })
        .then();
}
