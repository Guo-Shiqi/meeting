const Koa = require('koa');

const bodyParser = require('koa-bodyparser');

const controller = require('./controller');
const cors = require('koa2-cors'); //跨域处理
const app = new Koa();

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

// 
app.use(cors());

// parse request body:
app.use(bodyParser());

// add controllers:
app.use(controller());

app.listen(3001);
console.log('app started at port 3001...');

require('./services/socket_init');