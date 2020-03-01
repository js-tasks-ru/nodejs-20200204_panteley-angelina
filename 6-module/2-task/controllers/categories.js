const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  await Category.find({}, function(err, categories) {
    const response = categories.map((elem) => {
      return {
        id: elem._id,
        title: elem.title,
        subcategories: elem.subcategories.map((sub) => {
          return {
            id: sub._id,
            title: sub.title
          }
        })
      }
    });
    ctx.body = {categories: response};
  });
};
