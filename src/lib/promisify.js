var BPromise = require("bluebird");

var isStream = function (thing) {
    return !!(
        thing &&
        thing.pipe &&
        typeof thing.pipe === "function"
    );
};

var isPromise = function (thing) {
    return !!(
        thing &&
        thing.then &&
        typeof thing.then === "function"
    );
};

module.exports = function promisify (fn) {
    return function promisifyWrapper (/* arguments */) {
        var ret = fn();
        if (isPromise(ret)) {
            return ret;
        }
        if (isStream(ret)) {
            return new BPromise(function (resolve, reject) {
                ret
                    .on("end", resolve)
                    .on("finish", resolve)
                    .on("error", reject);
            });
        }
        return BPromise.resolve(ret);
    };
};
