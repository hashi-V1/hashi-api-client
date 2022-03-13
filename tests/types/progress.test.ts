import { assert } from "chai";
import {
    isProgress,
    Progress,
    progressConstants,
} from "../../lib/types/progress";

describe("progress testing", () => {
    it("isProgress should return true when input is Progress", () => {
        assert.isTrue(isProgress(Progress.None));
        assert.isTrue(isProgress(Progress.ApprovingAndLocking));
        assert.isTrue(isProgress(Progress.Burning));
        assert.isTrue(isProgress(Progress.WaitingForUserApproval));
        assert.isTrue(isProgress(Progress.Wrapping));
        assert.isTrue(isProgress(Progress.WaitingForConfirmationWrap));
        assert.isTrue(isProgress(Progress.Wrapped));
        assert.isTrue(isProgress(Progress.Withdrawed));
    });

    it("isProgress should return false when input is not Progress", () => {
        assert.isFalse(isProgress(-4));
        assert.isFalse(isProgress("Test"));
        assert.isFalse(isProgress({}));
        assert.isFalse(isProgress(null));
    });

    it("progressConstants should be properly filled", () => {
        for (const prog in Progress) {
            const progress = Number(prog);
            if (isNaN(progress)) continue;

            const contains = prog in progressConstants;
            assert.isTrue(
                contains,
                `progressConstants does not contain progress ${prog}`
            );

            if (contains && progress != Progress.None) {
                assert.isNotEmpty(
                    progressConstants[progress as Progress],
                    `Message should not be empty for progress ${progress}`
                );
            }
        }
    });
});
