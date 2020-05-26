const Message = require('../models/Message');

module.exports.messageList = async function messages(ctx, next) {
  const messages = await Message.find({}).limit(10);
  const out = [];
  await messages.map((message) => {
    out.push({
      date: message.date,
      text: message.text,
      id: message._id,
      user: message.user,
    });
  });
  ctx.body = {messages: [out[0]]};
  return next();
};
