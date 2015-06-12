var util   = require("gulp-util");
var should = require("should-promised");
var sinon  = require("sinon");

var log = require("lib/log.js");

describe("The `log.start` function", function () {

    beforeEach(function () {
        sinon.stub(util, "log");
    });

    afterEach(function () {
        util.log.restore();
    });

    it("should attach a Date object to the property `start` of its context", function () {
        var ctx = {};
        log.start.call(ctx);
        ctx.start.should.be.instanceOf(Date);
    });

    it("should call the `gulp-util.log` function", function () {
        log.start.call({});
        util.log.calledWithMatch(/Starting/).should.equal(true);
    });

});

describe("The `log.end` function", function () {

    beforeEach(function () {
        sinon.stub(util, "log");
    });

    afterEach(function () {
        util.log.restore();
    });

    it("should attach a Date object to the property `end` of its context", function () {
        var ctx = {
            start: new Date()
        };
        log.end.call(ctx);
        ctx.end.should.be.instanceOf(Date);
    });

    it("should call the `gulp-util.log` function", function () {
        log.end.call({});
        util.log.calledWithMatch(/Finished/).should.equal(true);
    });


});
