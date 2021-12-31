const path = require('path');

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/public' : '/',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '^/api': {
                target: 'http://localhost:3000',
                ws: true,
                changeOrigin: true
            }
        }
    },
    lintOnSave: false,
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'scss',
            patterns: [
                path.resolve(__dirname, 'src', 'styles', '*.scss')
            ]
        }
    },
    chainWebpack: config => {
        config.module
            .rule('vue')
            .use('vue-loader')
            .tap(options => {
                options.source = 'src';
                options.img = 'src';
                options.image = 'xlink:href';
                options['b-img'] = 'src';
                options['b-img-lazy'] = ['src', 'blank-src'];
                return options;
            });
    },
    configureWebpack: {
        devtool: 'source-map'
    }
};
