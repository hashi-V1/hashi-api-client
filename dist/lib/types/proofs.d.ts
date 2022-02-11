export declare enum Status {
    Locked = "locked",
    Burned = "Burned"
}
export declare type Signature = string;
export declare type TokenKeyType = {
    timestamp: number;
    token_id: number;
    token_address: string;
};
export declare type UnsignedMessageType = TokenKeyType & {
    status: Status;
    destination: string;
    metadata: string;
};
export declare type SignedMessageType = UnsignedMessageType & {
    signature: Signature;
};
export declare function isUnsignedMessageType(input: any): input is UnsignedMessageType;
export declare function isSignedMessageType(input: any): input is SignedMessageType;
