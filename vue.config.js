// vue로 만들어둔 것을 세팅하는 작업
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

const serverConfig = {
	entry: './src/entry-server.js',
	target: 'node',
	devtool: 'source-map',
	output: {
		libraryTarget: 'commonjs2',
	},
	externals: nodeExternals({
		allowlist: /\.css$/,
	}),
	optimization: {
		splitChunks: false,
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.VUE_ENV': JSON.stringify(process.env.VUE_ENV || 'server'),
		}),
		new VueSSRServerPlugin(),
	],
};

const cilentConfig = {
	entry: './src/entry-client.js',
	optimization: {
		runtimeChunk: {
			name: 'manifest',
		},
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendor',
					chunks: 'all',
				},
			},
		},
	},
	plugins: [
    // webpack이란? https://webpack.js.org/ : 같은 것들끼리 자동으로 번들로 묶어서 한다.
		new webpack.DefinePlugin({
			'process.env.VUE_ENV': JSON.stringify(process.env.VUE_ENV || 'client'),
		}),
		new VueSSRClientPlugin(),
	],
};

module.exports = {
	configureWebpack: process.env.VUE_ENV === 'server' ? serverConfig : cilentConfig,
}