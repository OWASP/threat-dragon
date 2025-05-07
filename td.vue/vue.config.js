const path = require('path');
const fs = require('fs');

require('dotenv').config({ path: process.env.ENV_FILE || path.resolve(__dirname, '../.env') });
const serverApiProtocol = process.env.SERVER_API_PROTOCOL || 'http';
const serverApiPort = process.env.SERVER_API_PORT || process.env.PORT || '3000';
const appPort = process.env.APP_PORT || '8080';
const appHostname = process.env.APP_HOSTNAME || 'localhost';
const proxyHostname = process.env.PROXY_HOSTNAME || appHostname;

console.log('Server configured to listen on port: ' + serverApiPort);
console.log('Server configured to perform health checks using: ' + serverApiProtocol);

// Check if TLS credentials are available in the environment file
const hasTlsCredentials = process.env.APP_USE_TLS && process.env.APP_TLS_CERT_PATH && process.env.APP_TLS_KEY_PATH && process.env.APP_HOSTNAME;
let configuredAppPort;
// Configure dev server to use HTTPS with env.port if TLS credentials are available, otherwise use HTTP with port 8080
const devServerConfig = hasTlsCredentials
    ? {
        server: {
            type: 'https',
            options: {
                key: fs.readFileSync(process.env.APP_TLS_KEY_PATH),
                cert: fs.readFileSync(process.env.APP_TLS_CERT_PATH),
            }
        },
        port: appPort,
        proxy: {
            '^/api': {
                target: `http://localhost:${serverApiPort}`, // Backend server
                ws: true, // Proxy WebSocket connections
                changeOrigin: true,
            },
        },
        // by using the app hostname and the proxy hostname, we avoid most invalid header errors
        allowedHosts: [appHostname, proxyHostname],
    }
    : {
        // note that client webSocketURL config has been removed, as it was incompatible with desktop version
        port: appPort,
        proxy: {
            '^/api': {
                target: `http://localhost:${serverApiPort}`, // Backend server
                ws: true, // Proxy WebSocket connections
                changeOrigin: true,
            },
        },
        allowedHosts: [appHostname, proxyHostname],
    };

configuredAppPort = devServerConfig.port;
console.log(`Vue app is configured to run on ${hasTlsCredentials ? `https (Port ${configuredAppPort})` : `http (Port ${configuredAppPort})`}`);


