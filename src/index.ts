import { extname } from 'path';
import { ToJSCompiler, ToPHPCompiler } from 'san-ssr';
import PluginError = require('plugin-error');
import through2 = require('through2');

interface SSROptions {
    [key: string]: string;
}

const PLUGIN_NAME = 'gulp-san-ssr';

export function sanssr(options: SSROptions = {}) {
    return through2.obj(function(file, _, cb) {
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
            const targetCode = compile(file, options.target, options);
            file.contents = Buffer.from(targetCode);
            const path = file.path;
            const ext = extname(path);
            file.path = path.substr(0, path.length - ext.length) + '.' + options.target;
        }

        cb(null, file);
    });
}

function compile(file, target, ssrOptions) {
    const Compiler = target === 'php' ? ToPHPCompiler : ToJSCompiler;
    const compiler = new Compiler(ssrOptions);
    const targetCode = compiler.compile(file.path, ssrOptions);
    return targetCode;
}
