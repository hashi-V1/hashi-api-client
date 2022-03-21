import { assert } from "chai";
import { Progress } from "../lib/types/progress";
import {
    hasOwnProperty,
    hexToString,
    setProgressCallback,
    stringToHex,
} from "../lib/utils";

describe("utils testing", () => {
    it("setProgressCallback", async () => {
        let progress = Progress.None;
        const callback = setProgressCallback((p) => {
            progress = p;
        });
        const callback2 = setProgressCallback();

        await callback(Progress.Wrapped);
        await callback2(Progress.Burned);

        assert.strictEqual(
            typeof callback,
            "function",
            "setProgressCallback does not return a function"
        );
        assert.strictEqual(
            typeof callback2,
            "function",
            "setProgressCallback does not return a function"
        );

        assert.strictEqual(
            progress,
            Progress.Wrapped,
            "setProgressCallback did not wrap properly the callback"
        );
    });

    it("stringToHex", () => {
        assert.strictEqual("68656c6c6f", stringToHex("hello"));
        assert.strictEqual(
            "",
            stringToHex(""),
            "Null ascii string should be null hex."
        );
    });

    it("hexToString", () => {
        assert.strictEqual("hello", hexToString("68656c6c6f"));
        assert.strictEqual(
            "",
            hexToString(""),
            "Null ascii hex should be null ascii."
        );
    });

    it("hasOwnProperty", () => {
        const o: object = {
            test: 1,
            str: "string",
        };

        assert.isTrue(hasOwnProperty(o, "test"));
        assert.isTrue(hasOwnProperty(o, "str"));
        assert.isFalse(hasOwnProperty(o, "notthere"));
    });
});
