import ActivityComponentCleanPlugin from '../../plugins/activity-component-clean-plugin';
import VueHackPlugin from '../../plugins/vue-hack-plugin';
import config from '../config';
const webpack = nodeRequire('webpack');
const path = nodeRequire('path');
const ExtractTextPlugin = nodeRequire('extract-text-webpack-plugin');
const HtmlWebpackPlugin = nodeRequire('html-webpack-plugin');
const nodeExternals = nodeRequire('webpack-node-externals');
const renderer = nodeRequire('vue-server-renderer').createRenderer();

nodeRequire('shelljs/global');

const ssrCompiler = webpack({
    context: config.ACTIVITY_BASE_DIR,
    entry: {
        index: ['./entry-ssr']
    },
    output: {
        path: config.ACTIVITY_BUILD_DIR,
        filename: "ssr.bundle.js",
        libraryTarget: "commonjs-module"
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }, 
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.less$/,
                loader: ['ignore-loader', 'less-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: ['ignore-loader']
            },
            {
                test: /\.(png|jpg|gif|svg|jpeg)$/,
                loader: 'file-loader',
                options: {
                    limit: 2048,
                    name: 'images/[name].[hash:8].[ext]'
                },
                exclude: /node_modules/
            }
        ]
    },
    resolveLoader: {
        modules: [config.NODE_MODULES]
    },
    resolve: {
        modules: [config.NODE_MODULES, config.COMPONENTS_DIR],
        alias: {
          components: config.COMPONENTS_DIR,
          assets: path.join(config.ACTIVITY_BASE_DIR, 'assets')
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {NODE_ENV: '"product"'}
        })
    ],
    externals: [nodeExternals({
        modulesDir: config.NODE_MODULES,
        whitelist: /\.css$/
    })],
    target: "node"
});

function _buildStandardCompiler(data) {   
    rm('-rf', config.ACTIVITY_BUILD_DIR);
    return webpack({
	    context: config.ACTIVITY_BASE_DIR,
	    entry: {
            index: ["./entry-client"],
            vendor: ["vue", "vuex", "vue-resource"]
        },
	    output: {
	        path: config.ACTIVITY_BUILD_DIR,
	        filename: "js/[name].[hash:8].js",
            chunkFilename:"js/[name].[chunkHash:8].js"
	    },
	    module: {
	      rules: [
            {
                test: /vue/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        compact: false,
                        plugins: [
                            [VueHackPlugin]
                        ],
                        cacheDirectory: path.join(config.ACTIVITY_BASE_DIR, 'cache')
                    }
                }]          
            },
	        {
	          test: /\.vue$/,
	          loader: 'vue-loader',
              options: {
                preserveWhitespace: false,
                postcss: [
                    nodeRequire('autoprefixer')({
                        browsers: ["Android >= 2.3", "iOS >= 4"]
                    })
                ],
                loaders: {
                    css: ExtractTextPlugin.extract({
                        use: 'css-loader',
                        fallback: 'vue-style-loader'
                    }),
                    less: ExtractTextPlugin.extract({
                        use: ['css-loader', 'less-loader'],
                        fallback: 'vue-style-loader'
                    })
                }
              }
	        }, 
	        {
	          test: /\.js$/,
	          use: [{
                    loader: 'babel-loader',
                    options: {
                        compact: false,
                        cacheDirectory: path.join(config.ACTIVITY_BASE_DIR, 'cache')
                    }
                }],
	          exclude: /node_modules/
	        },
            {
	          test: /\.less$/,
	          loader: ['style-loader', 'css-loader', 'less-loader'],
              exclude: /node_modules/
	        },
	        {
	          test: /\.css$/,
	          use: ['style-loader', 'css-loader'],
	        },
	        {
	          test: /\.(png|jpg|gif|svg|jpeg)$/,
	          loader: 'file-loader',
	          options: {
                limit: 2048,
	            name: 'images/[name].[hash:8].[ext]'
	          },
              exclude: /node_modules/
	        }
	      ]
	    },
        resolve: {
            modules: [config.NODE_MODULES, config.COMPONENTS_DIR],
            alias: {
            components: config.COMPONENTS_DIR,
            assets: path.join(config.ACTIVITY_BASE_DIR, 'assets')
            }
        },
        resolveLoader: {
            modules: [config.NODE_MODULES]
        },
	    plugins: [
            new webpack.DefinePlugin({
                'process.env': {NODE_ENV: '"product"'}
            }),
            new ActivityComponentCleanPlugin(),
            new HtmlWebpackPlugin({
                title: 'Flyme游戏中心活动',
                inject: 'body',
                template: path.join(config.ACTIVITY_BASE_DIR, 'index.html'),
                chunks: ['vendor', 'index'],
                minify: {
                    minifyCSS: true,
                    minifyJS: true,
                    collapseInlineTagWhitespace: true,
                    collapseWhitespace: true,
                    preserveLineBreaks: false
                },
                removeComments: true,
                IS_DEV: false,
                content: data.content
            }),
            new webpack.LoaderOptionsPlugin({minimize: true}),
            new webpack.optimize.UglifyJsPlugin(),
            new ExtractTextPlugin("css/[name].[chunkhash:8].css"),
            new webpack.optimize.CommonsChunkPlugin({names: ['vendor']})
	    ],
	    target: "web"
	});
}

function _render(callback) {
    ssrCompiler.run(function(err, stats) {
        if(err) throw err;
        nodeRequire('app-module-path').addPath(config.NODE_MODULES);
        delete nodeRequire.cache[nodeRequire.resolve(path.join(config.ACTIVITY_BUILD_DIR, 'ssr.bundle.js'))];
        let ssr = nodeRequire(nodeRequire.resolve(path.join(config.ACTIVITY_BUILD_DIR, 'ssr.bundle.js')));
        renderer.renderToString(ssr.createApp(), (err, html) => {
            if (err) throw err;
            let standardCompiler = _buildStandardCompiler({content: html});
            standardCompiler.run(function(err) {
                if(err) throw err;
                callback && callback();
            });
        });
    });
}


exports.render = _render;