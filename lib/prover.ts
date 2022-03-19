import axios from "axios";
import { nodesConfig } from "./config";
import { Chain } from "./types/chain";
import { Progress } from "./types/progress";
import {
    isSignedMessageType,
    ProofRequestType,
    Signature,
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
 * @param setProgress callback to track the progress of the proof
 * @returns a promise with the message and signatures
 */
export function proveTokenStatus(
    sourceChain: Chain,
    targetChain: Chain,
    token: LockedTokenType,
    status: Status,
    setProgress: (progress: Progress) => void
): Promise<{ signatures: Signature[]; message: UnsignedMessageType }> {
    setProgress(Progress.ProvingStatus);
    const proofRequest: ProofRequestType = {
        sourceChain,
        targetChain,
        status,
        ...token,
    };

    const signatures: Signature[] = [];
    const promises: Promise<void>[] = [];
    let message: UnsignedMessageType | undefined;

    nodesConfig.forEach((node) => {
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

        setProgress(Progress.ProvedStatus);

        return {
            signatures,
            message,
        };
    });
}
