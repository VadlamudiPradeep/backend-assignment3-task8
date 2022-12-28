const Product = require('../models/product');
const Cart = require('../models/cart');

const ITEMS_PER_PAGE = 1;

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      // res.render('shop/product-list', {
      //   prods: products,
      //   pageTitle: 'All Products',
      //   path: '/products'
      // });
      res.status(200).json({products})
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Product.findAll({ where: { id: prodId } })
  //   .then(products => {
  //     res.render('shop/product-detail', {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));
  Product.findByPk(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

// exports.getIndex = (req, res, next) => {
//   Product.findAll()
//     .then(products => {
//       res.render('shop/index', {
//         prods: products,
//         pageTitle: 'Shop',
//         path: '/'
//       });
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };
exports.getIndex = (req, res, next) => {
  console.log(req.params)
  var totalProducts;
  const page = +req.params.pageNo || 1;
  let totalItems;
  Product.findAll().then(response=>{
    totalProducts=response.length
  }).catch(err=>console.log(err))

  Product.findAll({offset: (page-1)*ITEMS_PER_PAGE, limit: ITEMS_PER_PAGE})
    .then(products => {
      res.json({
        products: products,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalProducts,
        hasPreviousPage: page > 1,
        nextPage:page+1,
        previousPage:page-1,
        lastPage:Math.ceil(totalProducts/ITEMS_PER_PAGE),
        totalItems: totalProducts
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      return cart
        .getProducts()
        .then(products => {
          // res.render('shop/cart', {
          //   path: '/cart',
          //   pageTitle: 'Your Cart',
          //   products: products
          // });
          res.status(200).json({
            success: true,
            products: products
          })
        })
        // .catch(err => console.log(err));
        .catch(err => { res.status(500).json({ success: false, message: err})});

    })
    // .catch(err => console.log(err));
    .catch(err => { res.status(500).json({ success: false, message: err})});
};

exports.postCart = (req, res, next) => {

  // Error - Handling -> if user has not send the product id
  if(!req.body.productId){
    return res.status(400).json({ success: false, message: 'Product Id Missing'})
  }
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => {
      // res.redirect('/cart');
      res.status(200).json({ success: true, message: 'Successfully added to the Product.'})
    })
    // .catch(err => console.log(err));
    .catch(err => {
      res.status(600).json({ success: false, message: 'Error Occurred.'})
    })
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
  .getCart()
  .then(cart => {
    return cart.getProducts({ where: { id: prodId } })
  })
  .then(products => {
    const product = products[0];
    return product.cartItem.destroy();
  })
  .then(result => {
    res.redirect('/cart')
  })
  .catch(err => console.log(err))
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};