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
 * Represents the request sent to each node to receive a signed message
 */
export declare type ProofRequestType = LockedTokenType & {
    sourceChain: Chain;
    targetChain: Chain;
    status: Status;
};
/**
 * Represents a signature by one of the nodes.
 */
export declare type Signature = string;
/**
 * Represents a message not yet signed by the nodes.
 */
export declare type UnsignedMessageType = LockedTokenType & {
    status: Status;
    destination: string;
    metadata: string;
};
/**
 * Represents a message signed by a node.
 */
export declare type SignedMessageType = UnsignedMessageType & {
    signature: Signature;
};
/**
 * Checks whether the input is of the ProofRequestType
 * @param input Any input
 * @returns a boolean and a type predicate.
 */
export declare function isProofRequestType(input: any): input is ProofRequestType;
/**
 * Checks whether the input is of the UnsignedMessageType type.
 * @param input Any input
 * @returns a boolean and a type predicate.
 */
export declare function isUnsignedMessageType(input: any): input is UnsignedMessageType;
/**
 * Checks whether the input is of the SignedMessageType type.
 * @param input Any input
 * @returns a boolean and a type predicate.
 */
export declare function isSignedMessageType(input: any): input is SignedMessageType;
