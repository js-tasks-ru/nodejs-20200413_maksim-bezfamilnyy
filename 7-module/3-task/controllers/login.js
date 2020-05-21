const Session = require('../models/Session');
const passport = require('../libs/passport');

module.exports.login = async function login(ctx, next) {
  await passport.authenticate('local', async (err, user, info) => {
    if (err) throw err;
    if (!user) {
      ctx.status = 400;
      ctx.body = {error: info};
      return;
    }
    const token = await ctx.login(user);
    await Session.create({token: token, lastVisit: new Date(), user: user._id});

    ctx.body = {token};
  })(ctx, next);
};
