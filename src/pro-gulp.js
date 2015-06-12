var BPromise = require("bluebird");

var log       = require("./lib/log.js");
var promisify = require("./lib/promisify.js");

var tasks = {};

exports.task = function task (name, dependency, fn) {
    if (arguments.length !== 1) {
        tasks[name] = function () {
            return BPromise
                .bind({name: name})
                .then(log.start)
                .then(promisify(dependency))
                .then(promisify(fn || function noop () {}))
                .then(log.end);
        };
    }
    return tasks[name];
};

exports.parallel = function parallel (taskList) {
    return function () {
        return BPromise.map(taskList, function (task) {
            return tasks[task]();
        });
    };
};

exports.sequence = function sequence (taskList) {
    return function () {
        return BPromise.reduce(taskList, function (acc, task) {
            return tasks[task]();
        }, BPromise.resolve());
    };
};
