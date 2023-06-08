import { Router } from 'express';
import ProductManager from '../dao/dbManagers/product.manager.js';
import { productModel } from '../dao/models/product.model.js';
import { cartModel } from '../dao/models/cart.model.js';



const router = Router();


const publicAccess =  (req, res, next) => {
    if(req.session.user) return res.redirect('/productlist');
    next();
}

const privateAccess = (req, res, next) => {
    if(!req.session.user) return res.redirect('/login');
    next();
}

router.get('/register', publicAccess, (req, res) => {
    
    res.render('register');
});

router.get('/login', publicAccess, (req, res) => {
    res.render('login');
});

router.get('/', privateAccess, (req, res) => {
      
    res.render('profile', {
        user: req.session.user
    });
});

const productManager = new ProductManager();

router.get('/productlist', privateAccess, async (req, res) => {

    const { page = 1, limit = 10, category = "", status = "", sort = ""   } = req.query;

    const filter = {};
    if (category) {
        filter.category = category; 
    }
    if (status) {
        filter.status = status; 
    }

      
    const sortBy = {};
    if (sort) {
        sortBy.price = sort
    } 

    if (sort) {
        sortBy.price = sort
    } 

    const products = await productModel.paginate(filter, { limit, page, lean: true, sort:sortBy });
    //
    const result = {
        user: req.session.user,
        status: "success",
        limit:limit,
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage ? `/products?page=${products.prevPage}&limit=${limit}&category=${category}&status=${status}&sort=${sort}` : null,
        nextLink: products.hasNextPage ? `/products?page=${products.nextPage}&limit=${limit}&category=${category}&status=${status}&sort=${sort}` : null
      
    }
    
    res.render("products", result);
});
   

router.get("/products/:pid",privateAccess, async (req, res) => {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid)
    console.log(product);
    console.log(product);
    res.render("productDetails", product)
})

router.get('/carts/:cid',privateAccess, async (req, res) => {
    const { cid } = req.params;

    const cart = await cartModel.find({ _id: cid }).populate('products.product');

    const result = {
        _id : cart[0]._id,
        products : []
    }
   


    cart[0].products.forEach(item=>{
        
        result.products.push({
            product: {
                _id : item.product._id,
                title: item.product.title,
                description: item.product.description,
                code: item.product.code,
                price: item.product.price,
                status: item.product.status,
                stock: item.product.stock,
                category: item.product.category,
                thumbnail: item.product.thumbnails
            },
            quantity: item.quantity
        })
    })

   

    res.render("cart", result)
});



export default router;






