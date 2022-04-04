import { Token } from "./token";

export type BridgeTransaction = {
    newToken: Token;
    hashes: string[];
};

export type TransactionReturn<T> = {
    hashes: string[];
    data: T;
};
