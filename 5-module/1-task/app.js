const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
let subscribers = {};

router.get('/subscribe', async (ctx, next) => {
    ctx.body = await new Promise(function(resolve) { 
        subscribers[ctx.query.r] = resolve;
    });
    subscribers = {};
    next();
});

router.post('/publish', async (ctx, next) => {
    if(ctx.request.body.message) {
        for(let i in subscribers) {
            subscribers[i](ctx.request.body.message);
        }
    }
    ctx.body = 'ok';
    next();
});

app.use(router.routes());

module.exports = app;
