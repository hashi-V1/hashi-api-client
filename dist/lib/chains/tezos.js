"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLockedTokenTezos = exports.withdrawTokenTezos = exports.burnTokenTezos = exports.wrapTokenTezos = exports.approveAndLockTezos = exports.setChainSignerTezos = void 0;
var taquito_1 = require("@taquito/taquito");
var config_1 = require("../config");
var progress_1 = require("../types/progress");
var utils_1 = require("../utils");
/**
 * Checks whether the TezosSigner is a WalletProvider instead of a Signer
 * @param signer a TezosSigner signer
 * @returns a boolean and a type predicate
 */
function tezosSignerIsWalletProvider(signer) {
    return (typeof signer === "object" &&
        "getPKH" in signer &&
        "mapTransferParamsToWalletParams" in signer &&
        "mapOriginateParamsToWalletParams" in signer &&
        "mapDelegateParamsToWalletParams" in signer &&
        "sendOperations" in signer);
}
/**
 * Creates a TezosToolkit instance with the giver signer
 * @param chain The signer's current chain (used to know whether we are using a testnet or the mainnet)
 * @param signer the corresponding signer (wallet or inMemorySigner)
 * @returns The TezosToolkit instance
 */
function setChainSignerTezos(chain, signer) {
    var Tezos = new taquito_1.TezosToolkit(config_1.chainConfig[chain].rpc);
    if (tezosSignerIsWalletProvider(signer)) {
        Tezos.setWalletProvider(signer);
    }
    else {
        Tezos.setSignerProvider(signer);
    }
    return Tezos;
}
exports.setChainSignerTezos = setChainSignerTezos;
/**
 * Convert an array of Signatures to a MichelsonMap
 * @param signatures an array of Signature(s)
 * @returns a MichelsonMap with the public key as key and sig as value
 */
function signatureArrayToMichelsonMap(signatures) {
    var map = new taquito_1.MichelsonMap();
    signatures.forEach(function (signature) {
        return map.set(signature.publicKey, signature.sig);
    });
    return map;
}
/**
 * Approves and locks at the same time a token on a Tezos network.
 * @param token The token that will be locked
 * @param destinationAddress The addres on the target chain that will be receiving the token
 * @param setProgress optional callback to track the progress
 * @param Tezos The TezosToolkit instance corresponding to that chain
 */
function approveAndLockTezos(token, destinationAddress, Tezos, setProgress) {
    var operation = function (signerAddress) {
        return Tezos.wallet
            .at(config_1.chainConfig[token.chain].lockerContract)
            .then(function (lockerContract) {
            return Tezos.wallet
                .at(token.tokenContract)
                .then(function (tokenContract) {
                setProgress(progress_1.Progress.WaitingForUserApproval);
                setProgress(progress_1.Progress.WaitingForUserLock);
                return Tezos.wallet
                    .batch()
                    .withContractCall(tokenContract.methods.update_operators([
                    {
                        add_operator: {
                            owner: signerAddress,
                            operator: lockerContract.address,
                            token_id: token.tokenId,
                        },
                    },
                ]))
                    .withContractCall(lockerContract.methodsObject.lock({
                    destination_address: destinationAddress,
                    token_address: token.tokenContract,
                    token_id: token.tokenId.toString(),
                }))
                    .send();
            })
                .then(function (op) {
                setProgress(progress_1.Progress.WaitingForConfirmationApproval);
                setProgress(progress_1.Progress.WaitingForConfirmationLock);
                return op.confirmation();
            })
                .then(function (confirm) {
                if (!confirm.completed) {
                    return Promise.reject("Transaction not completed");
                }
                return Date.parse(confirm.block.header.timestamp.toString());
            });
        });
    };
    return Tezos.wallet.pkh().then(operation);
}
exports.approveAndLockTezos = approveAndLockTezos;
/**
 * Wraps a token on a specific chain with proofs from the federation.
 * TODO: Signatures not recognized by contracts
 * @param chain The wrapping chain
 * @param message The unsigned message returned by the nodes
 * @param signatures The signature of the message
 * @param Tezos The TezosToolkit instance from setChainSignerTezos
 * @param setProgress optional callback to track the progress
 * @returns a wrapped token
 */
