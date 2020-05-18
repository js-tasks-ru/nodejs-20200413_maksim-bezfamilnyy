const Product = require('../models/Product');
module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const query = ctx.request.query.query;
  const products = await Product.find({$text: {$search: query}});
  const productsOut = [];
  products.map((prod) => {
    productsOut.push({
      id: prod._id,
      title: prod.title,
      images: prod.images,
      category: prod.category,
      subcategory: prod.subcategory,
      price: prod.price,
      description: prod.description,
    });
  });
  ctx.body = {products: productsOut};
};
