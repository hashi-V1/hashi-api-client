/**
 * Represents the current progress of a bridge or unbridge action.
 */
export enum Progress {
    None,

    ApprovingAndLocking,
    Burning,

    WaitingForUserApproval,
    WaitingForUserLock,
    WaitingForUserBurn,

    WaitingForConfirmationApproval,
    WaitingForConfirmationLock,
    WaitingForConfirmationBurn,

    ApprovedAndLocked,
    Burned,

    ProvingStatus,
    ProvedStatus,

    Wrapping,
    Withdrawing,

    WaitingForUserWrap,
    WaitingForUserWithdraw,

    WaitingForConfirmationWrap,
    WaitingForConfirmationWithdraw,

    Wrapped,
    Withdrawed,
}

/**
 * Checks whether the input is of the Progress enum type.
 * @param input Any Input
 * @returns a boolean and a type predicate
 */
export function isProgress(input: any): input is Progress {
    return Object.values(Progress).includes(input);
}

/**
 * Returns a message associated with a specific progress.
 */
export const progressConstants: { [key in Progress]: string } = {
    [Progress.None]: "",

    [Progress.ApprovingAndLocking]: "Approving and Locking",
    [Progress.Burning]: "Burning",

    [Progress.WaitingForUserApproval]:
        "Waiting for user to sign the approval transaction",
    [Progress.WaitingForUserLock]:
        "Waiting for user to sign the lock transaction",
    [Progress.WaitingForUserBurn]:
        "Waiting for user to sign the burn transaction",

    [Progress.WaitingForConfirmationApproval]:
        "Waiting for confirmation of the approval transaction",
    [Progress.WaitingForConfirmationLock]:
        "Waiting for confirmation of the lock transaction",
    [Progress.WaitingForConfirmationBurn]:
        "Waiting for confirmation of the burn transaction",

    [Progress.ApprovedAndLocked]: "Approved and Locked",
    [Progress.Burned]: "Burned",

    [Progress.ProvingStatus]: "Proving status",
    [Progress.ProvedStatus]: "Proved status",

    [Progress.Wrapping]: "Wrapping",
    [Progress.Withdrawing]: "Withdrawing",

    [Progress.WaitingForUserWrap]:
        "Waiting for user to sign the wrap transaction",
    [Progress.WaitingForUserWithdraw]:
        "Waiting for user to sign the wrap transaction",

    [Progress.WaitingForConfirmationWrap]:
        "Waiting for confirmation of the wrap transaction",
    [Progress.WaitingForConfirmationWithdraw]:
        "Waiting for confirmation of the withdraw transaction",

    [Progress.Wrapped]: "Wrapped",
    [Progress.Withdrawed]: "Withdrawed",
};
