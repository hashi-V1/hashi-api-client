import { Chain } from "./chain";
import { LockedTokenType } from "./token";
/**
 * Represents the status of the signature whether it proves the token
 * has been locked or burned.
 */
export declare enum Status {
    Locked = "locked",
    Burned = "burned"
}
/**
 * Checks whether the input is of the Status enum type
 * @param input Any input
 * @returns a boolean and a type predicate
 */
export declare function isStatus(input: any): input is Status;
/**
 * Represents the request sent to each node to receive a signed message
 */
export declare type ProofRequestType = LockedTokenType & {
    sourceChain: Chain;
    targetChain: Chain;
    status: Status;
};
/**
 * Checks whether the input is of the ProofRequestType
 * @param input Any input
 * @returns a boolean and a type predicate.
 */
export declare function isProofRequestType(input: any): input is ProofRequestType;
/**
 * Represents a signature by one of the nodes.
 */
export declare type Signature = {
    sig: string;
    publicKey: string;
};
/**
 * Checks whether the input is of the Signature Type
 * @param input Any input
 * @returns a boolean and a type predicate
 */
export declare function isSignature(input: any): input is Signature;
/**
 * Represents a message not yet signed by the nodes.
 */
export declare type UnsignedMessageType = LockedTokenType & {
    status: Status;
    destinationAddress: string;
    destinationChainId: number;
    metadata: string;
};
/**
 * Checks whether the input is of the UnsignedMessageType type.
 * @param input Any input
 * @returns a boolean and a type predicate.
 */
export declare function isUnsignedMessageType(input: any): input is UnsignedMessageType;
/**
 * Represents a message signed by a node.
 */
export declare type SignedMessageType = UnsignedMessageType & {
    signature: Signature;
};
/**
 * Checks whether the input is of the SignedMessageType type.
 * @param input Any input
 * @returns a boolean and a type predicate.
 */
export declare function isSignedMessageType(input: any): input is SignedMessageType;
