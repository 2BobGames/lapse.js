//libraries
const merge = require('webpack-merge')
const path = require('path')

//webpack plugins
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

//data
const defaultConfig = require('./default.js')
const mode = 'production'

module.exports = merge(defaultConfig, {
	output: {
		path: path.resolve('dist'),
		filename: 'lapse.min.js'
	},
	optimization: {
		minimize: true,
		minimizer: [new UglifyJSPlugin({
			uglifyOptions: {
				output: {
					comments: false //use it for removing comments like "/*! ... */"
				}
			}
		})]
	}
})