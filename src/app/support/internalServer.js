import config from '../config';
import VueHackPlugin from '../../plugins/vue-hack-plugin';
const webpack = nodeRequire("webpack");
const WebpackDevServer = nodeRequire("webpack-dev-server");
const HtmlWebpackPlugin = nodeRequire('html-webpack-plugin');
const path = require('path');
const fs = require('fs');
const babel = nodeRequire('babel-core');
const template = nodeRequire('babel-template');
const t = nodeRequire('babel-types');
const express = nodeRequire('express');
let compiler = null;

function _resolveResource(source) {
  const buildRequire = template(`require(SOURCE)`);
  let result = babel.transform(`(${source})`, {
    plugins: [
      {
        visitor: {
          Literal(path) {
            if(/^assets\//.test(path.node.value) && !t.isCallExpression(path.parent)) {
              let ast = buildRequire({
                SOURCE: t.stringLiteral(path.node.value)
              });
              path.replaceWith(ast);
            }
          }
        }
      }
    ]
  });
  return result.code;
}

function _flushFile(data, configStorage) {
	let appFile = path.join(process.cwd(), 'src/app/activity/App.vue');
	let map = {};
	let comps = [];
	data.forEach(function(comp) {
		if(!map[comp.componentName]) {
			map[comp.componentName] = true;
			comps.push(comp.componentName);
		}
	});
let appTpl = 
`<template>
<div id="app" class="app" v-bind:style="{'background-color': appBgColor}">
`;
	data.forEach(function(comp) {
		  appTpl += 
    `<${comp.componentName}/>`;
	});
	appTpl += 
`
  </div>
</template>
`;
	appTpl += 
`<script>
  import vue from 'vue';
  import 'style/common.less';
  import 'quill/dist/quill.core.css';
  import Enum from 'common/enum';
  `;
	comps.forEach(function(name) {
		appTpl += 
  `import ${name} from 'business/${name}/index.vue';
  `;
	});
	appTpl += 
  `vue.use({
    install(vue) {
      vue.prototype.__STORE__ = ${_resolveResource(JSON.stringify(configStorage))}
    }
  });
  export default {
    name: 'App',
    $global: true,
    props: {
      psdWidth: {
        type: Number,
        default: 1080,
        $rule: {
          name: '设计图宽度'
        }
      },
      appBgColor: {
        type: String,
        default: '#fff',
        $rule: {
          name: 'app背景颜色',
          clazz: Enum.CLAZZ.COLOR
        }
      }
    },
    data: function() {
      return {}
    }, 
    components: {
      ${comps.join(",")}
    }
  }
</script>`;
	fs.writeFileSync(appFile, appTpl);
}

function _init(callback) {
    compiler = webpack({
	    context: path.join(process.cwd(), "/src"),
	    entry: {
            index: ["webpack/hot/dev-server", `webpack-dev-server/client?${config.INTERNAL_SERVER_HOST}`, "./app/activity/entry-client"],
            vendor: ["vue", "vuex"]
      },
	    output: {
	        path: config.ACTIVITY_BUILD_DIR,
	        filename: "bundle.js"
	    },
	    module: {
	      rules: [
          {
            test: /vue/,
            loader: 'babel-loader',
            options: {
              compact: false,
              plugins: [
                  [VueHackPlugin]
              ]
            }
          },
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
	          loader: ['style-loader', 'css-loader', 'less-loader']
	        },
	        {
	          test: /\.css$/,
	          loader: ['style-loader', 'css-loader']
	        },
	        {
	          test: /\.(png|jpg|gif|svg|jpeg)$/,
	          loader: 'file-loader',
	          options: {
	            name: '[name].[ext]'
	          }
	        }
	      ]
	    },
	    resolve: {
	    	modules: ['node_modules', 'app/components', 'app/activity']
	    },
	    plugins: [
          // new ActivityComponentCleanPlugin(),
          new webpack.DefinePlugin({
            'process.env': {NODE_ENV: '"dev"'}
          }),
          new HtmlWebpackPlugin({
              title: 'Flyme游戏中心活动',
              inject: 'body',
              template: path.join(config.ACTIVITY_BASE_DIR, 'index.html'),
              chunks: ['vendor', 'index'],
              minify: false,
              IS_DEV: true
          }),
          new webpack.optimize.CommonsChunkPlugin({name: "vendor", filename: "vendor.js"}),
	        new webpack.HotModuleReplacementPlugin()
	    ],
	    target: "web"
	});

	let server = new WebpackDevServer(compiler, {
	  	publicPath: "/",
  		contentBase: path.join(process.cwd(), "/src/app/activity"),
	   	hot: true,
	  	historyApiFallback: false,
	  	compress: false,
	  	setup: function(app) {
          app.use('/static', express.static('build'));
      },
  		clientLogLevel: "info",
  		quiet: true,
  		noInfo: false,
  		lazy: false,
      overlay: {
          warnings: false,
          errors: true
      },
  		watchOptions: {
  		    aggregateTimeout: 200,
          ignored: /node_modules/
  		},
  	    stats: { colors: false }
	});
	server.listen(config.INTERNAL_SERVER_PORT, "0.0.0.0", function() {
    callback();
  });
}

function _getCompiler() {
  return compiler;
}

exports.init = _init;
exports.flushFile = _flushFile;
exports.getCompiler = _getCompiler;