import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';
import react from 'react';
import reactDom from 'react-dom';
import _throttle from 'lodash.throttle'


const commonjsArgs = {
	include: 'node_modules/**',
  namedExports: {
    react: Object.keys(react),
		'react-dom': Object.keys(reactDom),
		'lodash.throttle': Object.keys(_throttle)
  }
};

export default [
	// browser-friendly UMD build
	{
		input: 'src/index.js',
		external: ['react', 'react-dom'],
		output: {
			name: 'useGetNowScrollDirection',
			file: pkg.browser,
			format: 'umd',
			globals: { react: 'React', 'react-dom': 'ReactDOM' },
		},
		plugins: [
			resolve(), // so Rollup can find dependencies in node_modulea
			commonjs(commonjsArgs) // so Rollup can convert dependencies in node_modulea to an ES module
		]
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify
	// `file` and `format` for each target)
	{
		input: 'src/index.js',
		external: ['react', 'react-dom'],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		]
	}
];
