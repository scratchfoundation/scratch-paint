/* eslint-disable import/no-commonjs */
module.exports = {
/* eslint-enable import/no-commonjs */
    root: true,
    extends: ['scratch', 'scratch/es6', 'scratch/react', 'plugin:import/recommended'],
    env: {
        browser: true
    },
    rules: {
        // BEGIN: these caused trouble after upgrading eslint-plugin-react from 7.20.3 to 7.33.2
        'react/forbid-prop-types': 'off',
        'react/no-unknown-property': 'off',
        // END: these caused trouble after upgrading eslint-plugin-react from 7.20.3 to 7.33.2
        'import/no-mutable-exports': 'error',
        'import/no-commonjs': 'error',
        'import/no-amd': 'error',
        'import/no-nodejs-modules': 'error'
    },
    settings: {
        react: {
            version: '16.2' // Prevent 16.3 lifecycle method errors
        }
    }
};
