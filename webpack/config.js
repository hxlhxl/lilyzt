const env = process.env.NODE_ENV;

let publicPath,staticPath;
if (env === 'development') {
    publicPath = '/debug';
    staticPath = '/debug';
} else {
    publicPath = '/public';
    staticPath = '/public';
}

config = {
    publicPath,staticPath
}

module.exports = config