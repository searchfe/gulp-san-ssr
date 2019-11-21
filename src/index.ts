import { extname } from 'path';
import ToPHPCompiler from 'san-ssr-target-php';
import { SanProject } from 'san-ssr';
import PluginError = require('plugin-error');
import through2 = require('through2');

const PLUGIN_NAME = 'gulp-san-ssr';

export function sanssr(options) {
    const project = new SanProject(options);

    return function (target, options) {
        const outfileExtname = '.' + target;
        if (target === 'php') {
            target = ToPHPCompiler;
        }
        options = options || {};
        return through2.obj(function (file, _, cb) {
            const nsPrefix = typeof options.nsPrefix === 'function'
                ? options.nsPrefix(file)
                : options.nsPrefix;

            if (file.isNull()) {
                this.emit('error', new PluginError(PLUGIN_NAME, 'File: "' + file.relative + '" without content. You have to read it with gulp.src(..)'));
                return;
            }

            if (file.isStream()) {
                this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));
                cb();
                return;
            }

            if (file.isBuffer()) {
                const targetCode = project.compile(file.path, target, {
                    ...options, nsPrefix
                });

                file.contents = Buffer.from(targetCode);
                const path = file.path;
                const ext = extname(path);
                file.path = path.substr(0, path.length - ext.length) + outfileExtname;
            }

            cb(null, file);
        });
    };
}
