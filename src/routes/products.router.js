import { Router } from 'express';
import ProductManager from '../dao/dbManagers/product.manager.js';
import CartManager from '../dao/dbManagers/cart.manager.js';


const router = Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

router.get('/', async(req, res) => {
   try {
        const products = await productManager.getProducts();
        if (!products){
            return res.status(400).send({status: 'error', error: 'products not found'});
        }
        res.send({status: 'success', payload: products });
    
   } catch (error) {
        res.status(500).send({status: 'error', error});
   }
  
});

router.get('/:pid', async(req, res) => {

    try {
        const id = req.params.pid;
        const product = await productManager.getProductById(id)
        if (!product) {
            return res.status(400).send({status: 'error', error: 'product not found'});
        }
        res.send({status: 'success', payload:product});
    } catch (error) {
        res.status(500).send({status: 'error', error});
    }   
    
    

});
   
router.post('/', async(req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;   
    if (!title || !description || !code || !price || !stock || !category || !thumbnails ) {              
        return res.status(400).send({status: 'error', error: 'Please, to load the product complete all the required fields'});
    };
    try {
        const result = await productManager.addProduct ({title, description, code, price,stock, category,thumbnails});
        res.send({status: 'success', payload: result});
    } catch (error) {
        res.status(500).send({status: 'error', error});
    }
  
})

router.put('/:pid', async(req, res) => {

    const id = req.params.pid;
    const upProduct = req.body;
    try {
        const result = await productManager.updateProduct(id, upProduct);
     
    res.send({status: 'success', result});
    } catch (error) {
        res.status(500).send({status: 'error', error});
    }
    

});


router.delete('/:pid', async(req, res) => {

    const pid = req.params.pid;
    try {
        const carts = await cartManager.getAll();
        const cid = carts[0];
        const cart = await cartManager.getCartById(cid);
        if (cart === undefined || cart === null) {
            return res.status(400).send({status: 'error', error: 'Cart not found'});
        } 
        const product = await productManager.getProductById(pid);
        if (product === undefined || product === null) {
            return res.status(400).send({status: 'error', error: 'Product not found'});
        } 
        const result = await cartManager.deleteOnlyOne(cid,pid,product,cart);
        const del = await productManager.deleteProduct(pid);


        res.send({status: 'success', del});
    } catch (error) {
        res.status(500).send({status: 'error', error});
    }


   
})

export default router;