# gulp-san-ssr
![Language](https://img.shields.io/badge/-TypeScript-blue.svg)
[![Build Status](https://travis-ci.org/searchfe/gulp-san-ssr.svg?branch=master)](https://travis-ci.org/searchfe/gulp-san-ssr)
[![npm package](https://img.shields.io/npm/v/gulp-san-ssr.svg)](https://www.npmjs.org/package/gulp-san-ssr)
[![npm downloads](http://img.shields.io/npm/dm/gulp-san-ssr.svg)](https://www.npmjs.org/package/gulp-san-ssr)

gulp-san-ssr [san-ssr][san-ssr] 的 gulp 封装。

## Get Started

编译到 PHP 时，`nsPrefix` 接受一个 Gulp File 对象，可以指定每个组件的 render 所在d的命名空间。
下面的例子用除去后缀的文件名来做前缀。

```javascript
const { src, dest, parallel } = require('gulp');
const { sanssr } = require('..');
const { extname, basename } = require('path');

gulp.task('build:php', function () {
    return src('*.ts')
        .pipe(sanssr({
            target: 'php',
            nsPrefix: file => {
                const ext = extname(file.path);
                const base = basename(file.path);
                const name = base.substr(0, base.length - ext.length);
                return name + '\\';
            }
        }))
        .pipe(dest('dist'));
})
```

编译到 JavaScript 的例子如下，可以在 demo/ 文件夹有一个可执行的用例。

```javascript
gulp.task('build:js', function () {
    return src('san.ts')
        .pipe(sanssr({ target: 'js' }))
        .pipe(dest('dist'));
})
```

[san-ssr]: https://github.com/searchfe/san-ssr
