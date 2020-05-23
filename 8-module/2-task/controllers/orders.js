const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  if (!ctx.user) {
    ctx.status = 401;
    return next();
  }
  const order = new Order(ctx.request.body);
  order.user = ctx.user;
  try {
    await order.save();
  } catch (err) {
    const errorsBody = {};
    Object.entries(err.errors).map(([key, value]) => {
      errorsBody[key] = value.message;
    });
    ctx.status = 400;
    ctx.body = {'errors': errorsBody};
    return next();
  }
  sendMail({
    template: 'order-confirmation',
    locals: {id: order._id, product: order.product},
    to: ctx.user.email,
    subject: 'Подтвердите почту',
  });
  ctx.body = {order: order._id};
  return next();
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  if (!ctx.user) {
    ctx.status = 401;
    return next();
  }
  const orders = await Order.find({user: ctx.user}).populate('product').exec();
  const out = [];
  orders.map((order) => {
    const newOne = order;
    newOne.id = order._id;
    out.push(newOne);
  });

  ctx.body = {orders: orders};
  return next();
};

