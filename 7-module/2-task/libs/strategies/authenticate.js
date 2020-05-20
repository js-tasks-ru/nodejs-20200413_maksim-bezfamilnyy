const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (email === undefined) {
    return done(null, false, 'Не указан email');
  }

  let user = await User.findOne({email: email});

  if (!user) {
    user = new User({email: email, displayName: displayName});
    await user.save().catch((err) => {
      done(err, false, 'Неверный email');
    });
  }
  if (user) {
    return done(null, user);
  } else {
    return done(null, false, 'Не указан email');
  }
  return done(null, false, `функция аутентификации с помощью ${strategy} не настроена`);
};
