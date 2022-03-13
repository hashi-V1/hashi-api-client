"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var progress_1 = require("../../lib/types/progress");
describe("progress testing", function () {
    it("isProgress should return true when input is Progress", function () {
        chai_1.assert.isTrue((0, progress_1.isProgress)(progress_1.Progress.None));
        chai_1.assert.isTrue((0, progress_1.isProgress)(progress_1.Progress.ApprovingAndLocking));
        chai_1.assert.isTrue((0, progress_1.isProgress)(progress_1.Progress.Burning));
        chai_1.assert.isTrue((0, progress_1.isProgress)(progress_1.Progress.WaitingForUserApproval));
        chai_1.assert.isTrue((0, progress_1.isProgress)(progress_1.Progress.Wrapping));
        chai_1.assert.isTrue((0, progress_1.isProgress)(progress_1.Progress.WaitingForConfirmationWrap));
        chai_1.assert.isTrue((0, progress_1.isProgress)(progress_1.Progress.Wrapped));
        chai_1.assert.isTrue((0, progress_1.isProgress)(progress_1.Progress.Withdrawed));
    });
    it("isProgress should return false when input is not Progress", function () {
        chai_1.assert.isFalse((0, progress_1.isProgress)(-4));
        chai_1.assert.isFalse((0, progress_1.isProgress)("Test"));
        chai_1.assert.isFalse((0, progress_1.isProgress)({}));
        chai_1.assert.isFalse((0, progress_1.isProgress)(null));
    });
    it("progressConstants should be properly filled", function () {
        for (var prog in progress_1.Progress) {
            var progress = Number(prog);
            if (isNaN(progress))
                continue;
            var contains = prog in progress_1.progressConstants;
            chai_1.assert.isTrue(contains, "progressConstants does not contain progress ".concat(prog));
            if (contains && progress != progress_1.Progress.None) {
                chai_1.assert.isNotEmpty(progress_1.progressConstants[progress], "Message should not be empty for progress ".concat(progress));
            }
        }
    });
});
//# sourceMappingURL=progress.test.js.map