const nodes = [
    "http://51.158.67.166:3030",
    "http://51.158.116.23:3030",
    "http://51.158.67.166:3030",
    "http://51.158.116.23:3030",
];
import axios from "axios";
import {
    isSignedMessageType,
    TokenKeyType,
    UnsignedMessageType,
} from "./types";

export function proofOfLock(
    token: TokenKeyType,
    sourceChain: string,
    targetChain: string,
    progressCallback: (done: number, total: number) => void
) {
    const signatures: string[] = [];
    const promises: Promise<void>[] = [];
    let message: UnsignedMessageType | undefined;

    let done = 0;
    nodes.forEach((node) => {
        console.log(
            `${node}/${sourceChain}/${targetChain}/locker/${token.token_address}/${token.token_id}/${token.timestamp}`
        );
        promises.push(
            axios
                .get(
                    `${node}/${sourceChain}/${targetChain}/locker/${token.token_address}/${token.token_id}/${token.timestamp}`
                )
                .then((response) => {
                    console.log(response.data);
                    if (!isSignedMessageType(response.data)) {
                        console.log("type error");
                        return;
                    }
                    const m = response.data;
                    progressCallback(++done, nodes.length);

                    signatures.push(m.signature);
                    message = m;
                })
        );
    });

    return Promise.all(promises).then(() => ({
        done,
        total: nodes.length,
        signatures,
        message,
    }));
}
