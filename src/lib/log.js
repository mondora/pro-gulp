var util = require("gulp-util");

var execTimeString = function (delta) {
    return (delta / 1000).toString();
};

exports.start = function start () {
    this.start = new Date();
    util.log([
        "Starting '",
        util.colors.cyan(this.name),
        "'..."
    ].join(""));
};

exports.end = function end () {
    this.end = new Date();
    util.log([
        "Finished '",
        util.colors.cyan(this.name),
        "' after ",
        util.colors.magenta(execTimeString(this.end - this.start)),
        "s"
    ].join(""));
};

exports.error = function error (err) {
    util.log([
        "Terminated '",
        util.colors.cyan(this.name),
        "' with error: ",
        util.colors.red(err)
    ].join(""));
};
