const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminSVGO = require('imagemin-svgo');
const multiJsonLoader = require('multi-json-loader');
const smp = new SpeedMeasurePlugin();
const TerserPlugin = require('terser-webpack-plugin');
const PACKAGE = require('./package.json');
const assetPath = PACKAGE.assetPath;

const siteData = multiJsonLoader.loadFiles('./src/_data');

let runMod = "development";

if (process.argv.indexOf('--open') === -1) {
  console.log('Running production build......');
  runMod = 'production';
  process.env.NODE_ENV = 'production';
  console.log('Environment is on: ', process.env.NODE_ENV);
} else {
  console.log('Running development build......');
  runMod = 'development'
  process.env.NODE_ENV = 'development';
  console.log('Environment is on: ', process.env.NODE_ENV);
}

function loadJsonFiles(startPath, parentObj) {
  var files=fs.readdirSync(startPath);

  for(var i=0;i<files.length;i++){
    var filename=path.join(startPath,files[i]);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory()){
      parentObj[`${files[i]}`] = multiJsonLoader.loadFiles(filename);
      loadJsonFiles(filename, parentObj[`${files[i]}`]);
    }
  }
}

loadJsonFiles('./src/_data', siteData);

function findFilesInDir(startPath,filter){
  var results = [];
  if (!fs.existsSync(startPath)){
    console.log("no dir ",startPath);
    return;
  }

  var files=fs.readdirSync(startPath);
  for(var i=0;i<files.length;i++){
    var filename=path.join(startPath,files[i]);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory()){
      results = results.concat(findFilesInDir(filename,filter)); //recurse
    }
    else if ((filename.indexOf(filter)>=0) && (filename.indexOf('_modules') === -1) && (filename.indexOf('_layouts') === -1)) {
      var actualFilename = filename.replace('src/','');
      actualFilename = actualFilename.replace(/src\\/g, '');
      results.push(actualFilename);
    }
  }
  return results;
}

function generateHtmlPlugins (templateDir) {
  // Read files in template directory
  const templateFiles = findFilesInDir(templateDir,'.pug');
  return templateFiles.map(item => {
    // Split names and extension
    const parts = item.split('.')
    const name = parts[0]
    const extension = parts[1]
    // Create new HTMLWebpackPlugin with options
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      cache: true,
      minify: false,
      hash: false,
      inject: false,
      alwaysWriteToDisk: true,
      data: siteData,
      env: process.env.NODE_ENV,
    })
  })
}

function generateModRules(envMode) {
  const devModRules = [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            [ '@babel/preset-env', {
              useBuiltIns: 'usage',
              corejs: 3.17
            } ]
          ]
        }
      }
    },
    {
      test: /\.(sa|sc|c)ss$/,
      use: [
        MiniCssExtractPlugin.loader,
        // 'css-loader',
        { loader: 'css-loader', options: { url: false } },
        'postcss-loader',
        // 'fast-sass-loader',
        {
          loader: "fast-sass-loader",
          options: {
            data: '$path: ' + '"/assets/images/";'
          }
        }
      ],
    },
    {
      test: /\.pug$/,
      use: [{ 
        loader: 'pug-loader', 
        options: { 
          pretty: true, 
        }, 
      }],
    }
  ]

  const prodModRules = [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            [ '@babel/preset-env', {
              useBuiltIns: 'usage',
              corejs: 3.17
            } ]
          ]
        }
      }
    },
    {
      test: /\.(sa|sc|c)ss$/,
      use: [
        MiniCssExtractPlugin.loader,
        // 'css-loader',
        { loader: 'css-loader', options: { url: false } },
        'postcss-loader',
        // 'fast-sass-loader',
        {
          loader: "fast-sass-loader",
          options: {
            data: '$path: ' + '"/assets/images/";'
          }
        }
      ],
    },
    {
      test: /\.pug$/,
      use: [{ 
        loader: 'pug-loader', 
        options: { 
          pretty: true, 
        }, 
      }],
    }
  ]

  if (envMode === 'production') {
    return prodModRules;
  } else {
    return devModRules;
  }
}

function generatePlugins (envMode) {
  const devPlugins = [
    new webpack.HotModuleReplacementPlugin(),

    new BrowserSyncPlugin({
      files: ['styles/**/*.css', '**/*.html', '!/assets/**/*'],
      host: 'localhost',
      port: 3001,
      proxy: 'http://localhost:3000/'
    },
    {
      reload: true,
      injectCss: true
    })
  ]

  const prodPlugins = [
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif)$/i,
      plugins: [
        imageminMozjpeg({
          quality: 70,
          progressive: true
        }),
        imageminSVGO({
          removeViewBox: false
        })
      ]
    })
  ]

  if ( envMode === 'production') {
    return prodPlugins;
  } else {
    return devPlugins;
  }
}

const htmlPlugins = generateHtmlPlugins('./src');
const buildPlugins = generatePlugins(runMod);
const moduleRules = generateModRules(runMod);

module.exports = {
  entry: [ require.resolve('core-js/stable'), require.resolve('regenerator-runtime/runtime'), path.resolve(__dirname, 'index.js') ],
  mode: process.env.NODE_ENV,
  output: {
    filename: `${assetPath}/scripts/main.js`,
    path: path.resolve(__dirname, 'dist'),
    publicPath: "/"
  },
  target: ['web', 'es5'],
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from:'src/_images',to:`${assetPath}/images` },
        { from:'src/_scripts/vendor',to:`${assetPath}/scripts/vendor` },
        // { from:'src/_fonts',to:`${assetPath}/fonts` },
        { from:'**/*',globOptions:{ ignore:['{**/\_*,**/\_*/**}','**/*.pug'],},context:'src/' }
      ]
    }),

    new MiniCssExtractPlugin({
      filename: `${assetPath}/styles/main.css`
    }),

    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      $j: 'jquery'
    })
  ].concat(htmlPlugins, buildPlugins),
  module: {
    rules: moduleRules
  },
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.resolve(__dirname, './dist'),
      publicPath: '/',
      watch: true,
    },
    compress: true,
    port: 3000,
  },
  resolve: {
    modules: [
      'node_modules'
    ],
    alias: {

    },
    extensions: [ '.js', '.jsx', '.scss' ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        extractComments: true,
      }),
    ],
  },
}