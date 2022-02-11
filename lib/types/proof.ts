/**
 * Represents the status of the signature whether it proves the token
 * has been locked or burned.
 */
export enum Status {
    Locked = "locked",
    Burned = "burned",
}

/**
 * Represents a signature by one of the nodes.
 */
export type Signature = string;

/**
 * Represents a bridged token uniquely across all chains.
 */
export type TokenKeyType = {
    timestamp: number;
    token_id: number;
    token_address: string;
};

/**
 * Represents a message not yet signed by the nodes.
 */
export type UnsignedMessageType = TokenKeyType & {
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
        m.destination != null &&
        m.destination != "" &&
        m.metadata != null &&
        (m.status === Status.Locked || m.status === Status.Burned) &&
        m.timestamp != null &&
        !isNaN(m.timestamp) &&
        m.token_address != null &&
        m.token_address != "" &&
        m.token_id != null &&
        !isNaN(m.token_id)
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
