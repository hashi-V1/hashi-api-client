"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashiBridge = void 0;
var ethereum_1 = require("./chains/ethereum");
var tezos_1 = require("./chains/tezos");
var prover_1 = require("./prover");
var chain_1 = require("./types/chain");
var proof_1 = require("./types/proof");
/**
 * Main class of the Hashi Protocol bridge.
 */
var HashiBridge = /** @class */ (function () {
    /**
     * Constructor
     */
    function HashiBridge() {
        this.chainsInstances = new Map();
    }
    /**
     * Saves the signer to use for a chain.
     * @param chain The signer's chain
     * @param signer The corresponding signer
     */
    HashiBridge.prototype.setChainSigner = function (chain, signer) {
        var instance;
        switch (chain) {
            case chain_1.Chain.Tezos:
                instance = (0, tezos_1.setChainSignerTezos)(chain, signer);
                break;
            case chain_1.Chain.Ethereum:
                instance = (0, ethereum_1.setChainSignerEthereum)(chain, signer);
                break;
        }
        this.chainsInstances.set(chain, instance);
    };
    /**
     * Approves and locks at the same time a token.
     * @param chain The token's current chain.
     * @param token The token that will be locked
     * @param destinationAddress The address that will receive the token on the target chain
     */
    HashiBridge.prototype.approveAndLock = function (chain, token, destinationAddress) {
        var instance = this.chainsInstances.get(chain);
        if (typeof instance === "undefined") {
            return Promise.reject("Signer has not been defined for this chain.");
        }
        var timestampedPromise;
        switch (chain) {
            case chain_1.Chain.Tezos:
                timestampedPromise = (0, tezos_1.approveAndLockTezos)(chain, token, destinationAddress, instance);
                break;
            case chain_1.Chain.Ethereum:
                timestampedPromise = (0, ethereum_1.approveAndLockEthereum)(chain, token, destinationAddress, instance);
                break;
        }
        return timestampedPromise.then(function (timestamp) { return ({
            tokenContract: token.tokenContract,
            tokenId: token.tokenId,
            timestamp: timestamp,
        }); });
    };
    /**
     * Wrap a token with signatures from the federation
     * @param chain The wrapping chain
     * @param message The message returned by the nodes
     * @param signatures An array of signatures
     * @returns a promise with a Wrapped token
     */
    HashiBridge.prototype.wrapToken = function (chain, message, signatures) {
        if (message.status !== proof_1.Status.Locked) {
            return Promise.reject("Cannot wrap with status other than locked");
        }
        var instance = this.chainsInstances.get(chain);
        if (typeof instance === "undefined") {
            return Promise.reject("Signer has not been defined for this chain.");
        }
        switch (chain) {
            case chain_1.Chain.Tezos:
                return (0, tezos_1.wrapTokenTezos)(chain, message, signatures, instance);
            case chain_1.Chain.Ethereum:
                return (0, ethereum_1.wrapTokenEthereum)(chain, message, signatures, instance);
        }
    };
    /**
     * Bridges (transfers) a token from one chain to another
     * @param sourceChain The token's current chain
     * @param targetChain The chain where the token should be after the bridge
     * @param token The token to tranfer
     * @param destinationAddress The address on the target chain that will receive the wrapped token
     * @returns a promise with the wrapped token
     */
    HashiBridge.prototype.bridge = function (sourceChain, targetChain, token, destinationAddress) {
        var _this = this;
        return this.approveAndLock(sourceChain, token, destinationAddress)
            .then(function (lockedToken) {
            return _this.proveTokenStatus(sourceChain, targetChain, lockedToken, proof_1.Status.Locked);
        })
            .then(function (_a) {
            var signatures = _a.signatures, message = _a.message;
            return _this.wrapToken(targetChain, message, signatures);
        });
    };
    /**
     * Unbridges a wrapped token (releases the initial token)
     * @param sourceChain The token's current chain
     * @param targetChain The token's initial chain
     * @param token The token to tranfer
     * @param destinationAddress The address on the target chain that will receive the token
     * @returns an empty promise
     */
    HashiBridge.prototype.unbridge = function (sourceChain, targetChain, token, destinationAddress) {
        var _this = this;
        return this.burnToken(sourceChain, token, destinationAddress)
            .then(function () {
            return _this.proveTokenStatus(sourceChain, targetChain, token, proof_1.Status.Burned);
        })
            .then(function (_a) {
            var signatures = _a.signatures, message = _a.message;
            return _this.withdrawToken(targetChain, message, signatures);
        });
    };
    /**
     * Collects proofs of a specific status from nodes.
     * @param sourceChain The chain where the status action took place (lock or burn)
     * @param targetChain The chain which will receive receive the signatures
     * @param token The token that went through the action
     * @param status The action we want to prove
     * @returns a Promise with signatures and an UnsignedMessageType
     */
    HashiBridge.prototype.proveTokenStatus = function (sourceChain, targetChain, token, status) {
        return (0, prover_1.proveTokenStatus)(sourceChain, targetChain, token, status);
    };
    /**
     * Burn a wrapped token to transfer it to another chain
     * @param chain The chain where the token is currently wrapped
     * @param token The wrapped token to burn
     * @param destinationAddress The address on the target chain that will receive the token
     * @returns an empty promise
     */
    HashiBridge.prototype.burnToken = function (chain, token, destinationAddress) {
        var instance = this.chainsInstances.get(chain);
        if (typeof instance === "undefined") {
            return Promise.reject("Signer has not been defined for this chain.");
        }
        switch (chain) {
            case chain_1.Chain.Tezos:
                return (0, tezos_1.burnTokenTezos)(chain, token, destinationAddress, instance);
            case chain_1.Chain.Ethereum:
                return (0, ethereum_1.burnTokenEthereum)(chain, token, destinationAddress, instance);
        }
    };
    /**
     * Withdraws a token on a specific chain (sends back the initial token before the lock)
     * @param chain The initial chain of the token
     * @param message An unsigned message sent by the nodes
     * @param signatures signatures returned by the nodes proving the message
     * @returns an empty promise
     */
    HashiBridge.prototype.withdrawToken = function (chain, message, signatures) {
        if (message.status !== proof_1.Status.Burned) {
            return Promise.reject("Cannot withdraw with status other than burned");
        }
        var instance = this.chainsInstances.get(chain);
        if (typeof instance === "undefined") {
            return Promise.reject("Signer has not been defined for this chain.");
        }
        switch (chain) {
            case chain_1.Chain.Tezos:
                return (0, tezos_1.withdrawTokenTezos)(chain, message, signatures, instance);
            case chain_1.Chain.Ethereum:
                return (0, ethereum_1.withdrawTokenEthereum)(chain, message, signatures, instance);
        }
    };
    return HashiBridge;
}());
exports.HashiBridge = HashiBridge;
//# sourceMappingURL=hashi.js.map