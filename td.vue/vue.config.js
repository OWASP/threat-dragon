const path = require('path');

require('dotenv').config({ path: process.env.ENV_FILE || path.resolve(__dirname, '../.env') });
const serverApiProtocol = process.env.SERVER_API_PROTOCOL || 'http';
const serverApiPort = process.env.PORT || '3000';
console.log('Server API protocol: ' + serverApiProtocol + ' and port: ' + serverApiPort);

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/public' : '/',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '^/api': {
                target: serverApiProtocol + '://localhost:' + serverApiPort,
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
        },
        electronBuilder: {
            mainProcessFile: './src/desktop/desktop.js',
            builderOptions: {
                appId: 'org.owasp.threatdragon',
                productName: 'OWASP-Threat-Dragon',
                publish: {
                    provider: 'github'
                },
                afterSign: 'electron-builder-notarize',
                mac: {
                    category: 'public.app-category.developer-tools',
                    icon: './src/icons/icon.icns',
                    entitlements: './node_modules/electron-builder-notarize/entitlements.mac.inherit.plist',
                    hardenedRuntime: true,
                    target: [
                        'dmg',
                        'zip'
                    ]
                },
                win: {
                    icon: './src/icons/icon.ico',
                    target: [
                        {
                            target: 'nsis',
                            arch: [
                                'ia32',
                                'x64'
                            ]
                        }
                    ]
                },
                linux: {
                    category: 'Development',
                    executableName: 'threat-dragon',
                    icon: './src/icons/td-256.png',
                    synopsis: 'OWASP Threat Dragon',
                    target: [
                        'AppImage',
                        'snap',
                        'deb',
                        'rpm'
                    ]
                },
                snap: {
                    grade: 'stable',
                    summary: 'OWASP Threat Dragon, desktop version',
                    description: 'OWASP Threat Dragon is a free, open-source, cross-platform threat modelling application',
                    title: 'OWASP Threat Dragon'
                }
            }
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
