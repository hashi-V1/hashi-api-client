import { Chain } from "./types/chain";
import { Status, TokenKeyType, UnsignedMessageType } from "./types/proof";
export declare function proveTokenStatus(sourceChain: Chain, targetChain: Chain, token: TokenKeyType, status: Status, progressCallback?: (done: number, total: number) => void): Promise<{
    done: number;
    total: number;
    signatures: string[];
    message: UnsignedMessageType | undefined;
}>;
