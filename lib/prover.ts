const nodes = ["http://localhost:3030/proof", "http://localhost:3030/proof"];
import axios from "axios";
import { Chain } from "./types/chain";
import {
    isSignedMessageType,
    ProofRequestType,
    Status,
    UnsignedMessageType,
} from "./types/proof";
import { LockedTokenType } from "./types/token";

/**
 * Prove a token status with the federation
 * @param sourceChain The chain where the token went throught the status
 * @param targetChain The chain where the proof will be used
 * @param token The locked token (contract address, id and timestamp)
 * @param status The status that should be proved
 * @param progressCallback A callback to get the progress of the proof
 * @returns a promise with the message and signatures
 */
export function proveTokenStatus(
    sourceChain: Chain,
    targetChain: Chain,
    token: LockedTokenType,
    status: Status,
    progressCallback?: (done: number, total: number) => void
) {
    const proofRequest: ProofRequestType = {
        sourceChain,
        targetChain,
        status,
        ...token,
    };

    const signatures: string[] = [];
    const promises: Promise<void>[] = [];
    let message: UnsignedMessageType | undefined;

    nodes.forEach((node) => {
        promises.push(
            axios
                .get(node, {
                    params: proofRequest,
                })
                .then((response) => {
                    const signedMessage = response.data;

                    if (!isSignedMessageType(signedMessage)) {
                        return Promise.reject(
                            "Wrong response type (not SignedMessageType)"
                        );
                    }

                    signatures.push(signedMessage.signature);
                    if (typeof message === "undefined") {
                        message = signedMessage;
                    }
                })
        );
    });

    return Promise.all(promises).then(() => {
        if (typeof message === "undefined") {
            return Promise.reject("Undefined message");
        }
        return {
            signatures,
            message,
        };
    });
}
