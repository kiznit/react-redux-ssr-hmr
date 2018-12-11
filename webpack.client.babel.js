/* eslint import/no-extraneous-dependencies: 1 */
import path from 'path';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import webpack from 'webpack';


const log = (...args) => {
    console.log('WEBPACK CLIENT CONFIG:', ...args);
};


export default (env, argv) => {
    const isDev = !argv || argv.mode !== 'production';

    log(isDev ? 'development' : 'production');

    return {
        name: 'client',

        target: 'web',

        devtool: isDev ? 'eval-source-map' : 'source-map',

        entry: {
            client: [
                './src/client.jsx',
            ],
        },

        output: {
            path: path.resolve(__dirname, 'dist/public/js'),
            filename: '[name].js',
        },

        resolve: {
            extensions: ['.js', '.jsx'],
            alias: {
                components: path.resolve('src/components/'),
                react: 'preact-compat',
                'react-dom': 'preact-compat',
            },
        },

        module: {
            // Make missing exports an error instead of warning
            strictExportPresence: true,

            // Process .js and .jsx files through babel
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react',
                        ],
                    },
                },
            ],
        },

        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': isDev ? '"development"' : '"production"',
                __BROWSER__: true,
                __DEV__: isDev,
                __TEST__: false,
            }),

            ...(isDev
                ? [
                ] : [
                    new BundleAnalyzerPlugin({
                        analyzerMode: 'static',
                        reportFilename: '../../bundle_client.html',
                        openAnalyzer: false,
                    }),
                ]
            ),
        ],

        optimization: {
            splitChunks: {
                cacheGroups: {
                    // Put node_modules code in its own bundle (but not css!)
                    vendors: {
                        name: 'vendors',
                        chunks: 'all',
                        test: /node_modules.+(?<!css)$/,
                    },
                },
            },
        },
    };
};
