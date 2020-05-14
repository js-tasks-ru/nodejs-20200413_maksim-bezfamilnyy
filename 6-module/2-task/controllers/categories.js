const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find({});
  let body = [];
  let subCats;
  for (const cat of categories) {
    subCats = [];
    for (const subCat of cat.subcategories) {
      subCats.push({
        id: subCat._id,
        title: subCat.title,
      });
    }
    body.push({
      id: cat._id,
      title: cat.title,
      subcategories: subCats,
    });
  }
  body = JSON.stringify({categories: body});
  ctx.body = body;
  next();
};
