const path = require('path');
const { CycloneDxWebpackPlugin } = require('@cyclonedx/webpack-plugin');

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
            mainProcessFile: 'src/desktop/desktop.js',
            mainProcessWatch: ['src/desktop/logger.js', 'src/desktop/menu.js'],
            rendererProcessFile: 'src/main.desktop.js',
            outputDir: 'dist-desktop',
            builderOptions: {
                appId: 'org.owasp.threatdragon',
                productName: 'Threat-Dragon-ng',
                directories: {
                    output: 'dist-desktop'
                },
                publish: {
                    provider: 'github'
                },
                mac: {
                    category: 'public.app-category.developer-tools',
                    icon: './src/icons/icon.icns',
                    hardenedRuntime: true,
                    entitlements: './node_modules/electron-builder-notarize/entitlements.mac.inherit.plist',
                    entitlementsInherit: './node_modules/electron-builder-notarize/entitlements.mac.inherit.plist',
                    target: [
                        {
                            target: 'default',
                            arch: ['x64', 'arm64']
                        }
                    ]
                },
                win: {
                    icon: './src/icons/icon.ico',
                    target: [
                        {
                            target: 'nsis',
                            arch: ['arm64', 'x64']
                        }
                    ],
                    rfc3161TimeStampServer: 'http://timestamp.acs.microsoft.com',
                    signingHashAlgorithms: ['sha256'],
                    publisherName: [
                        'Open Source Developer, Antony Jonathan Gadsden'
                    ]
                },
                linux: {
                    category: 'Development',
                    executableName: 'threat-dragon',
                    icon: './src/icons/td-256.png',
                    synopsis: 'OWASP Threat Dragon',
                    target: [
                        {
                            target: 'AppImage',
                            arch: ['arm64', 'x64']
                        },
                        {
                            target: 'snap',
                            arch: ['arm64', 'x64']
                        },
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
        devtool: 'source-map',
        plugins: [
            new CycloneDxWebpackPlugin(
                {
                    outputLocation: '.sbom',
                    specVersion: '1.5'
                }
            )
        ],
        output: {
            hashFunction: 'xxhash64'
        }
    }
};
