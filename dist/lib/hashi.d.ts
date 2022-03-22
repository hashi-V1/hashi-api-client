import { Chain } from "./types/chain";
import { Progress } from "./types/progress";
import { Signature, Status, UnsignedMessageType } from "./types/proof";
import { LockedTokenType, Token, WrappedTokenType } from "./types/token";
/**
 * Main class of the Hashi Protocol bridge.
 */
export declare class HashiBridge {
    /**
     * Map containing instances for each chain.
     */
    private chainsInstances;
    /**
     * Constructor
     */
    constructor();
    /**
     * Saves the signer to use for a chain.
     * @param chain The signer's chain
     * @param signer The corresponding signer
     */
    setChainSigner(chain: Chain, signer: any): void;
    /**
     * Approves and locks at the same time a token.
     * @param token The token that will be locked
     * @param destinationAddress The address that will receive the token on the target chain
     * @param progressCallback optional callback to track the progress
     */
    approveAndLock(token: Token, destinationAddress: string, progressCallback?: (progress: Progress) => void): Promise<LockedTokenType>;
    /**
     * Wrap a token with signatures from the federation
     * @param chain The wrapping chain
     * @param message The message returned by the nodes
     * @param signatures An array of signatures
     * @param progressCallback optional callback to track the progress
     * @returns a promise with a Wrapped token
     */
    wrapToken(chain: Chain, message: UnsignedMessageType, signatures: Signature[], progressCallback?: (progress: Progress) => void): Promise<WrappedTokenType>;
    /**
     * Bridges (transfers) a token from one chain to another
     * @param targetChain The chain where the token should be after the bridge
     * @param token The token to tranfer
     * @param destinationAddress The address on the target chain that will receive the wrapped token
     * @param progressCallback optional callback to track the progress
     * @returns a promise with the wrapped token
     */
    bridge(targetChain: Chain, token: Token, destinationAddress: string, progressCallback?: (progress: Progress) => void): Promise<WrappedTokenType>;
    /**
     * Unbridges a wrapped token (releases the initial token)
     * @param targetChain The token's initial chain
     * @param token The token to tranfer
     * @param destinationAddress The address on the target chain that will receive the token
     * @param progressCallback optional callback to track the progress
     * @returns an empty promise
     */
    unbridge(targetChain: Chain, token: Token, destinationAddress: string, progressCallback?: (progress: Progress) => void): Promise<void>;
    /**
     * Collects proofs of a specific status from nodes.
     * @param sourceChain The chain where the status action took place (lock or burn)
     * @param targetChain The chain which will receive receive the signatures
     * @param token The token that went through the action
     * @param status The action we want to prove
     * @param progressCallback optional callback to track the progress
     * @returns a Promise with signatures and an UnsignedMessageType
     */
    proveTokenStatus(sourceChain: Chain, targetChain: Chain, token: LockedTokenType, status: Status, progressCallback?: (progress: Progress) => void): Promise<{
        signatures: Signature[];
        message: UnsignedMessageType;
    }>;
    /**
     * Burn a wrapped token to transfer it to another chain
     * @param token The wrapped token to burn
     * @param destinationAddress The address on the target chain that will receive the token
     * @param progressCallback optional callback to track the progress
     * @returns an empty promise
     */
    burnToken(chain: Chain, lockedToken: LockedTokenType, destinationAddress: string, progressCallback?: (progress: Progress) => void): Promise<void>;
    /**
     * Withdraws a token on a specific chain (sends back the initial token before the lock)
     * @param chain The initial chain of the token
     * @param message An unsigned message sent by the nodes
     * @param signatures signatures returned by the nodes proving the message
     * @param progressCallback optional callback to track the progress
     * @returns an empty promise
     */
    withdrawToken(chain: Chain, message: UnsignedMessageType, signatures: Signature[], progressCallback?: (progress: Progress) => void): Promise<void>;
    getLockedTokenFromWrapped(wrapped: Token): Promise<LockedTokenType>;
    getTokensForAccount(chain: Chain, address: string): Promise<Token[]>;
}
