import { extname } from 'path';
import { SanProject } from 'san-ssr';
import PluginError = require('plugin-error');
import through2 = require('through2');

enum Target {
    php = 'php',
    js = 'js'
}

interface Options {
    tsConfigFilePath?: string;
    target: Target;
    nsPrefix?: (file: any) => string | string;
    fakeModules?: object;
    modules?: object;
}

const PLUGIN_NAME = 'gulp-san-ssr';

export function sanssr(options: Options = { target: Target.php }) {
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
            const nsPrefix = typeof options.nsPrefix === 'function'
                ? options.nsPrefix(file)
                : options.nsPrefix;
            const targetCode = compile(file, options.target, {
                nsPrefix,
                tsConfigFilePath: options.tsConfigFilePath,
                modules: options.modules
            });
            file.contents = Buffer.from(targetCode);
            const path = file.path;
            const ext = extname(path);
            file.path = path.substr(0, path.length - ext.length) + '.' + options.target;
        }

        cb(null, file);
    });
}

function compile(file, target, ssrOptions) {
    const project = new SanProject({
        tsConfigFilePath: ssrOptions.tsConfigFilePath,
        modules: ssrOptions.fakeModules
    });

    delete ssrOptions.fakeModules;

    const targetCode = project.compile(file.path, target, ssrOptions);
    return targetCode;
}
