export default {
    presets: [
        [
            '@babel/preset-env',
            {
                shippedProposals: true
            }
        ]
    ],
    plugins: [
        [
            '@babel/plugin-transform-runtime',
            {
                regenerator: true
            }
        ]
    ]
};
