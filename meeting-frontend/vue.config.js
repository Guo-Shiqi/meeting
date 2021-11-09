const fs = require('fs');
module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'url',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        },
        // 此处开启 https
        // https: true,
        https: {
            key: fs.readFileSync('./cert/key.pem'),
            cert: fs.readFileSync('./cert/cert.pem'),
            // ca: fs.readFileSync('./cert/rootCA.pem'),
        },
    }
}