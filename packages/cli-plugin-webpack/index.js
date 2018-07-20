'use strict';

const path = require('path');
const webpack = require('webpack');

module.exports = ({ api }) => {
  api.extend('webpack.config.development', async () => {
    process.env.NODE_ENV = 'development';

    const autoprefixer = require('autoprefixer');
    const paths = await api.read('paths');
    const env = await api.read('env');

    // Webpack uses `publicPath` to determine where the app is being served from.
    // It requires a trailing slash, or the file assets will get an incorrect path.
    const publicPath = '/';
    // Some apps do not use client-side routing with pushState.
    // For these, "homepage" can be set to "." to enable relative asset paths.
    const shouldUseRelativeAssetPaths = publicPath === './';
    // `publicUrl` is just like `publicPath`, but we will provide it to our app
    // as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
    // Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
    const publicUrl = '';

    // This is the development configuration.
    // It is focused on developer experience and fast rebuilds.
    // The production configuration is different and lives in a separate file.
    return {
      mode: 'development',
      devtool: 'cheap-module-source-map',
      entry: [
        // HMR for React
        require.resolve('react-hot-loader/patch'),

        // HMR client
        require.resolve('webpack-hot-middleware/client') + '?reload=true',

        // We ship a few polyfills by default:
        require.resolve('./polyfills'),

        // Errors should be considered fatal in development
        require.resolve('react-error-overlay'),

        // Finally, this is your app's code:
        paths.appIndexJs,

        // We include the app code last so that if there is a runtime error during
        // initialization, it doesn't blow up the WebpackDevServer client, and
        // changing JS code would still trigger a refresh.
      ],
      output: {
        // Next line is not used in dev but WebpackDevServer crashes without it:
        path: paths.appBuild,
        // Add [> filename <] comments to generated require()s in the output.
        pathinfo: true,
        // This does not produce a real file. It's just the virtual path that is
        // served by WebpackDevServer in development. This is the JS bundle
        // containing code from all our entry points, and the Webpack runtime.
        filename: 'static/js/bundle.js',
        // There are also additional JS chunk files if you use code splitting.
        chunkFilename: 'static/js/[name].chunk.js',
        // This is the URL that app is served from. We use "/" in development.
        publicPath,
        // Point sourcemap entries to original disk location (format as URL on Windows)
        devtoolModuleFilenameTemplate: info =>
          path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
      },
      resolve: {
        modules: ['node_modules', paths.appNodeModules, paths.appClient],
        extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
      },
      module: {
        strictExportPresence: true,
        rules: [
          // "oneOf" will traverse all following loaders until one will
          // match the requirements. When no loader matches it will fall
          // back to the "file" loader at the end of the loader list.
          {
            oneOf: [
              // "url" loader works like "file" loader except that it embeds assets
              // smaller than specified limit in bytes as data URLs to avoid requests.
              // A missing `test` is equivalent to a match.
              {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: require.resolve('url-loader'),
                options: {
                  limit: 10000,
                  name: 'static/media/[name].[hash:8].[ext]',
                },
              },
              // Process JS with Babel.
              {
                test: /\.(js|jsx|mjs)$/,
                include: paths.appSrc,
                use: [
                  // This loader parallelizes code compilation, it is optional but
                  // improves compile time on larger projects
                  require.resolve('thread-loader'),
                  {
                    loader: require.resolve('babel-loader'),
                    options: {
                      // This is a feature of `babel-loader` for webpack (not Babel itself).
                      // It enables caching results in ./node_modules/.cache/babel-loader/
                      // directory for faster rebuilds.
                      compact: true,
                      babelrc: false,
                      sourceMap: true,
                      presets: [
                        [
                          require.resolve('@babel/preset-env'),
                          {
                            modules: false,
                            targets: {
                              browsers: [
                                'last 1 version',
                                'ie >= 11',
                                'Firefox ESR',
                              ],
                            },
                            useBuiltIns: 'entry',
                          },
                        ],
                        [
                          require.resolve('@babel/preset-stage-2'),
                          {
                            decoratorsLegacy: true,
                          },
                        ],
                        require.resolve('@babel/preset-react'),
                      ],
                      plugins: [require.resolve('react-hot-loader/babel')],
                    },
                  },
                ],
              },

              // "postcss" loader applies autoprefixer to our CSS.
              // "css" loader resolves paths in CSS and adds assets as dependencies.
              // "style" loader turns CSS into JS modules that inject <style> tags.
              // In production, we use a plugin to extract that CSS to a file, but
              // in development "style" loader enables hot editing of CSS.
              {
                test: /\.s?css$/,
                use: [
                  require.resolve('style-loader'),
                  {
                    loader: require.resolve('css-loader'),
                    options: {
                      sourceMap: true,
                      importLoaders: 3,
                    },
                  },
                  {
                    loader: require.resolve('postcss-loader'),
                    options: {
                      // Necessary for external CSS imports to work
                      // https://github.com/facebookincubator/create-react-app/issues/2677
                      ident: 'postcss',
                      sourceMap: true,
                      plugins: () => [
                        require('postcss-flexbugs-fixes'),
                        autoprefixer({
                          browsers: [
                            '>1%',
                            'last 4 versions',
                            'Firefox ESR',
                            'not ie < 9', // React doesn't support IE8 anyway
                          ],
                          flexbox: 'no-2009',
                        }),
                      ],
                    },
                  },
                  {
                    loader: require.resolve('resolve-url-loader'),
                    options: {
                      sourceMap: true,
                    },
                  },
                  {
                    loader: require.resolve('sass-loader'),
                    options: {
                      sourceMap: true,
                      includePaths: [
                        path.resolve(__dirname, '../../node_modules'),
                        path.resolve(__dirname, '../../../../node_modules'),
                      ],
                    },
                  },
                ],
              },

              // "file" loader makes sure those assets get served by WebpackDevServer.
              // When you `import` an asset, you get its (virtual) filename.
              // In production, they would get copied to the `build` folder.
              // This loader doesn't use a "test" so it will catch all modules
              // that fall through the other loaders.
              {
                // Exclude `js` files to keep "css" loader working as it injects
                // its runtime that would otherwise be processed through "file" loader.
                // Also exclude `html` and `json` extensions so they get processed
                // by webpacks internal loaders.
                exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
                loader: require.resolve('file-loader'),
                options: {
                  name: 'static/media/[name].[hash:8].[ext]',
                },
              },
            ],
          },
        ],
      },
      plugins: [
        // Makes some environment variables available to the JS code, for example:
        // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
        new webpack.DefinePlugin(env.stringified),

        // This is necessary to emit hot updates (currently CSS only):
        new webpack.HotModuleReplacementPlugin(),

        // Moment.js is an extremely popular library that bundles large locale files
        // by default due to how Webpack interprets its code. This is a practical
        // solution that requires the user to opt into importing specific locales.
        // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
        // You can remove this if you don't use Moment.js:
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      ],
      // Some libraries import Node modules but don't use them in the browser.
      // Tell Webpack to provide empty mocks for them so importing them works.
      node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
      },
      // Turn off performance hints during development because we don't do any
      // splitting or minification in interest of speed. These warnings become
      // cumbersome.
      performance: {
        hints: false,
      },
    };
  });

  api.extend('webpack.config.production', async () => {
    process.env.NODE_ENV = 'production';

    const paths = await api.read('paths');
    const env = await api.read('env');

    const autoprefixer = require('autoprefixer');
    const path = require('path');
    const webpack = require('webpack');
    const ManifestPlugin = require('webpack-manifest-plugin');
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');
    const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

    // Webpack uses `publicPath` to determine where the app is being served from.
    // It requires a trailing slash, or the file assets will get an incorrect path.
    const publicPath = paths.servedPath;
    // Some apps do not use client-side routing with pushState.
    // For these, "homepage" can be set to "." to enable relative asset paths.
    const shouldUseRelativeAssetPaths = publicPath === './';
    // `publicUrl` is just like `publicPath`, but we will provide it to our app
    // as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
    // Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
    const publicUrl = publicPath.slice(0, -1);
    // Get environment variables to inject into our app.

    // Assert this just to be safe.
    // Development builds of React are slow and not intended for production.
    if (env.stringified['process.env'].NODE_ENV !== '"production"') {
      throw new Error('Production builds must have NODE_ENV=production.');
    }

    // This is the production configuration.
    // It compiles slowly and is focused on producing a fast and minimal bundle.
    // The development configuration is different and lives in a separate file.
    return {
      // Don't attempt to continue if there are any errors.
      bail: true,
      mode: 'production',
      // We generate sourcemaps in production. This is slow but gives good results.
      // You can exclude the *.map files from the build during deployment.
      devtool: 'source-map',
      // In production, we only want to load the polyfills and the app code.
      entry: [path.resolve(__dirname, './polyfills.js'), paths.appIndexJs],
      output: {
        // The build folder.
        path: paths.appBuild,
        // Generated JS file names (with nested folders).
        // There will be one main bundle, and one file per asynchronous chunk.
        // We don't currently advertise code splitting but Webpack supports it.
        filename: 'static/js/[name].[chunkhash:8].js',
        chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
        // We inferred the "public path" (such as / or /my-project) from homepage.
        publicPath,
        // Point sourcemap entries to original disk location (format as URL on Windows)
        devtoolModuleFilenameTemplate: info =>
          path
            .relative(paths.appSrc, info.absoluteResourcePath)
            .replace(/\\/g, '/'),
      },
      optimization: {
        runtimeChunk: 'single',
        splitChunks: {
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              chunks: 'all',
            },
          },
        },
        minimizer: [
          new UglifyJsPlugin({
            sourceMap: true,
            uglifyOptions: {
              compress: {
                warnings: false,
                // Disabled because of an issue with Uglify breaking seemingly valid code:
                // https://github.com/facebookincubator/create-react-app/issues/2376
                // Pending further investigation:
                // https://github.com/mishoo/UglifyJS2/issues/2011
                comparisons: false,
              },
              output: {
                comments: false,
                // Turned on because emoji and regex is not minified properly using default
                // https://github.com/facebookincubator/create-react-app/issues/2488
                ascii_only: true,
              },
            },
          }),
        ],
      },
      resolve: {
        // This allows you to set a fallback for where Webpack should look for modules.
        // We placed these paths second because we want `node_modules` to "win"
        // if there are any conflicts. This matches Node resolution mechanism.
        // https://github.com/facebookincubator/create-react-app/issues/253
        modules: ['node_modules', paths.appNodeModules, paths.appClient],
        extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx'],
      },
      module: {
        strictExportPresence: true,
        rules: [
          {
            // "oneOf" will traverse all following loaders until one will
            // match the requirements. When no loader matches it will fall
            // back to the "file" loader at the end of the loader list.
            oneOf: [
              // "url" loader works like "file" loader except that it embeds assets
              // smaller than specified limit in bytes as data URLs to avoid requests.
              {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: require.resolve('url-loader'),
                options: {
                  limit: 10000,
                  name: 'static/media/[name].[hash:8].[ext]',
                },
              },
              // Process JS with Babel.
              {
                test: /\.(js|jsx|mjs)$/,
                include: paths.appSrc,
                use: [
                  // This loader parallelizes code compilation, it is optional but
                  // improves compile time on larger projects
                  require.resolve('thread-loader'),
                  {
                    loader: require.resolve('babel-loader'),
                    options: {
                      // This is a feature of `babel-loader` for webpack (not Babel itself).
                      // It enables caching results in ./node_modules/.cache/babel-loader/
                      // directory for faster rebuilds.
                      compact: true,
                      babelrc: false,
                      sourceMap: true,
                      presets: [
                        [
                          require.resolve('@babel/preset-env'),
                          {
                            modules: false,
                            targets: {
                              browsers: [
                                'last 1 version',
                                'ie >= 11',
                                'Firefox ESR',
                              ],
                            },
                            useBuiltIns: 'entry',
                          },
                        ],
                        [
                          require.resolve('@babel/preset-stage-2'),
                          {
                            decoratorsLegacy: true,
                          },
                        ],
                        require.resolve('@babel/preset-react'),
                      ],
                      plugins: [require.resolve('react-hot-loader/babel')],
                    },
                  },
                ],
              },
              // The notation here is somewhat confusing.
              // "postcss" loader applies autoprefixer to our CSS.
              // "css" loader resolves paths in CSS and adds assets as dependencies.
              // "style" loader normally turns CSS into JS modules injecting <style>,
              // but unlike in development configuration, we do something different.
              // `ExtractTextPlugin` first applies the "postcss" and "css" loaders
              // (second argument), then grabs the result CSS and puts it into a
              // separate file in our build process. This way we actually ship
              // a single CSS file in production instead of JS code injecting <style>
              // tags. If you use code splitting, however, any async bundles will still
              // use the "style" loader inside the async code so CSS from them won't be
              // in the main CSS file.
              {
                test: /\.s?css$/,
                use: [
                  MiniCssExtractPlugin.loader,
                  {
                    loader: require.resolve('css-loader'),
                    options: {
                      importLoaders: 1,
                      minimize: true,
                      sourceMap: true,
                    },
                  },
                  {
                    loader: require.resolve('postcss-loader'),
                    options: {
                      // Necessary for external CSS imports to work
                      // https://github.com/facebookincubator/create-react-app/issues/2677
                      ident: 'postcss',
                      sourceMap: true,
                      plugins: () => [
                        require('postcss-flexbugs-fixes'),
                        autoprefixer({
                          browsers: [
                            '>1%',
                            'last 4 versions',
                            'Firefox ESR',
                            'not ie < 9', // React doesn't support IE8 anyway
                          ],
                          flexbox: 'no-2009',
                        }),
                      ],
                    },
                  },
                  {
                    loader: require.resolve('resolve-url-loader'),
                    options: {
                      sourceMap: true,
                    },
                  },
                  {
                    loader: require.resolve('sass-loader'),
                    options: {
                      sourceMap: true,
                      includePaths: [
                        // path.resolve(__dirname, '../../node_modules'),
                        // path.resolve(__dirname, '../../../../node_modules'),
                      ],
                    },
                  },
                ],
              },
              // "file" loader makes sure those assets get served by WebpackDevServer.
              // When you `import` an asset, you get its (virtual) filename.
              // In production, they would get copied to the `build` folder.
              // This loader doesn't use a "test" so it will catch all modules
              // that fall through the other loaders.
              {
                // Exclude `js` files to keep "css" loader working as it injects
                // its runtime that would otherwise be processed through "file" loader.
                // Also exclude `html` and `json` extensions so they get processed
                // by webpacks internal loaders.
                exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
                loader: require.resolve('file-loader'),
                options: {
                  name: 'static/media/[name].[hash:8].[ext]',
                },
              },
            ],
          },
          // ** STOP ** Are you adding a new loader?
          // Remember to add the new extension(s) to the "file" loader exclusion list.
        ],
      },
      plugins: [
        // Makes some environment variables available to the JS code, for example:
        // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
        // It is absolutely essential that NODE_ENV was set to production here.
        // Otherwise React will be compiled in the very slow development mode.
        new webpack.DefinePlugin(env.stringified),

        new MiniCssExtractPlugin({
          filename: 'static/css/[name].[contenthash:8].css',
          chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
        }),

        // Generate a manifest file which contains a mapping of all asset filenames
        // to their corresponding output file so that tools can pick it up without
        // having to parse `index.html`.
        new ManifestPlugin({
          fileName: 'asset-manifest.json',
        }),

        // Moment.js is an extremely popular library that bundles large locale files
        // by default due to how Webpack interprets its code. This is a practical
        // solution that requires the user to opt into importing specific locales.
        // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
        // You can remove this if you don't use Moment.js:
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      ],
      // Some libraries import Node modules but don't use them in the browser.
      // Tell Webpack to provide empty mocks for them so importing them works.
      node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
      },
      performance: {
        hints: false,
      },
    };
  });
};