module.exports = {
    publicPath: process.env.VUE_APP_IS_ELECTRON === 'true' ? './' : '/',
    // Configure webpack to handle CSS files
    css: {
        extract: process.env.NODE_ENV === 'production',
        sourceMap: process.env.NODE_ENV !== 'production'
    },
    productionSourceMap: false,
    devServer: devServerConfig,
    lintOnSave: false,
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'scss',
            patterns: [
                path.resolve(__dirname, 'src', 'styles', '*.scss')
            ]
        },
        // Skip electron builder setup for web-only builds
        ...(process.env.VUE_APP_WEB_ONLY === 'true' ? {} : {
            electronBuilder: {
                mainProcessFile: 'src/desktop/background.js',
                mainProcessWatch: ['src/desktop/logger.js', 'src/desktop/menu.js', 'src/desktop/utils.js'],
                rendererProcessFile: 'src/main.desktop.js',
                outputDir: 'dist-desktop',
                nodeIntegration: false,
                removeElectronJunk: false,
                disableMainProcessTypescript: true,
                preload: 'src/desktop/simple-preload.js',
                // Fix for "Could not find a package.json for module X" errors
                externals: ['electron', 'electron-log', 'electron-updater', 'fs-extra'],
                // Prevent dependency resolution errors
                nodeModulesPath: ['./node_modules', '../node_modules'],
                // Skip devDependencies - avoid package.json errors
                noDependencies: true,
                chainWebpackMainProcess: (config) => {
                    // Don't process node_modules with webpack
                    config.externals([
                        'electron',
                        'electron-devtools-installer',
                        'electron-updater',
                        'electron-log',
                        'fs',
                        'fs-extra',
                        'path',
                        'os',
                        'url'
                    ]);
                },
                builderOptions: {
                    // Configure DMG builder to use Python from PATH
                    beforeBuild: () => {
                        process.env.PYTHON_PATH = process.env.PYTHON_PATH || 'python';
                    },
                    appId: 'org.owasp.threatdragon',
                    productName: 'OWASP Threat Dragon',
                    directories: {
                        output: 'dist-desktop'
                    },
                    files: [
                        '**/*',
                        '!**/node_modules/.bin',
                        '!**/node_modules/.cache',
                        '!**/__tests__/**',
                        '!**/*.{iml,o,hprof,orig,pyc,pyo,rbc,swp,csproj,sln,xproj}',
                        '!.editorconfig',
                        '!**/._*',
                        '!**/{.DS_Store,.git,.hg,.svn,CVS,RCS,SCCS,__pycache__,thumbs.db,.gitignore,.gitattributes}',
                        '!**/*.{cmd,yml,yaml,md,markdown}'
                    ],
                    extraMetadata: {
                        main: 'background.js'
                    },
                    extraResources: [
                        'license.txt'
                    ],
                    publish: {
                        provider: 'github'
                    },
                    mac: {
                        category: 'public.app-category.developer-tools',
                        icon: './src/icons/icon.icns',
                        hardenedRuntime: true,
                        entitlements: './entitlements.mac.inherit.plist',
                        entitlementsInherit: './entitlements.mac.inherit.plist',
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
        })
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
            
        // Check if we're in web-only mode
        const isWebOnly = process.env.VUE_APP_WEB_ONLY === 'true';
        
        // For web-only builds, explicitly set the environment to non-electron
        if (isWebOnly) {
            // Set environment variables for web-only mode
            if (config.plugins.has('define')) {
                config.plugin('define').tap(args => {
                    const env = args[0]['process.env'] || {};
                    env.IS_ELECTRON = JSON.stringify(false);
                    env.VUE_APP_WEB_ONLY = JSON.stringify(true);
                    // Use GOOGLE_CLIENT_ID as fallback for VUE_APP_GOOGLE_CLIENT_ID
                    if (!process.env.VUE_APP_GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID) {
                        env.VUE_APP_GOOGLE_CLIENT_ID = JSON.stringify(process.env.GOOGLE_CLIENT_ID);
                    }
                    
                    // Escape operator contact email for i18n system
                    if (process.env.VUE_APP_OPERATOR_CONTACT) {
                        // Replace @ with escaped version for i18n
                        const escapedEmail = process.env.VUE_APP_OPERATOR_CONTACT.replace(/@/g, '\\@');
                        env.VUE_APP_OPERATOR_CONTACT_ESCAPED = JSON.stringify(escapedEmail);
                    }
                    
                    args[0]['process.env'] = env;
                    return args;
                });
            }
            
            // No need for electron-specific aliases in web mode
            console.log('Building in web-only mode - skipping electron configuration');
        }
        // Special handling for Electron builds
        else if (process.env.VUE_APP_IS_ELECTRON === 'true') {
            // Add plugin to define environment variables
            config.plugin('define').tap(args => {
                const env = args[0]['process.env'] || {};
                env.IS_ELECTRON = JSON.stringify(true);
                // Use GOOGLE_CLIENT_ID as fallback for VUE_APP_GOOGLE_CLIENT_ID
                if (!process.env.VUE_APP_GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID) {
                    env.VUE_APP_GOOGLE_CLIENT_ID = JSON.stringify(process.env.GOOGLE_CLIENT_ID);
                }
                
                // Escape operator contact email for i18n system in Electron too
                if (process.env.VUE_APP_OPERATOR_CONTACT) {
                    // Replace @ with escaped version for i18n
                    const escapedEmail = process.env.VUE_APP_OPERATOR_CONTACT.replace(/@/g, '\\@');
                    env.VUE_APP_OPERATOR_CONTACT_ESCAPED = JSON.stringify(escapedEmail);
                }
                
                args[0]['process.env'] = env;
                return args;
            });
            
            // Use mock implementations for web-only dependencies
            config.resolve.alias
                .set('vue3-google-signin', path.resolve(__dirname, 'src/plugins/desktop-auth.js'));
            // Add aliases for any other web-only dependencies that need to be mocked
        }
    },
    configureWebpack: {
        devtool: process.env.NODE_ENV === 'production' ? false : 'eval-cheap-module-source-map',
        plugins: [
            new (require('webpack')).DefinePlugin({
                __VUE_OPTIONS_API__: JSON.stringify(true),
                __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
                __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false)
            }),
            // Note: We no longer need to copy the CSS file here
            // The CSS is already in public/css and will be copied to the output directory automatically
        ],
        output: {
            hashFunction: 'xxhash64',
            filename: process.env.NODE_ENV === 'production' ? '[name].[contenthash].js' : '[name].js',
            chunkFilename: process.env.NODE_ENV === 'production' ? '[name].[contenthash].js' : '[name].js'
        },
        performance: {
            hints: process.env.NODE_ENV === 'production' ? 'warning' : false
        },
        // Enable Babel caching through Webpack configuration
        module: {
            rules: [
                {
                    test: /\.js$/,
                    include: path.resolve('src'),
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true,
                                cacheCompression: false
                            }
                        }
                    ]
                }
            ]
        },
        optimization: {
            runtimeChunk: 'single',
            moduleIds: 'deterministic',
            splitChunks: {
                chunks: 'all',
                minSize: 20000,
                maxSize: 244000, // Keep chunks under recommended size (244 KiB)
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name(module) {
                            // Get the package name
                            const packageName = module.context.match(/[\\/]node_modules[\\/]([^\\/\\@]+)/)?.[1] || 'vendors';
                            return `vendor.${packageName.replace('@', '')}`;
                        },
                        priority: -10,
                        chunks: 'all',
                        enforce: true
                    },
                    framework: {
                        test: /[\\/]node_modules[\\/](vue|vue-router|vuex|bootstrap)/,
                        name: 'framework',
                        priority: 20,
                        chunks: 'all',
                        enforce: true
                    },
                    common: {
                        name: 'common',
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true
                    }
                }
            }
        },
        // Cache module results between builds
        cache: {
            type: 'filesystem',
            buildDependencies: {
                config: [__filename]
            }
        },
        // Control build parallelism, but increase when using a faster machine
        parallelism: 4,
        resolve: {
            alias: {
                vue$: 'vue/dist/vue.runtime.esm-bundler.js',
                'vue': 'vue/dist/vue.runtime.esm-bundler.js'
            }
        }
    }
};