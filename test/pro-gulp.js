var BPromise = require("bluebird");
var should   = require("should-promised");
var sinon    = require("sinon");
var rewire   = require("rewire");

var proGulp = rewire("pro-gulp.js");

describe("The `task` method", function () {

    beforeEach(function () {
        proGulp.__set__("tasks", {});
    });

    it("should behave _like_ a getter when called with only one argument", function () {
        var tasks = {
            name: function () {}
        };
        proGulp.__set__("tasks", tasks);
        proGulp.task("name").should.equal(tasks.name);
    });

    it("should behave _like_ a setter when called with more than one argument", function () {
        proGulp.task("name", function () {});
        proGulp.task("name").should.be.of.type("function");
    });

});

describe("The function returned by the `task` method", function () {

    it("should return a promise", function () {
        proGulp.task("name", function () {});
        proGulp.task("name")().should.be.a.Promise;
    });

    it("should call the function(s) passed as second (and third) argument [1 function]", function () {
        var spy_0 = sinon.spy();
        proGulp.task("name", spy_0);
        return proGulp.task("name")().then(function () {
            spy_0.called.should.equal(true);
        });
    });

    it("should call the function(s) passed as second (and third) argument [2 functions]", function () {
        var spy_0 = sinon.spy();
        var spy_1 = sinon.spy();
        proGulp.task("name", spy_0, spy_1);
        return proGulp.task("name")().then(function () {
            spy_0.called.should.equal(true);
            spy_1.called.should.equal(true);
        });
    });

});

describe("The `parallel` method", function () {

    it("should return a function", function () {
        var ret = proGulp.parallel();
        ret.should.be.of.type("function");
    });

});

describe("The function returned by the `parallel` method", function () {

    it("should return a promise", function () {
        var ret = proGulp.parallel([]);
        ret().should.be.a.Promise;
    });

    it("should execute tasks in parallel (order does not matter)", function () {
        var spy = sinon.spy();
        proGulp.task("task_0", spy);
        proGulp.task("task_1", spy);
        var ret = proGulp.parallel(["task_0", "task_1"]);
        return ret().then(function () {
            spy.calledTwice.should.equal(true);
        });
    });

});

describe("The `sequence` method", function () {

    it("should return a function", function () {
        var ret = proGulp.sequence();
        ret.should.be.of.type("function");
    });

});

describe("The function returned by the `sequence` method", function () {

    it("should return a promise", function () {
        var ret = proGulp.sequence([]);
        ret().should.be.a.Promise;
    });

    it("should execute tasks in sequence (order does matter)", function () {
        var spies = [];
        var getTime = function () {
            var timestamp = process.hrtime();
            return timestamp[0] * 1e9 + timestamp[1];
        };
        var createSpy = function (n) {
            spies[n] = {};
            spies[n].fn = sinon.spy(function () {
                spies[n].start = getTime();
                return BPromise.delay(100).then(function () {
                    spies[n].end = getTime();
                });
            });
        };
        createSpy(0);
        createSpy(1);
        createSpy(2);
        createSpy(3);
        proGulp.task("task_0", spies[0].fn);
        proGulp.task("task_1", spies[1].fn);
        proGulp.task("task_2", spies[2].fn);
        proGulp.task("task_3", spies[3].fn);
        var ret = proGulp.sequence([
            "task_0",
            "task_1",
            "task_2",
            "task_3"
        ]);
        return ret().then(function () {
            // Check they have been called
            spies[0].fn.called.should.equal(true);
            spies[1].fn.called.should.equal(true);
            spies[2].fn.called.should.equal(true);
            spies[3].fn.called.should.equal(true);
            // Check they have been called in the right order
            (spies[0].start < spies[0].end).should.equal(true);
            (spies[0].end < spies[1].start).should.equal(true);
            (spies[1].start < spies[1].end).should.equal(true);
            (spies[1].end < spies[2].start).should.equal(true);
            (spies[2].start < spies[2].end).should.equal(true);
            (spies[2].end < spies[3].start).should.equal(true);
            (spies[3].start < spies[3].end).should.equal(true);
        });
    });

});
