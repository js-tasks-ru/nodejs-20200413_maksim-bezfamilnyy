const Product = require('../models/Product');
const mongoose = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const subCatId = ctx.request.query.subcategory;
  if (subCatId === undefined) {
    ctx.params.products = await Product.find({});
  } else {
    ctx.params.products = await Product.find({subcategory: {_id: subCatId}});
  }
  next();
};

module.exports.productList = async function productList(ctx, next) {
  const prodOut = [];
  for (const prod of ctx.params.products) {
    prodOut.push({
      id: prod._id,
      title: prod.title,
      images: prod.images,
      category: prod.category,
      subcategory: prod.subcategory,
      price: prod.price,
      description: prod.description,
    });
  }
  ctx.body = JSON.stringify({products: prodOut});
};

module.exports.productById = async function productById(ctx, next) {
  const prodId = ctx.params.id;
  if (mongoose.Types.ObjectId.isValid(prodId) === false) {
    ctx.status=400;
    ctx.body = '';
    return;
  }
  const prod = await Product.findById(prodId);
  if (prod === null) {
    ctx.status=404;
    ctx.body = '';
    return;
  }
  const prodOut = {
    product: {
      id: prod._id,
      title: prod.title,
      images: prod.images,
      category: prod.category,
      subcategory: prod.subcategory,
      price: prod.price,
      description: prod.description,
    },
  };
  ctx.body = JSON.stringify(prodOut);
};

