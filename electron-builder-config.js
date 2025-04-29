/**
 * Configuration for electron-builder
 */
module.exports = {
    appId: 'org.owasp.threatdragon',
    productName: 'OWASP Threat Dragon',
    directories: {
        output: 'dist-desktop'
    },
    files: ['dist-desktop/**/*'],
    extraResources: ['node_modules/**/*'],
    asar: true,
    extraMetadata: {
        main: 'background.js'
    },
    mac: {
        category: 'public.app-category.developer-tools',
        icon: './src/icons/icon.icns',
        hardenedRuntime: true,
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
                arch: ['x64']
            }
        ],
        rfc3161TimeStampServer: 'http://timestamp.acs.microsoft.com',
        signingHashAlgorithms: ['sha256']
    },
    linux: {
        category: 'Development',
        executableName: 'threat-dragon',
        icon: './src/icons/td-256.png',
        synopsis: 'OWASP Threat Dragon',
        target: [
            {
                target: 'AppImage',
                arch: ['x64']
            },
            'deb',
            'rpm'
        ]
    },
    snap: {
        grade: 'stable',
        summary: 'OWASP Threat Dragon, desktop version',
        description:
            'OWASP Threat Dragon is a free, open-source, cross-platform threat modelling application',
        title: 'OWASP Threat Dragon'
    }
};
