const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const port = 8080;
const host = Object.values(require('os').networkInterfaces()).reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i.family === 'IPv4' && !i.internal && i.address || []), [])), [])[0];
const type = 'http'
class HookPlugin {
    constructor(name, stage, handler) {
        this.name = name;
        this.handler = handler;
        this.stage = stage;
    }

    apply(compiler) {
        compiler.hooks[this.stage].tap(this.name, () => {
            this.handler()
        });
    }
}


module.exports = merge(common("development"), {
    watch: true,
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        hot: false,
        inline: false,
        progress: true,
        compress: false,
        host: '0.0.0.0',
        port: port,
        watchContentBase: false,
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    },
    plugins: [
        new HookPlugin('done', 'afterEmit', () => {
            setTimeout(() => {
                console.info(' App running at:')
                console.info(`- Local static:   \x1b[36m ${type === 'http' ? 'http://' : 'https://'}localhost:${port} \x1b[0m`)
                console.info(`- Local dynamic:  \x1b[36m ${type === 'http' ? 'http://' : 'https://'}localhost:${port}/webpack-dev-server/ \x1b[0m`)
                console.info(`- Network static: \x1b[36m ${type === 'http' ? 'http://' : 'https://'}${host}:${port} \x1b[0m`)
                console.info(`- Network dynamic:\x1b[36m ${type === 'http' ? 'http://' : 'https://'}${host}:${port}/webpack-dev-server/ \x1b[0m`)
            })

        }),
    ]
})