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

exports.end = function start () {
    this.end = new Date();
    util.log([
        "Finished '",
        util.colors.cyan(this.name),
        "' after ",
        util.colors.magenta(execTimeString(this.end - this.start)),
        "s"
    ].join(""));
};
