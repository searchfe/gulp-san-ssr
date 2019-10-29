const { src, dest, parallel } = require('gulp');
const { sanssr } = require('..');
const { extname, basename } = require('path');

function php () {
    return src('san.ts')
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
}

function js () {
    return src('san.ts')
        .pipe(sanssr({ target: 'js' }))
        .pipe(dest('dist'));
}

exports.js = js;
exports.php = php;
exports.default = parallel(php, js);
