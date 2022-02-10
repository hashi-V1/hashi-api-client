export enum Status {
    Locked = "locked",
    Burned = "Burned",
}

export type Signature = string;

export type TokenKeyType = {
    timestamp: number;
    token_id: number;
    token_address: string;
};

export type UnsignedMessageType = TokenKeyType & {
    status: Status;
    destination: string;
    metadata: string;
};

export type SignedMessageType = UnsignedMessageType & {
    signature: Signature;
};

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

export function isSignedMessageType(input: any): input is SignedMessageType {
    const m = input as SignedMessageType;
    return isUnsignedMessageType(m) && m.signature != null && m.signature != "";
}
