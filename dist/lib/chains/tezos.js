"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawTokenTezos = exports.burnTokenTezos = exports.wrapTokenTezos = exports.approveAndLockTezos = exports.setChainSignerTezos = void 0;
var taquito_1 = require("@taquito/taquito");
var config_1 = require("../config");
/**
 * Checks whether the TezosSigner is a WalletProvider instead of a Signer
 * @param signer a TezosSigner signer
 * @returns a boolean and a type predicate
 */
function tezosSignerIsWalletProvider(signer) {
    return ("getPKH" in signer &&
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
    var Tezos = new taquito_1.TezosToolkit(config_1.ChainConfig[chain].rpc);
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
 * Approves and locks at the same time a token on a Tezos network.
 * @param chain The token's current chain (used to know whether we are using a testnet or the mainnet)
 * @param token The token that will be locked
 * @param destinationAddress The addres on the target chain that will be receiving the token
 * @param Tezos The TezosToolkit instance corresponding to that chain
 */
function approveAndLockTezos(chain, token, destinationAddress, Tezos) {
    var operation = function (signerAddress) {
        return Tezos.wallet
            .at(config_1.ChainConfig[chain].lockerContract)
            .then(function (lockerContract) {
            return Tezos.wallet
                .at(token.tokenContract)
                .then(function (tokenContract) {
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
                .then(function (op) { return op.confirmation(); })
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
 * TODO: Get the wrapped token id from storage
 * @param chain The wrapping chain
 * @param message The unsigned message returned by the nodes
 * @param signatures The signature of the message
 * @param Tezos The TezosToolkit instance from setChainSignerTezos
 * @returns a wrapped token
 */
function wrapTokenTezos(chain, message, signatures, Tezos) {
    return Tezos.wallet
        .at(config_1.ChainConfig[chain].wrapperContract)
        .then(function (wrapperContract) {
        return wrapperContract.methodsObject
            .wrap({
            token_contract: message.tokenContract,
            token_id: message.tokenId.toString(),
            lock_timestamp: message.timestamp.toString(),
            metadata: new taquito_1.MichelsonMap(),
            signatures: new taquito_1.MichelsonMap(),
        })
            .send();
    })
        .then(function (op) { return op.confirmation(); })
        .then(function (confirm) { return ({
        tokenContract: config_1.ChainConfig[chain].wrapperContract,
        tokenId: 5,
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
 * @returns an empty promise
 */
function burnTokenTezos(chain, token, destinationAddress, Tezos) {
    return Tezos.wallet
        .at(config_1.ChainConfig[chain].wrapperContract)
        .then(function (wrapperContract) {
        return wrapperContract.methodsObject
            .burn({
            destination_address: destinationAddress,
            lock_timestamp: token.timestamp.toString(),
            token_contract: token.tokenContract,
            token_id: token.tokenId.toString(),
        })
            .send();
    })
        .then(function (op) { return op.confirmation(); })
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
 * @returns an empty promise
 */
function withdrawTokenTezos(chain, message, signatures, Tezos) {
    return Tezos.wallet
        .at(config_1.ChainConfig[chain].lockerContract)
        .then(function (lockerContract) {
        return lockerContract.methodsObject
            .withdraw({
            token_address: message.tokenContract,
            token_id: message.tokenId.toString(),
            locked_timestamp: message.timestamp.toString(),
            signatures: new taquito_1.MichelsonMap(),
        })
            .send();
    })
        .then(function (op) { return op.confirmation(); })
        .then(function (confirm) {
        if (!confirm.completed)
            return Promise.reject("could not withdraw");
    });
}
exports.withdrawTokenTezos = withdrawTokenTezos;
//# sourceMappingURL=tezos.js.map