"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.progressConstants = exports.isProgress = exports.Progress = void 0;
/**
 * Represents the current progress of a bridge or unbridge action.
 */
var Progress;
(function (Progress) {
    Progress[Progress["None"] = 0] = "None";
    Progress[Progress["ApprovingAndLocking"] = 1] = "ApprovingAndLocking";
    Progress[Progress["Burning"] = 2] = "Burning";
    Progress[Progress["WaitingForUserApproval"] = 3] = "WaitingForUserApproval";
    Progress[Progress["WaitingForUserLock"] = 4] = "WaitingForUserLock";
    Progress[Progress["WaitingForUserBurn"] = 5] = "WaitingForUserBurn";
    Progress[Progress["WaitingForConfirmationApproval"] = 6] = "WaitingForConfirmationApproval";
    Progress[Progress["WaitingForConfirmationLock"] = 7] = "WaitingForConfirmationLock";
    Progress[Progress["WaitingForConfirmationBurn"] = 8] = "WaitingForConfirmationBurn";
    Progress[Progress["ApprovedAndLocked"] = 9] = "ApprovedAndLocked";
    Progress[Progress["Burned"] = 10] = "Burned";
    Progress[Progress["ProvingStatus"] = 11] = "ProvingStatus";
    Progress[Progress["ProvedStatus"] = 12] = "ProvedStatus";
    Progress[Progress["Wrapping"] = 13] = "Wrapping";
    Progress[Progress["Withdrawing"] = 14] = "Withdrawing";
    Progress[Progress["WaitingForUserWrap"] = 15] = "WaitingForUserWrap";
    Progress[Progress["WaitingForUserWithdraw"] = 16] = "WaitingForUserWithdraw";
    Progress[Progress["WaitingForConfirmationWrap"] = 17] = "WaitingForConfirmationWrap";
    Progress[Progress["WaitingForConfirmationWithdraw"] = 18] = "WaitingForConfirmationWithdraw";
    Progress[Progress["Wrapped"] = 19] = "Wrapped";
    Progress[Progress["Withdrawed"] = 20] = "Withdrawed";
})(Progress = exports.Progress || (exports.Progress = {}));
/**
 * Checks whether the input is of the Progress enum type.
 * @param input Any Input
 * @returns a boolean and a type predicate
 */
function isProgress(input) {
    return Object.values(Progress).includes(input);
}
exports.isProgress = isProgress;
/**
 * Returns a message associated with a specific progress.
 */
exports.progressConstants = (_a = {},
    _a[Progress.None] = "",
    _a[Progress.ApprovingAndLocking] = "Approving and Locking",
    _a[Progress.Burning] = "Burning",
    _a[Progress.WaitingForUserApproval] = "Waiting for user to sign the approval transaction",
    _a[Progress.WaitingForUserLock] = "Waiting for user to sign the lock transaction",
    _a[Progress.WaitingForUserBurn] = "Waiting for user to sign the burn transaction",
    _a[Progress.WaitingForConfirmationApproval] = "Waiting for confirmation of the approval transaction",
    _a[Progress.WaitingForConfirmationLock] = "Waiting for confirmation of the lock transaction",
    _a[Progress.WaitingForConfirmationBurn] = "Waiting for confirmation of the burn transaction",
    _a[Progress.ApprovedAndLocked] = "Approved and Locked",
    _a[Progress.Burned] = "Burned",
    _a[Progress.ProvingStatus] = "Proving status",
    _a[Progress.ProvedStatus] = "Proved status",
    _a[Progress.Wrapping] = "Wrapping",
    _a[Progress.Withdrawing] = "Withdrawing",
    _a[Progress.WaitingForUserWrap] = "Waiting for user to sign the wrap transaction",
    _a[Progress.WaitingForUserWithdraw] = "Waiting for user to sign the wrap transaction",
    _a[Progress.WaitingForConfirmationWrap] = "Waiting for confirmation of the wrap transaction",
    _a[Progress.WaitingForConfirmationWithdraw] = "Waiting for confirmation of the withdraw transaction",
    _a[Progress.Wrapped] = "Wrapped",
    _a[Progress.Withdrawed] = "Withdrawed",
    _a);
//# sourceMappingURL=progress.js.map