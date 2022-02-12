import { Chain } from "./types/chain";
import { Progress } from "./types/progress";
import { Signature, Status, UnsignedMessageType } from "./types/proof";
import { LockedTokenType } from "./types/token";
/**
 * Prove a token status with the federation
 * @param sourceChain The chain where the token went throught the status
 * @param targetChain The chain where the proof will be used
 * @param token The locked token (contract address, id and timestamp)
 * @param status The status that should be proved
 * @param setProgress callback to track the progress of the proof
 * @returns a promise with the message and signatures
 */
export declare function proveTokenStatus(sourceChain: Chain, targetChain: Chain, token: LockedTokenType, status: Status, setProgress: (progress: Progress) => void): Promise<{
    signatures: Signature[];
    message: UnsignedMessageType;
}>;
