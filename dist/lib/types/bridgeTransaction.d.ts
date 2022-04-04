import { Token } from "./token";
export declare type BridgeTransaction = {
    newToken: Token;
    hashes: string[];
};
export declare type TransactionReturn<T> = {
    hashes: string[];
    data: T;
};
