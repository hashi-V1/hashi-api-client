"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLockedTokenFromWrappedEthereum = exports.withdrawTokenEthereum = exports.burnTokenEthereum = exports.wrapTokenEthereum = exports.approveAndLockEthereum = exports.setChainSignerEthereum = void 0;
var ethers_1 = require("ethers");
var ERC721_json_1 = __importDefault(require("../abi/ethereum/ERC721.json"));
var Locker_json_1 = __importDefault(require("../abi/ethereum/Locker.json"));
var Wrapper_json_1 = __importDefault(require("../abi/ethereum/Wrapper.json"));
var config_1 = require("../config");
var progress_1 = require("../types/progress");
/**
 * Sets the instance for the ethereum signer
 * @param chain The signer's current chain (used to know whether we are using a testnet or the mainnet)
 * @param signer The ethereum Signer (from ethers.js)
 * @returns The instance for this chain
 */
function setChainSignerEthereum(chain, signer) {
    return signer;
}
exports.setChainSignerEthereum = setChainSignerEthereum;
/**
 * Approves and locks at the same time a token on an Ethereum network.
 * @param chain The token's current chain (used to know whether we are using a testnet or the mainnet)
 * @param token The token that will be locked
 * @param destinationAddress The addres on the target chain that will be receiving the token
 * @param signer The ethers.js signer created by setChainSignerEthereum
 * @param setProgress optional callback to track the progress
 * @returns a promise with the token's lock timestamp
 */
function approveAndLockEthereum(chain, token, destinationAddress, signer, setProgress) {
    var lockerContract = new ethers_1.Contract(config_1.chainConfig[chain].lockerContract, Locker_json_1.default.abi, signer);
    var tokenContract = new ethers_1.Contract(token.tokenContract, ERC721_json_1.default, signer);
    setProgress(progress_1.Progress.WaitingForUserApproval);
    return tokenContract.approve(config_1.chainConfig[chain].lockerContract, token.tokenId)
        .then(function (tx) {
        setProgress(progress_1.Progress.WaitingForConfirmationApproval);
        return tx.wait();
    })
        .then(function () {
        setProgress(progress_1.Progress.WaitingForUserLock);
        return lockerContract.lock(token.tokenContract, token.tokenId, destinationAddress);
    })
        .then(function (tx) {
        setProgress(progress_1.Progress.WaitingForConfirmationLock);
        return tx.wait();
    })
        .then(function (confirm) {
        return signer
            .provider.getBlock(confirm.blockNumber)
            .then(function (block) { return block.timestamp; });
    });
}
exports.approveAndLockEthereum = approveAndLockEthereum;
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
function wrapTokenEthereum(chain, message, signatures, signer, setProgress) {
    var wrapperContract = new ethers_1.Contract(config_1.chainConfig[chain].wrapperContract, Wrapper_json_1.default.abi, signer);
    setProgress(progress_1.Progress.WaitingForUserWrap);
    return wrapperContract.wrap(message.tokenContract, message.tokenId, message.timestamp, message.metadata, signatures.map(function (signature) { return signature.publicKey; }), signatures.map(function (signature) { return signature.sig; }))
        .then(function (tx) {
        setProgress(progress_1.Progress.WaitingForConfirmationWrap);
        return tx.wait();
    })
        .then(function () {
        return wrapperContract.wrappedTokens(message.tokenContract, message.tokenId).then(function (tid) {
            if (isNaN(tid) || tid === 0) {
                return Promise.reject("Failed to retrieve token id.");
            }
            return tid;
        });
    })
        .then(function (tokenId) { return ({
        tokenContract: wrapperContract.address,
        tokenId: tokenId,
        chain: chain,
    }); });
}
exports.wrapTokenEthereum = wrapTokenEthereum;
/**
 * Burn a wrapped token to transfer it to another chain
 * @param chain The chain where the token is currently wrapped
 * @param token The wrapped token to burn
 * @param destinationAddress The address on the target chain that will receive the token
 * @param signer The ethers.js signer created by setChainSignerEthereum
 * @param setProgress optional callback to track the progress
 * @returns an empty promise
 */
function burnTokenEthereum(chain, token, destinationAddress, signer, setProgress) {
    var wrapperContract = new ethers_1.Contract(config_1.chainConfig[chain].wrapperContract, Wrapper_json_1.default.abi, signer);
    setProgress(progress_1.Progress.WaitingForUserBurn);
    return wrapperContract.burn(token.tokenContract, token.tokenId, token.timestamp, destinationAddress)
        .then(function (tx) {
        setProgress(progress_1.Progress.WaitingForConfirmationBurn);
        return tx.wait();
    })
        .then();
}
exports.burnTokenEthereum = burnTokenEthereum;
/**
 * Withdraws a token on an Ethereum chain (sends back the initial token before the lock)
 * @param chain The initial chain of the token
 * @param message An unsigned message sent by the nodes
 * @param signatures signatures returned by the nodes proving the message
 * @param signer The signer instance from ethers.js
 * @param setProgress optional callback to track the progress
 * @returns an empty promise
 */
function withdrawTokenEthereum(chain, message, signatures, signer, setProgress) {
    var lockerContract = new ethers_1.Contract(config_1.chainConfig[chain].lockerContract, Locker_json_1.default.abi, signer);
    setProgress(progress_1.Progress.WaitingForUserWithdraw);
    return lockerContract.withdraw(message.tokenContract, message.tokenId, message.timestamp, [], [])
        .then(function (tx) {
        setProgress(progress_1.Progress.WaitingForConfirmationWithdraw);
        return tx.wait();
    })
        .then();
}
exports.withdrawTokenEthereum = withdrawTokenEthereum;
function getLockedTokenFromWrappedEthereum(wrapped, signer) {
    var wrapperContract = new ethers_1.Contract(config_1.chainConfig[wrapped.chain].wrapperContract, Wrapper_json_1.default.abi, signer);
    return wrapperContract.wrappedId(wrapped.tokenId).then(function (val) { return ({
        tokenContract: val.tokenContract,
        tokenId: val.tokenId,
        timestamp: val.tokenLockTimestamp,
    }); });
}
exports.getLockedTokenFromWrappedEthereum = getLockedTokenFromWrappedEthereum;
//# sourceMappingURL=ethereum.js.map