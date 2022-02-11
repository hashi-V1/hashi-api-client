import { Chain } from "./chain";
import { isLockedTokenType, LockedTokenType } from "./token";

/**
 * Represents the status of the signature whether it proves the token
 * has been locked or burned.
 */
export enum Status {
    Locked = "locked",
    Burned = "burned",
}

/**
 * Represents the request sent to each node to receive a signed message
 */
export type ProofRequestType = LockedTokenType & {
    sourceChain: Chain;
    targetChain: Chain;
    status: Status;
};

/**
 * Represents a signature by one of the nodes.
 */
export type Signature = string;

/**
 * Represents a message not yet signed by the nodes.
 */
export type UnsignedMessageType = LockedTokenType & {
    status: Status;
    destination: string;
    metadata: string;
};

/**
 * Represents a message signed by a node.
 */
export type SignedMessageType = UnsignedMessageType & {
    signature: Signature;
};

/**
 * Checks whether the input is of the UnsignedMessageType type.
 * @param input Any input
 * @returns a boolean and a type predicate.
 */
export function isUnsignedMessageType(
    input: any
): input is UnsignedMessageType {
    const m = input as UnsignedMessageType;
    return (
        isLockedTokenType(m) &&
        m.destination != null &&
        m.destination != "" &&
        m.metadata != null &&
        m.status in Status
    );
}

/**
 * Checks whether the input is of the SignedMessageType type.
 * @param input Any input
 * @returns a boolean and a type predicate.
 */
export function isSignedMessageType(input: any): input is SignedMessageType {
    const m = input as SignedMessageType;
    return isUnsignedMessageType(m) && m.signature != null && m.signature != "";
}
