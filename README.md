[![Build Status](https://travis-ci.org/mondora/pro-gulp.svg?branch=master)](https://travis-ci.org/mondora/pro-gulp)
[![Coverage Status](https://img.shields.io/coveralls/mondora/pro-gulp.svg)](https://coveralls.io/r/mondora/pro-gulp?branch=master)
[![Dependency Status](https://david-dm.org/mondora/pro-gulp.svg)](https://david-dm.org/mondora/pro-gulp)
[![devDependency Status](https://david-dm.org/mondora/pro-gulp/dev-status.svg)](https://david-dm.org/mondora/pro-gulp#info=devDependencies)

# pro-gulp

Promise friendly helper for gulp

## Install

`npm i --save-dev pro-gulp`

## Example

```js
var gulp    = require("gulp");
var proGulp = require("pro-gulp");

proGulp.task("task_0", function () {
    return gulp.src("src/file_0")
        .pipe(gulp.dest("dst/"));
});

proGulp.task("task_1", function () {
    return gulp.src("src/file_1")
        .pipe(gulp.dest("dst/"));
});

/*
*   `proGulp.sequence` gives us the guarantee `task_0` only starts after
*   `task_1` has completed
*/
proGulp.task("tasks", proGulp.sequence(["task_0", "task_1"]), function () {
    // do stuff
});

/*
*   Register a gulp task
*/
gulp.task("tasks", proGulp.task("tasks"));
```

## Test

`npm test`
