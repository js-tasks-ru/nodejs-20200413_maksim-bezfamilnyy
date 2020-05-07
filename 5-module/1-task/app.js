const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let promise;
let message = 'default message';
const promiseResolvers = [];

router.post('/publish', async (ctx, next) => {
  message = ctx.request.body.message;
  ctx.status = 200;
  if (message !== undefined) {
    for (const pro of promiseResolvers) {
      pro(message);
    }
  }
});

router.get('/subscribe', async (ctx, next) => {
  promise = new Promise((resolve, reject) => {
    promiseResolvers.push(resolve);
  });
  await promise;
  ctx.body = message;
});

app.use(router.routes());

module.exports = app;
