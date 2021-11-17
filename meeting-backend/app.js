const Koa = require('koa');
const https = require('https');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');

const controller = require('./controller');
const app = new Koa();

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});
app.use(cors());
app.use(bodyParser());
app.use(controller());

app.listen(3001);

var options = {
    key: fs.readFileSync('../cert/key.pem'),
    cert: fs.readFileSync('../cert/cert.pem'),
};
console.log('app started at port 3001...');
https.createServer(options, app.callback()).listen(3002, () => {
    console.log(`server running success at 3002`)
});


require('./services/socket_init');