const User = require('../../models/User');
const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    function(email, password, done) {
      User.findOne({ email: email }, async function (err, user) {
        if (!user) {
          return done(null, false, 'Нет такого пользователя');
        }
        const isPasswordValid = await user.checkPassword(password);
        if (!isPasswordValid) {
          return done(null, false, 'Неверный пароль');
        }
        return done(null, user);
      });
    }
);
