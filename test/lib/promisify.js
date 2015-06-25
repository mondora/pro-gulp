var BPromise = require("bluebird");
var events   = require("events");
var should   = require("should-promised");
var sinon    = require("sinon");

var promisify = require("lib/promisify.js");

describe("The `promisify` function", function () {

    it("should returned a function", function () {
        var ret = promisify();
        ret.should.be.of.type("function");
    });

});

describe("The function returned by `promisify`", function () {

    it("should invoke the function supplied to `promisify`, when called", function () {
        var spy = sinon.spy();
        var fn = promisify(spy);
        fn();
        spy.called.should.equal(true);
    });

    it("should return a promise", function () {
        var spy = sinon.spy();
        var fn = promisify(spy);
        var ret = fn();
        ret.should.be.a.Promise;
    });

});

describe("When the supplied function returns a stream, the promise returned by the wrapper", function () {

    it("should be fulfilled when the stream finishes", function () {
        var stream = new events.EventEmitter();
        stream.pipe = function noop () {};
        var fn = promisify(function () {
            return stream;
        });
        var ret = fn();
        stream.emit("finish");
        return ret.should.be.fulfilled;
    });

    it("should be fulfilled when the stream ends", function () {
        var stream = new events.EventEmitter();
        stream.pipe = function noop () {};
        var fn = promisify(function () {
            return stream;
        });
        var ret = fn();
        stream.emit("end");
        return ret.should.be.fulfilled;
    });

    it("should be rejected when the stream errors", function () {
        var stream = new events.EventEmitter();
        stream.pipe = function noop () {};
        var fn = promisify(function () {
            return stream;
        });
        var ret = fn();
        stream.emit("error");
        return ret.should.be.rejected;
    });

});

describe("When the supplied function returns a promise, the promise returned by the wrapper", function () {

    it("should be the same promise proxied through", function () {
        var promise = BPromise.resolve();
        var fn = promisify(function () {
            return promise;
        });
        var ret = fn();
        ret.should.equal(promise);
    });

});

describe("When the supplied function returns a value, the promise returned by the wrapper", function () {

    it("should be a promise wrapper around that value", function () {
        var value = {};
        var fn = promisify(function () {
            return value;
        });
        var ret = fn();
        return ret.should.eventually.equal(value);
    });

});


describe("When the supplied function throws, the wrapper", function () {

    it("should throw", function () {
        var error = new Error();
        var fn = promisify(function () {
            throw error;
        });
        fn.should.throw(error);
    });

});
