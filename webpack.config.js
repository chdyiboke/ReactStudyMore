const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
	entry : __dirname + "/src/index.js", //已多次提及的唯一入口文件
	output : {
		path : __dirname + "/dist", //打包后的文件存放的地方
		filename : "bundle.js"//打包后输出文件的文件名
	},
	devtool : 'eval-source-map',
	devServer : {
		contentBase : "./public", //本地服务器所加载的页面所在的目录
		historyApiFallback : true, //不跳转
		inline : true//实时刷新
	},
	plugins : [new HtmlWebpackPlugin({
		filename : 'index.html',
		template : 'src/index.html'
	}), new cleanWebpackPlugin(['dist/assets'])],
	module : {
		rules : [{
			test : /(\.jsx|\.js)$/,
			use : {
				loader : "babel-loader"
			},
			exclude : /node_modules/
		}, 
		{
			test: /\.css$/,
			use: [
				'style-loader',
				{
					loader: 'css-loader',
					options: {
						module: true,
						localIdentName: '[path]-[name]-[local]-[hash:base64:6]'
					}
				}
			],
			exclude: [
				path.resolve(__dirname, 'node_modules'),
				path.resolve(__dirname, 'src/assets')
			]
		},{
			test: /\.css$/,
			use: ['style-loader','css-loader'],
			include: [
				path.resolve(__dirname, 'node_modules'),
				path.resolve(__dirname, 'src/assets')
			]
		},
		{
			test: /\.(png|jpg|gif|jpeg)$/,
			use: [
				{
					loader: 'url-loader',
					options: {
						limit: 10000,
						name: 'assets/img/[name]_[hash:8].[ext]'
					} 
				}
			]
		},
		{
			test: /\.(eot|svg|ttf|woff)$/,
			use: [
				{
					loader: 'file-loader',
					options: {
						name: 'assets/fonts/[name]_[hash:8].[ext]'
					}
				}
			]
		},]
	}
}; 