module.exports = {
    database: {
        dbName: 'test',
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'postgres'
    },
    serverConfig: {
        SSL_PORT: 8443,
        server_key: __dirname + '\\resources\\keys\\server_key.pem',
        server_crt: __dirname + '\\resources\\keys\\server_crt.pem'
    }
}