/**
 * Represents the current progress of a bridge or unbridge action.
 */
export declare enum Progress {
    None = 0,
    ApprovingAndLocking = 1,
    Burning = 2,
    WaitingForUserApproval = 3,
    WaitingForUserLock = 4,
    WaitingForUserBurn = 5,
    WaitingForConfirmationApproval = 6,
    WaitingForConfirmationLock = 7,
    WaitingForConfirmationBurn = 8,
    ApprovedAndLocked = 9,
    Burned = 10,
    ProvingStatus = 11,
    ProvedStatus = 12,
    Wrapping = 13,
    Withdrawing = 14,
    WaitingForUserWrap = 15,
    WaitingForUserWithdraw = 16,
    WaitingForConfirmationWrap = 17,
    WaitingForConfirmationWithdraw = 18,
    Wrapped = 19,
    Withdrawed = 20
}
/**
 * Checks whether the input is of the Progress enum type.
 * @param input Any Input
 * @returns a boolean and a type predicate
 */
export declare function isProgress(input: any): input is Progress;
/**
 * Returns a message associated with a specific progress.
 */
export declare const progressConstants: {
    [key in Progress]: string;
};
