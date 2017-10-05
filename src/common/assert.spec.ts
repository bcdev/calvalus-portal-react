import * as assert from "./assert";
import {expect} from "chai";

describe('assert.ok', function () {

    function shouldSucceed(condition:any) {
        assert.ok(condition);
    }

    function shouldFail(condition:any) {
        try {
            assert.ok(condition);
        }
        catch (e) {
            expect(e).to.be.instanceof(Error);
            expect(e.message).to.equal('assertion failed');
        }
    }

    it('works', function () {
        shouldSucceed(true);
        shouldSucceed(2);
        shouldSucceed('x');
        shouldSucceed({});
        shouldSucceed([]);

        let x;
        //noinspection JSUnusedAssignment
        shouldFail(false);
        shouldFail(null);
        shouldFail(0);
        shouldFail(x);
        shouldFail('');
    });
});