function wrapTokenTezos(chain, message, signatures, Tezos, setProgress) {
    return Tezos.wallet
        .at(config_1.chainConfig[chain].wrapperContract)
        .then(function (wrapperContract) {
        setProgress(progress_1.Progress.WaitingForUserWrap);
        return wrapperContract.methodsObject
            .wrap({
            token_contract: message.tokenContract,
            token_id: message.tokenId.toString(),
            lock_timestamp: new Date(message.timestamp).toISOString(),
            token_metadata: (0, utils_1.stringToHex)(message.metadata),
            signatures: signatureArrayToMichelsonMap(signatures),
        })
            .send()
            .then(function (op) {
            setProgress(progress_1.Progress.WaitingForConfirmationWrap);
            return op.confirmation();
        })
            .then(function (confirm) {
            if (!confirm.completed) {
                return Promise.reject("Transaction not completed");
            }
            return wrapperContract.storage().then(function (wrapperStorage) {
                if (wrapperStorage === null ||
                    typeof wrapperStorage !== "object" ||
                    !(0, utils_1.hasOwnProperty)(wrapperStorage, "wrapped_tokens") ||
                    !taquito_1.MichelsonMap.isMichelsonMap(wrapperStorage.wrapped_tokens)) {
                    return Promise.reject("Invalid wrapper storage");
                }
                var tid = parseInt(wrapperStorage.wrapped_tokens.get({
                    token_contract: message.tokenContract,
                    token_id: message.tokenId.toString(),
                }));
                if (isNaN(tid)) {
                    return Promise.reject("Could not retrieve wrapped token id");
                }
                return tid;
            });
        });
    })
        .then(function (tokenId) { return ({
        tokenContract: config_1.chainConfig[chain].wrapperContract,
        tokenId: tokenId,
        chain: chain,
    }); });
}
exports.wrapTokenTezos = wrapTokenTezos;
/**
 * Burn a wrapped token to transfer it to another chain
 * @param chain The chain where the token is currently wrapped
 * @param token The wrapped token to burn
 * @param destinationAddress The address on the target chain that will receive the token
 * @param Tezos The TezosToolkit instance from setChainSignerTezos
 * @param setProgress optional callback to track the progress
 * @returns an empty promise
 */
function burnTokenTezos(chain, token, destinationAddress, Tezos, setProgress) {
    return Tezos.wallet
        .at(config_1.chainConfig[chain].wrapperContract)
        .then(function (wrapperContract) {
        setProgress(progress_1.Progress.WaitingForUserBurn);
        return wrapperContract.methodsObject
            .burn({
            destination_address: destinationAddress,
            lock_timestamp: token.timestamp.toString(),
            token_contract: token.tokenContract,
            token_id: token.tokenId.toString(),
        })
            .send();
    })
        .then(function (op) {
        setProgress(progress_1.Progress.WaitingForConfirmationBurn);
        return op.confirmation();
    })
        .then(function (confirm) {
        if (!confirm.completed)
            return Promise.reject("could not burn");
    });
}
exports.burnTokenTezos = burnTokenTezos;
/**
 * Withdraws a token on a Tezos chain (sends back the initial token before the lock)
 * @param chain The initial chain of the token
 * @param message An unsigned message sent by the nodes
 * @param signatures signatures returned by the nodes proving the message
 * @param Tezos The TezosToolkit instance
 * @param setProgress optional callback to track the progress
 * @returns an empty promise
 */
function withdrawTokenTezos(chain, message, signatures, Tezos, setProgress) {
    return Tezos.wallet
        .at(config_1.chainConfig[chain].lockerContract)
        .then(function (lockerContract) {
        setProgress(progress_1.Progress.WaitingForUserWithdraw);
        return lockerContract.methodsObject
            .withdraw({
            token_address: message.tokenContract,
            token_id: message.tokenId.toString(),
            locked_timestamp: message.timestamp.toString(),
            signatures: new taquito_1.MichelsonMap(),
        })
            .send();
    })
        .then(function (op) {
        setProgress(progress_1.Progress.WaitingForConfirmationWithdraw);
        return op.confirmation();
    })
        .then(function (confirm) {
        if (!confirm.completed)
            return Promise.reject("could not withdraw");
    });
}
exports.withdrawTokenTezos = withdrawTokenTezos;
function getLockedTokenTezos(wrapped, Tezos) {
    return Tezos.contract
        .at(wrapped.tokenContract)
        .then(function (wrapperContract) { return wrapperContract.storage(); })
        .then(function (wrapperStorage) {
        if (wrapperStorage === null ||
            typeof wrapperStorage !== "object" ||
            !(0, utils_1.hasOwnProperty)(wrapperStorage, "wrapped_id") ||
            !taquito_1.MichelsonMap.isMichelsonMap(wrapperStorage.wrapped_id)) {
            return Promise.reject("Invalid wrapper storage.");
        }
        var r = wrapperStorage.wrapped_id.get(wrapped.tokenId.toString());
        if (r === null ||
            typeof r !== "object" ||
            !(0, utils_1.hasOwnProperty)(r, "lock_timestamp") ||
            !(0, utils_1.hasOwnProperty)(r, "token_contract") ||
            !(0, utils_1.hasOwnProperty)(r, "token_id")) {
            return Promise.reject("Could not retrieve wrapped token");
        }
        return {
            tokenId: r.token_id,
            tokenContract: r.token_contract,
            timestamp: r.lock_timestamp,
        };
    });
}
exports.getLockedTokenTezos = getLockedTokenTezos;
//# sourceMappingURL=tezos.js.map