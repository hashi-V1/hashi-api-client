import axios from "axios";
import { nodesConfig } from "./config";
import { Chain } from "./types/chain";
import { Progress } from "./types/progress";
import {
    isSignedMessageType,
    ProofRequestType,
    Signature,
    SignedMessageType,
    Status,
    UnsignedMessageType,
} from "./types/proof";
import { LockedTokenType } from "./types/token";

/**
 * Time between retries to the same node (milliseconds)
 */
const RETRY_TIMEOUT = 1000;

async function proveWithNode(node: string, request: ProofRequestType) {
    const response = await axios.get(node, {
        params: request,
    });

    if (!isSignedMessageType(response.data))
        return Promise.reject(
            `Prover error (node ${node}): Wrong response type (not SignedMessageType)`
        );

    return response.data;
}

/**
 * Prove a token status with the federation
 * @param sourceChain The chain where the token went throught the status
 * @param targetChain The chain where the proof will be used
 * @param token The locked token (contract address, id and timestamp)
 * @param status The status that should be proved
 * @param setProgress callback to track the progress of the proof
 * @returns a promise with the message and signatures
 */
export async function proveTokenStatus(
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

    let message: UnsignedMessageType | undefined;

    const signatures = await Promise.all(
        nodesConfig.map(async (node) => {
            let response: SignedMessageType | undefined;

            while (!response) {
                try {
                    response = await proveWithNode(node, proofRequest);
                } catch (e) {
                    console.log(e);
                    await new Promise((resolve) =>
                        setTimeout(resolve, RETRY_TIMEOUT)
                    );
                }
            }

            if (!message) message = response;
            return response.signature;
        })
    );
    if (typeof message === "undefined")
        return Promise.reject("Undefined message");

    setProgress(Progress.ProvedStatus);
    return {
        signatures,
        message,
    };
}
