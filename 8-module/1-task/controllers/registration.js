const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const token = await uuid();
  const {email, displayName, password} = ctx.request.body;
  const user = new User({
    email: email,
    displayName: displayName,
    verificationToken: token,
  });
  await user.setPassword(password);
  await user.save()
    .then(() => {
      sendMail({
        template: 'confirmation',
        locals: {token: token},
        to: email,
        subject: 'Подтвердите почту',
      });
      ctx.status = 200;
      ctx.body = JSON.stringify({'status': 'ok'});
      return next();
    })
    .catch((err) => {
      const errorsBody = {};
      Object.entries(err.errors).map(([key, value]) => {
        errorsBody[key] = value.message;
      });
      ctx.status = 400;
      ctx.body = JSON.stringify({'errors': errorsBody});
      return next();
    });
};

module.exports.confirm = async (ctx, next) => {
  const verificationToken = ctx.request.body.verificationToken;
  const user = await User.findOne({verificationToken: verificationToken});
  if (!user) {
    ctx.status = 400;
    ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
    return;
  }
  user.verificationToken = undefined;
  await user.save();
  const token = await ctx.login(user);

  ctx.body = {token};
  return next();
};
