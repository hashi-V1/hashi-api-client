const nodes = ["http://localhost:3030/proof"];
import axios from "axios";
import { isSignedMessageType, } from "./types/proof";
export function proveTokenStatus(sourceChain, targetChain, token, status, progressCallback) {
    const signatures = [];
    const promises = [];
    let message;
    let done = 0;
    nodes.forEach((node) => {
        promises.push(axios
            .get(node, {
            params: Object.assign({ sourceChain,
                targetChain,
                status }, token),
        })
            .then((response) => {
            console.log(response.data);
            if (!isSignedMessageType(response.data)) {
                console.log("type error");
                return;
            }
            const m = response.data;
            signatures.push(m.signature);
            message = m;
        }));
    });
    return Promise.all(promises).then(() => ({
        done,
        total: nodes.length,
        signatures,
        message,
    }));
}
//# sourceMappingURL=proofs.js.map