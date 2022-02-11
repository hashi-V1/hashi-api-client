export var Status;
(function (Status) {
    Status["Locked"] = "locked";
    Status["Burned"] = "Burned";
})(Status || (Status = {}));
export function isUnsignedMessageType(input) {
    const m = input;
    return (m.destination != null &&
        m.destination != "" &&
        m.metadata != null &&
        (m.status === Status.Locked || m.status === Status.Burned) &&
        m.timestamp != null &&
        !isNaN(m.timestamp) &&
        m.token_address != null &&
        m.token_address != "" &&
        m.token_id != null &&
        !isNaN(m.token_id));
}
export function isSignedMessageType(input) {
    const m = input;
    return isUnsignedMessageType(m) && m.signature != null && m.signature != "";
}
//# sourceMappingURL=proofs.js.map