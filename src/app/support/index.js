import { highlight, unHighlight, getInstanceRect, setDoc, isFixedNode, unFixedNode, setHighlightColor } from './highlighter';
import ActivityComponentCleanPlugin from '../../plugins/activity-component-clean-plugin';
import { stringify, classify, camelize } from './util';
import config from '../config';
const webpack = nodeRequire("webpack");
const WebpackDevServer = nodeRequire("webpack-dev-server");
const path = require('path');
const fs = require('fs');
const Datastore = require('nedb');
const babel = nodeRequire('babel-core');
const template = nodeRequire('babel-template');
const t = nodeRequire('babel-types');
let rootInstances = [];
let captureCount = 0;
let filter = '';
let instanceMap = new Map();
let consoleBoundInstances = Array(5);
let db = null;
let compiler = null;

function _initDB() {
  db = new Datastore({filename: config.DB_FILE});
  db.loadDatabase();
}

function _initServer(callback) {
	compiler = webpack({
	    context: path.join(process.cwd(), "/src"),
	    entry: {
        index: ["webpack/hot/dev-server", `webpack-dev-server/client?${config.INTERNAL_SERVER_HOST}`, "./app/activity/index"],
        vendor: ["vue"]
      },
	    output: {
	        path: config.ACTIVITY_BUILD_DIR,
	        filename: "bundle.js"
	    },
	    module: {
	      rules: [
	        {
	          test: /\.vue$/,
	          loader: 'vue-loader'
	        },{
            test: /node_modules\/vue/,
            loader: 'babel-loader',
            options: {
              compact: false,
              plugins: [
                  [{
                    visitor: {
                        BlockStatement(path) {
                            if(t.isFunctionDeclaration(path.parent) && path.parent.id.name == 'updateChildComponent') {
                                let buildExpression = 
                                    template(`vm._updateFromParent&&vm._updateFromParent(propsData, listeners, parentVnode, renderChildren)`);
                                let ast = buildExpression({});
                                path.unshiftContainer('body', ast);
                            }
                        }
                    }
                  }]
              ]
            }
          },
	        {
	          test: /\.js$/,
	          loader: 'babel-loader',
	          exclude: /node_modules/
	        },
	        {
	          test: /\.css$/,
	          loader: 'css-loader',
	          exclude: /node_modules/
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
          //new ActivityComponentCleanPlugin(),
          //new Vue2HackPlugin(),
          new webpack.optimize.CommonsChunkPlugin({name: "vendor", filename: "vendor.bundle.js"}),
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
	  	},
  		staticOptions: {
  		},
  		clientLogLevel: "info",
  		quiet: true,
  		noInfo: false,
  		lazy: false,
  		watchOptions: {
  		    aggregateTimeout: 100,
  		    poll: 100
  		},
  	  stats: { colors: false }
	});
	server.listen(config.INTERNAL_SERVER_PORT, "0.0.0.0", function() {
    callback();
  });
}

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
  <div class="app">
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
  `;
	comps.forEach(function(name) {
		appTpl += 
  `import ${name} from "business/${name}/index.vue";
  `;
	});
	appTpl += 
  `vue.use({
    install(vue) {
      vue.prototype.__STORE__ = ${_resolveResource(JSON.stringify(configStorage))}
    }
  });
  export default {
    data: function() {
      return {};
    }, 
    components: {
      ${comps.join(",")}
    }
  }
</script>`;
	fs.writeFileSync(appFile, appTpl);
}

function _getAllInstances(doc) {
	_clear();
	_scan(doc);
	setDoc(doc);
	return findQualifiedChildrenFromList(rootInstances);
}

function _highlight(instance, clickOverlayCallback) {
	var c = instanceMap.get(instance.id);
	if(c) {
		highlight(c, clickOverlayCallback);
	}
}

function _getInstanceRect(instance) {
	var c = instanceMap.get(instance.id);
	if(c) {
		return getInstanceRect(c);
	}
}

function _getInstance(instance) {
	return instanceMap.get(instance.id);
}

function _getDB() {
  return db;
}

function _getCompiler() {
  return compiler;
}

function _unHighlight() {
  unHighlight(); 
}

function _clear() {
	rootInstances = [];
	captureCount = 0;
	instanceMap = new Map();
}

/**
 * Iterate through an array of instances and flatten it into
 * an array of qualified instances. This is a depth-first
 * traversal - e.g. if an instance is not matched, we will
 * recursively go deeper until a qualified child is found.
 *
 * @param {Array} instances
 * @return {Array}
 */

function findQualifiedChildrenFromList (instances) {
  instances = instances
    .filter(child => !child._isBeingDestroyed)
  return !filter
    ? instances.map(capture)
    : Array.prototype.concat.apply([], instances.map(findQualifiedChildren))
}

function _scan (doc) {
  rootInstances.length = 0
  let inFragment = false
  let currentFragment = null
  walk(doc, function (node) {
    if (inFragment) {
      if (node === currentFragment._fragmentEnd) {
        inFragment = false
        currentFragment = null
      }
      return true
    }
    const instance = node.__vue__
    if (instance) {
      if (instance._isFragment) {
        inFragment = true
        currentFragment = instance
      }
      rootInstances.push(instance)
      return true
    }
  })
}

/**
 * Capture the meta information of an instance. (recursive)
 *
 * @param {Vue} instance
 * @return {Object}
 */

function capture (instance, _, list) {
  if (process.env.NODE_ENV !== 'production') {
    captureCount++
  }
  mark(instance)
  const ret = {
    id: instance._uid,
    name: getInstanceName(instance),
    el: instance.$el,
    inactive: !!instance._inactive,
    isFragment: !!instance._isFragment,
    children: instance.$children
      .filter(child => !child._isBeingDestroyed)
      .map(capture)
  }
  // record screen position to ensure correct ordering
  if ((!list || list.length > 1) && !instance._inactive) {
    const rect = getInstanceRect(instance)
    ret.top = rect ? rect.top : Infinity
//    ret.rect = rect;
  } else {
    ret.top = Infinity
  }
  // check if instance is available in console
  const consoleId = consoleBoundInstances.indexOf(instance._uid)
  ret.consoleId = consoleId > -1 ? '$vm' + consoleId : null
  // check router view
  const isRouterView2 = instance.$vnode && instance.$vnode.data.routerView
  if (instance._routerView || isRouterView2) {
    ret.isRouterView = true
    if (!instance._inactive) {
      const matched = instance.$route.matched
      const depth = isRouterView2
        ? instance.$vnode.data.routerViewDepth
        : instance._routerView.depth
      ret.matchedRouteSegment =
        matched &&
        matched[depth] &&
        (isRouterView2 ? matched[depth].path : matched[depth].handler.path)
    }
  }
  return ret
}

/**
 * Get the appropriate display name for an instance.
 *
 * @param {Vue} instance
 * @return {String}
 */

function getInstanceName (instance) {
  const name = instance.$options.name || instance.$options._componentTag
  return name
    ? classify(name)
    : instance.$root === instance
      ? 'Root'
      : 'Anonymous Component'
}

/**
 * Find qualified children from a single instance.
 * If the instance itself is qualified, just return itself.
 * This is ok because [].concat works in both cases.
 *
 * @param {Vue} instance
 * @return {Vue|Array}
 */

function findQualifiedChildren (instance) {
  return isQualified(instance)
    ? capture(instance)
    : findQualifiedChildrenFromList(instance.$children)
}

/**
 * DOM walk helper
 *
 * @param {NodeList} nodes
 * @param {Function} fn
 */

function walk (node, fn) {
  if (node.childNodes) {
    Array.prototype.forEach.call(node.childNodes, function (node) {
      const stop = fn(node)
      if (!stop) {
        walk(node, fn)
      }
    })
  }
}

function isQualified (instance) {
  const name = getInstanceName(instance).toLowerCase()
  return name.indexOf(filter) > -1
}

/**
 * Process the props of an instance.
 * Make sure return a plain object because window.postMessage()
 * will throw an Error if the passed object contains Functions.
 *
 * @param {Vue} instance
 * @return {Array}
 */

function processProps (instance) {
  let props
  if ((props = instance._props)) {
    // 1.x
    return Object.keys(props).map(key => {
      const prop = props[key]
      const options = prop.options
      return {
        type: 'prop',
        key: prop.path,
        value: instance[prop.path],
        meta: {
          'type': options.type ? getPropType(options.type) : 'any',
          required: !!options.required,
          'binding mode': propModes[prop.mode]
        }
      }
    })
  } else if ((props = instance.$options.props)) {
    // 2.0
    return Object.keys(props).map(key => {
      const prop = props[key]
      key = camelize(key)
      return {
        type: 'prop',
        key,
        value: instance[key],
        meta: {
          type: prop.type ? getPropType(prop.type) : 'any',
          required: !!prop.required
        }
      }
    })
  } else {
    return []
  }
}

/**
 * Get the detailed information of an inspected instance.
 *
 * @param {Number} id
 */

function getInstanceDetails (id) {
  const instance = instanceMap.get(id)
  if (!instance) {
    return {}
  } else {
    return {
      id: id,
      name: getInstanceName(instance),
      state: processProps(instance)
    }
  }
}

/**
 * Mark an instance as captured and store it in the instance map.
 *
 * @param {Vue} instance
 */

function mark (instance) {
  if (!instanceMap.has(instance._uid)) {
    instanceMap.set(instance._uid, instance)
    instance.$on('hook:beforeDestroy', function () {
      instanceMap.delete(instance._uid)
    })
  }
}

/**
 * Binds given instance in console as $vm0.
 * For compatibility reasons it also binds it as $vm.
 *
 * @param {Vue} instance
 */

function bindToConsole (instance) {
  const id = instance._uid
  const index = consoleBoundInstances.indexOf(id)
  if (index > -1) {
    consoleBoundInstances.splice(index, 1)
  } else {
    consoleBoundInstances.pop()
  }
  consoleBoundInstances.unshift(id)
  for (var i = 0; i < 5; i++) {
    window['$vm' + i] = instanceMap.get(consoleBoundInstances[i])
  }
  window.$vm = instance
}


exports.initDB = _initDB;
exports.initServer = _initServer;
exports.flushFile = _flushFile;
exports.getAllInstances = _getAllInstances;
exports.highlight = _highlight;
exports.unHighlight = _unHighlight;
exports.getInstanceRect = _getInstanceRect;
exports.getInstance = _getInstance;
exports.getInstanceDetails = getInstanceDetails;
exports.isFixedNode = isFixedNode;
exports.getDB = _getDB;
exports.getCompiler = _getCompiler;
exports.clear = _clear;
exports.setHighlightColor = setHighlightColor;
exports.unFixedNode = unFixedNode;