const electron = require('electron');
const path = require('path');
const url = require('url');
const IS_PRODUCTION = process.env.NODE_ENV == 'production';
let mainWindow;

function createApp() {
  // Module to control application life.
  const app = electron.app
  // Module to create native browser window.
  const BrowserWindow = electron.BrowserWindow;

  const service = require('./src/service');
  service.register();

  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  

  function createWindow () {
    if(!mainWindow) {
      // Create the browser window.
      mainWindow = new BrowserWindow({
        width: 1280, 
        height: 800, 
        autoHideMenuBar: true,
        webPreferences: {
          webSecurity: false
        }
      });

      // mainWindow.webContents.on('did-finish-load', function() {
      //   initUI();
      // });

      // Open the DevTools.
      mainWindow.webContents.openDevTools();

      // Emitted when the window is closed.
      mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        service.unRegister(); //unRegister service
        mainWindow = null
      })
    }
    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
      pathname: path.join(process.cwd(), 'src/dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  app.setName('Activity Builder');

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  });

  app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      createWindow()
    }
  });

  if(app.isReady()) {
    createWindow();
  }
}

function compileResource() {
  const ExtractTextPlugin = require('extract-text-webpack-plugin');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const RELEEASE_PATH = path.join(process.cwd(), "/src/dist");
  const CONTEXT_PATH = path.join(process.cwd(), '/src/app/views');
  const webpack = require('webpack');
  const compiler = webpack({
      context: CONTEXT_PATH,
      entry: './index',
      output: {
          path: RELEEASE_PATH,
          filename: 'bundle.[hash:8].js'
          //publicPath: Path.join('/src/dist/')
      },
      module: {
        loaders: [
          {
            test: /\.vue$/,
            loader: 'vue'
          },
          {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('css')
          },
          {
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/
          },
          {
            test: /\.(png|jpg|gif|svg)$/,
            loader: 'file',
            query: {
              name: '[name].[ext]'
            }
          },
          {
            test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
            loader: 'file-loader',
            query: {
              name: '[name].[ext]'
            }
          }
        ]
      },
      resolveLoader: { 
        root: 'node_modules'
      },
      vue: {
        preserveWhitespace: false,
        loaders: {
          css: ExtractTextPlugin.extract('css'),
          less: ExtractTextPlugin.extract('css!less')
        } 
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {NODE_ENV: '"production"'}
        }),
        new HtmlWebpackPlugin({
          inject: 'body',
          template: path.join(process.cwd(), 'index.html')
        }),
        new ExtractTextPlugin("[name].[hash:8].css")
      ],
      target: 'atom'
  });
  require('shelljs/global');
  rm('-rf', RELEEASE_PATH);
  compiler.watch({
    aggregateTimeout: 300,
    poll: true
  }, function(err, stats) {
      if(!mainWindow) {
        createApp();
      } else {
        mainWindow.webContents.reload();
      }
      //mainWindow.webContents.executeJavaScript(fs.readFileSync(path.join(stats.compilation.compiler.outputPath, 'bundle.js'), "utf-8"));
      //mainWindow.webContents.executeJavaScript("(function(){var s = document.createElement('SCRIPT'); s.src = './src/app/dist/bundle.js'; document.body.appendChild(s)})()");
  });
}

if(IS_PRODUCTION) {
  createApp();
} else {
  compileResource();
}