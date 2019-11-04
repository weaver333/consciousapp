import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import obfuscator from 'rollup-plugin-javascript-obfuscator';
import scss from 'rollup-plugin-scss';
import json from 'rollup-plugin-json';

// import uglify from 'rollup-plugin-uglify-es';
// import livereload from 'rollup-plugin-livereload';
// import serve from 'rollup-plugin-serve';


// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

// OBFUSCATED CODE FOR PAGES
var config = [];
[
    'after-session',
    'welcome', 
    'sign-up',
    'sign-in',
    'session-stats',
    'stats', 
    'user',
    'plan',
    'billing',
    'login-confirm',
    'forgot-password',
    'breath-monitor',
    'heart-monitor',
    'session',
    'rewards'
].map(function(page) {
    config.push({
        input: `src/js/${page}/main.js`,
        output: {
            file: `public/assets/js/${page}.js`,
            format: 'iife', // immediately-invoked function expression — suitable for <script> tags
            // sourcemap: true,
            strict: false
        },
        plugins: [
            resolve({jsnext: true, preferBuiltins: true, browser: true}), // tells Rollup how to find date-fns in node_modules
            commonjs(), // converts date-fns to ES modules
            json(), // combine json for axios
            // production && uglify(), // uglify, but only in production
            production && obfuscator({compact: true }), // obfuscation, but only in production
            production && terser(), // minify, but only in production
            // livereload(),
            // serve('public')
        ]
    })
});

// NOT OBFUSCATED BECAUSE OF DEPENDENCIES THAT BREAK WHEN OBFUSCATED
[   
    'dashboard'
].map(function(page) {
    config.push({
        input: `src/js/${page}/main.js`,
        output: {
            file: `public/assets/js/${page}.js`,
            format: 'iife', // immediately-invoked function expression — suitable for <script> tags
            // sourcemap: true,
            strict: false
        },
        plugins: [
            resolve({jsnext: true, preferBuiltins: true, browser: true}), // tells Rollup how to find date-fns in node_modules
            commonjs(), // converts date-fns to ES modules
            json(),
            // production && uglify(), // uglify, but only in production
            production && terser(), // minify, but only in production
            // livereload(),
            // serve('public')
        ]
    })
});


config.push({
    input: 'src/scss/process-sass.js',
    output: {
        file: 'src/scss/output.js',
        format: 'esm'
    },
    plugins: [
        scss({
            output: 'public/assets/css/main.css',
            outputStyle: 'compressed'
        })
    ]
});

export default config;