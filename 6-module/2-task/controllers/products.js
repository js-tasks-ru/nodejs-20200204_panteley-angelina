const Product = require('../models/Product');
const mongoose = require('mongoose');

function getProduct(elem) {
  return {
    id: elem._id,
    category: elem.category,
    description: elem.description,
    images: elem.images,
    price: elem.price,
    subcategory: elem.subcategory,
    title: elem.title,
  }
}

function getProductList(products) {
  return products.map((elem) => getProduct(elem));
}

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  if(ctx.request.query.subcategory) {
    await Product.find({subcategory: ctx.request.query.subcategory}, function(err, products) {
      ctx.body = {products: getProductList(products)};
    })
  } else {
    await next();
  }
};

module.exports.productList = async function productList(ctx, next) {
  await Product.find({}, function(err, products) {
    ctx.body = {products: getProductList(products)};
  });
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.request.URL.pathname.split('/')[3];
  if(!mongoose.Types.ObjectId.isValid(id)) {
    ctx.response.status = 400;
  } else {
    await Product.find({_id: id}, function(err, products) {
      if(err || !products.length) {
        ctx.response.status = 404;
      } else {
        ctx.body = {product: getProduct(products[0])};
      }
    });
  }
};

