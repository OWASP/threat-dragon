const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const distPath = path.join(__dirname, `..${path.sep}`, 'dist');


module.exports = {
    entry: {
        threatdragon: ['./src/app/app.js', './src/content/app.css' ],
        bootstrap: [ './src/content/bootstrap-custom.css', './src/content/bootstrap-theme.css', './src/content/logo-nav.css' ],
        ['config.exceptionHandler']: './src/app/config.exceptionHandler.js'
    },
    mode: 'production',
    output: {
        path: distPath,
        filename: path.join('app', '[name].min.js')
    },
    // Because of the way hotkeys is imported in owasp-threat-dragon-core, it was not resolving correctly at runtime
    // this alias ensures that it is loaded correctly when requested
    resolve: {
        alias: {
          'hotkeys-js': path.resolve(__dirname, 'node_modules/hotkeys-js/dist/hotkeys.min.js')
        }
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/fonts', to: 'fonts' },
                { from: 'src/views', to: 'views' },
                { from: 'node_modules/pug-bootstrap/components/navbar.pug', to: 'views' },
                { from: 'node_modules/pug-bootstrap/components/navs.pug', to: 'views' },
                { from: 'node_modules/pug-bootstrap/components/buttons.pug', to: 'views' },
                { from: 'node_modules/pug-bootstrap/components/icons.pug', to: 'views' },
                { from: 'src/favicon.ico' },
                { from: 'src/index.html' },
                { from: 'src/content/images', to: 'content/images' },
                { from: 'src/app/layout/*.html', to: 'app/layout/[name][ext]' },
                { from: 'src/app/threatmodels/*.html', to: 'app/threatmodels/[name][ext]' },
                { from: 'src/app/welcome/*.html', to: 'app/welcome/[name][ext]' },
                { from: 'node_modules/curriable/dist/curriable.js.map', to: 'app/[name][ext]' }
            ],
            options: {
                concurrency: 100
            }
        }),
        new MiniCssExtractPlugin({
            filename: 'content/[name].min.css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: { url: false }
                    }
                ],
            }
        ]
    },
    optimization: {
        minimizer: [
            new CssMinimizerPlugin()
        ]
    }
};
