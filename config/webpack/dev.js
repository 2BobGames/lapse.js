//libraries
const path = require('path')

//data
const package = require('../../package')

module.exports = {
	mode: 'development',
	entry: path.resolve('src/index.js'),
	output: {
		path: path.resolve('dist'),
		filename: 'lapse.js'
	},
	devServer: {
		contentBase: [path.resolve('examples')],
		port: 4000
	},
	devtool: 'inline-source-map',
	resolve: {
		modules: [path.resolve('src'), path.resolve('node_modules')],
		extensions: ['.js', '.json']
	},
	optimization: {
		minimize: false
	}
}