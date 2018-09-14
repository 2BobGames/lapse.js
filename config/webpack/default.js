//libraries
const path = require('path')

//data
const package = require('../../package')

module.exports = {
	mode: 'production',
	entry: path.resolve('lib/index.js'),
	output: {
		path: path.resolve('dist'),
		filename: 'lapse.js'
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