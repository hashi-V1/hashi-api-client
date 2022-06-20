import { Chain, isChain } from "./chain";
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
 * Checks whether the input is of the Status enum type
 * @param input Any input
 * @returns a boolean and a type predicate
 */
export function isStatus(input: any): input is Status {
    return Object.values(Status).includes(input);
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
 * Checks whether the input is of the ProofRequestType
 * @param input Any input
 * @returns a boolean and a type predicate.
 */
export function isProofRequestType(input: any): input is ProofRequestType {
    const p = input as ProofRequestType;
    return (
        isLockedTokenType(p) &&
        isStatus(p.status) &&
        isChain(p.sourceChain) &&
        isChain(p.targetChain)
    );
}

/**
 * Represents a signature by one of the nodes.
 */
export type Signature = {
    sig: string;
    publicKey: string;
};

/**
 * Checks whether the input is of the Signature Type
 * @param input Any input
 * @returns a boolean and a type predicate
 */
export function isSignature(input: any): input is Signature {
    const s = input as Signature;
    return (
        s.publicKey != null &&
        s.publicKey !== "" &&
        s.sig != null &&
        s.sig !== ""
    );
}

/**
 * Represents a message not yet signed by the nodes.
 */
export type UnsignedMessageType = LockedTokenType & {
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
export function isUnsignedMessageType(
    input: any
): input is UnsignedMessageType {
    const m = input as UnsignedMessageType;
    return (
        isLockedTokenType(m) &&
        m.destinationAddress != null &&
        m.destinationAddress != "" &&
        !Number.isNaN(m.destinationChainId) &&
        m.metadata != null &&
        isStatus(m.status)
    );
}

/**
 * Represents a message signed by a node.
 */
export type SignedMessageType = UnsignedMessageType & {
    signature: Signature;
};

/**
 * Checks whether the input is of the SignedMessageType type.
 * @param input Any input
 * @returns a boolean and a type predicate.
 */
export function isSignedMessageType(input: any): input is SignedMessageType {
    const m = input as SignedMessageType;
    return isUnsignedMessageType(m) && isSignature(m.signature);
}
