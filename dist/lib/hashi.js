"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashiBridge = void 0;
var ethereum_1 = require("./chains/ethereum");
var tezos_1 = require("./chains/tezos");
var prover_1 = require("./prover");
var chain_1 = require("./types/chain");
var progress_1 = require("./types/progress");
var proof_1 = require("./types/proof");
var utils_1 = require("./utils");
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
     * @param progressCallback optional callback to track the progress
     */
    HashiBridge.prototype.approveAndLock = function (chain, token, destinationAddress, progressCallback) {
        if (destinationAddress === "")
            return Promise.reject(Error("DestinationAddress cannot be empty."));
        var setProgress = (0, utils_1.setProgressCallback)(progressCallback);
        setProgress(progress_1.Progress.ApprovingAndLocking);
        var instance = this.chainsInstances.get(chain);
        if (typeof instance === "undefined") {
            return Promise.reject("Signer has not been defined for this chain.");
        }
        var timestampedPromise;
        switch (chain) {
            case chain_1.Chain.Tezos:
                timestampedPromise = (0, tezos_1.approveAndLockTezos)(chain, token, destinationAddress, instance, setProgress);
                break;
            case chain_1.Chain.Ethereum:
                timestampedPromise = (0, ethereum_1.approveAndLockEthereum)(chain, token, destinationAddress, instance, setProgress);
                break;
        }
        return timestampedPromise.then(function (timestamp) {
            setProgress(progress_1.Progress.ApprovedAndLocked);
            return {
                tokenContract: token.tokenContract,
                tokenId: token.tokenId,
                timestamp: timestamp,
            };
        });
    };
    /**
     * Wrap a token with signatures from the federation
     * @param chain The wrapping chain
     * @param message The message returned by the nodes
     * @param signatures An array of signatures
     * @param progressCallback optional callback to track the progress
     * @returns a promise with a Wrapped token
     */
    HashiBridge.prototype.wrapToken = function (chain, message, signatures, progressCallback) {
        if (message.status !== proof_1.Status.Locked) {
            return Promise.reject("Cannot wrap with status other than locked");
        }
        var setProgress = (0, utils_1.setProgressCallback)(progressCallback);
        setProgress(progress_1.Progress.Wrapping);
        var instance = this.chainsInstances.get(chain);
        if (typeof instance === "undefined") {
            return Promise.reject("Signer has not been defined for this chain.");
        }
        var wrappedPromise;
        switch (chain) {
            case chain_1.Chain.Tezos:
                wrappedPromise = (0, tezos_1.wrapTokenTezos)(chain, message, signatures, instance, setProgress);
                break;
            case chain_1.Chain.Ethereum:
                wrappedPromise = (0, ethereum_1.wrapTokenEthereum)(chain, message, signatures, instance, setProgress);
                break;
        }
        return wrappedPromise.then(function (wrapped) {
            setProgress(progress_1.Progress.Wrapped);
            return wrapped;
        });
    };
    /**
     * Bridges (transfers) a token from one chain to another
     * @param sourceChain The token's current chain
     * @param targetChain The chain where the token should be after the bridge
     * @param token The token to tranfer
     * @param destinationAddress The address on the target chain that will receive the wrapped token
     * @param progressCallback optional callback to track the progress
     * @returns a promise with the wrapped token
     */
    HashiBridge.prototype.bridge = function (sourceChain, targetChain, token, destinationAddress, progressCallback) {
        var _this = this;
        if (destinationAddress === "")
            return Promise.reject(Error("DestinationAddress cannot be empty."));
        return this.approveAndLock(sourceChain, token, destinationAddress, progressCallback)
            .then(function (lockedToken) {
            return _this.proveTokenStatus(sourceChain, targetChain, lockedToken, proof_1.Status.Locked, progressCallback);
        })
            .then(function (_a) {
            var signatures = _a.signatures, message = _a.message;
            return _this.wrapToken(targetChain, message, signatures, progressCallback);
        });
    };
    /**
     * Unbridges a wrapped token (releases the initial token)
     * @param sourceChain The token's current chain
     * @param targetChain The token's initial chain
     * @param token The token to tranfer
     * @param destinationAddress The address on the target chain that will receive the token
     * @param progressCallback optional callback to track the progress
     * @returns an empty promise
     */
    HashiBridge.prototype.unbridge = function (sourceChain, targetChain, token, destinationAddress, progressCallback) {
        var _this = this;
        console.log(destinationAddress);
        if (destinationAddress === "")
            return Promise.reject(Error("DestinationAddress cannot be empty."));
        return this.burnToken(sourceChain, token, destinationAddress, progressCallback)
            .then(function () {
            return _this.proveTokenStatus(sourceChain, targetChain, token, proof_1.Status.Burned, progressCallback);
        })
            .then(function (_a) {
            var signatures = _a.signatures, message = _a.message;
            return _this.withdrawToken(targetChain, message, signatures, progressCallback);
        });
    };
    /**
     * Collects proofs of a specific status from nodes.
     * @param sourceChain The chain where the status action took place (lock or burn)
     * @param targetChain The chain which will receive receive the signatures
     * @param token The token that went through the action
     * @param status The action we want to prove
     * @param progressCallback optional callback to track the progress
     * @returns a Promise with signatures and an UnsignedMessageType
     */
    HashiBridge.prototype.proveTokenStatus = function (sourceChain, targetChain, token, status, progressCallback) {
        var setProgress = (0, utils_1.setProgressCallback)(progressCallback);
        setProgress(progress_1.Progress.ProvingStatus);
        return (0, prover_1.proveTokenStatus)(sourceChain, targetChain, token, status, setProgress).then(function (value) {
            setProgress(progress_1.Progress.ProvedStatus);
            return value;
        });
    };
    /**
     * Burn a wrapped token to transfer it to another chain
     * @param chain The chain where the token is currently wrapped
     * @param token The wrapped token to burn
     * @param destinationAddress The address on the target chain that will receive the token
     * @param progressCallback optional callback to track the progress
     * @returns an empty promise
     */
    HashiBridge.prototype.burnToken = function (chain, token, destinationAddress, progressCallback) {
        if (destinationAddress === "")
            return Promise.reject(Error("DestinationAddress cannot be empty."));
        var setProgress = (0, utils_1.setProgressCallback)(progressCallback);
        setProgress(progress_1.Progress.Burning);
        var instance = this.chainsInstances.get(chain);
        if (typeof instance === "undefined") {
            return Promise.reject("Signer has not been defined for this chain.");
        }
        var burnPromise;
        switch (chain) {
            case chain_1.Chain.Tezos:
                burnPromise = (0, tezos_1.burnTokenTezos)(chain, token, destinationAddress, instance, setProgress);
                break;
            case chain_1.Chain.Ethereum:
                burnPromise = (0, ethereum_1.burnTokenEthereum)(chain, token, destinationAddress, instance, setProgress);
                break;
        }
        return burnPromise.then(function () { return setProgress(progress_1.Progress.Burned); });
    };
    /**
     * Withdraws a token on a specific chain (sends back the initial token before the lock)
     * @param chain The initial chain of the token
     * @param message An unsigned message sent by the nodes
     * @param signatures signatures returned by the nodes proving the message
     * @param progressCallback optional callback to track the progress
     * @returns an empty promise
     */
    HashiBridge.prototype.withdrawToken = function (chain, message, signatures, progressCallback) {
        if (message.status !== proof_1.Status.Burned) {
            return Promise.reject("Cannot withdraw with status other than burned");
        }
        var setProgress = (0, utils_1.setProgressCallback)(progressCallback);
        setProgress(progress_1.Progress.Withdrawing);
        var instance = this.chainsInstances.get(chain);
        if (typeof instance === "undefined") {
            return Promise.reject("Signer has not been defined for this chain.");
        }
        switch (chain) {
            case chain_1.Chain.Tezos:
                return (0, tezos_1.withdrawTokenTezos)(chain, message, signatures, instance, setProgress);
            case chain_1.Chain.Ethereum:
                return (0, ethereum_1.withdrawTokenEthereum)(chain, message, signatures, instance, setProgress);
        }
    };
    HashiBridge.prototype.getLockedTokenFromWrapped = function (wrapped) {
        var instance = this.chainsInstances.get(wrapped.chain);
        if (typeof instance === "undefined") {
            return Promise.reject("Signer has not been defined for this chain.");
        }
        switch (wrapped.chain) {
            case chain_1.Chain.Tezos:
                return (0, tezos_1.getLockedTokenFromWrappedTezos)(wrapped, instance);
            case chain_1.Chain.Ethereum:
                return (0, ethereum_1.getLockedTokenFromWrappedEthereum)(wrapped, instance);
        }
    };
    return HashiBridge;
}());
exports.HashiBridge = HashiBridge;
//# sourceMappingURL=hashi.js.map