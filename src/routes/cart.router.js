import { Router } from 'express';
                         
import CartManager from '../dao/dbManagers/cart.manager.js';
import ProductManager from '../dao/dbManagers/product.manager.js';
                            

const router = Router();

const cartManager = new CartManager();
const productManager = new ProductManager();


router.get('/', async(req, res) => {
    
    const carts = await cartManager.getAll()
    if (carts === undefined || carts === null) {
        return res.status(400).send({status: 'error', error: 'cart not found'});
    } 
    res.send({ status: 'success', payload: carts });
});

router.post('/', async(req, res) => {
    try {
        const carts = await cartManager.addCart()
        res.send({status: 'success', payload:carts })
    } catch (error) {
        res.status(500).send({status: 'error', error});
    }
   
});

router.get('/:cid', async(req, res) => {
        
    try {
        const id = req.params.cid;
        const result = await cartManager.getCartById(id)
        if (result === undefined || result === null) {
            return res.status(400).send({status: 'error', error: 'cart not found'});
        }        
        res.send({status: 'success', payload:result});
    } catch (error) {
        res.status(500).send({status: 'error', error});
    } 
});

router.post('/:cid/product/:pid', async(req, res) => {
 

    try {
        const pid = req.params.pid;
        const cid = req.params.cid;
        
        const product = await productManager.getProductById(pid)
        if (product === undefined || product === null) {
            return res.status(400).send({status: 'error', error: 'product not found'});
        } 
        const cart = await cartManager.getCartById(cid)
        if (cart === undefined || cart === null) {
            return res.status(400).send({status: 'error', error: 'cart not found'});
        } 
        const result = await cartManager.productToCart(product, cart,cid, pid);
        res.send({status: 'success',payload: result });
        
        
    } catch (error) {
        res.status(500).send({status: 'error', error});
    }     
  
        
});

router.delete('/:cid', async(req, res) => {

    try {
        const cid = req.params.cid;
              
        const result = await cartManager.deleteAll(cid);
        if (result === undefined || result === null) {
            return res.status(400).send({status: 'error', error: 'cart not found'});
        } 
        res.send({status: 'success',payload: result })
        
    } catch (error) {
        res.status(500).send({status: 'error', error});
    }     
})

router.put('/:cid/product/:pid', async(req, res)=>{
    
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const upProduct = req.body;
        
        const product = await productManager.getProductById(pid)
        if (product === undefined || product === null) {
            return res.status(400).send({status: 'error', error: 'Product not found'});
        } 
        const cart = await cartManager.getCartById(cid)
        if (cart === undefined || cart === null) {
            return res.status(400).send({status: 'error', error: 'cart not found'});
        } 
        console.log("CID: " + cid);
        console.log("PID: " + pid);
        console.log("UPPRODUCT:" + (upProduct));

        const result = await cartManager.updateQuantity(cid,pid,upProduct,product,cart);
        res.send({status:'success',payload:result});
    } catch (error) {
        res.status(500).send({status: 'error', error});

    }

})

router.delete('/:cid/product/:pid', async(req, res)=>{
    
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
               
        const product = await productManager.getProductById(pid)
        if (product === undefined || product === null) {
            return res.status(400).send({status: 'error', error: 'cart not found'});
        } 
        const cart = await cartManager.getCartById(cid)
        if (cart === undefined || cart === null) {
            return res.status(400).send({status: 'error', error: 'cart not found'});
        } 
        
        const result = await cartManager.deleteOnlyOne(cid,pid,product,cart);
        res.send({status:'success',payload:result});
    } catch (error) {
        res.status(500).send({status: 'error', error});

    }

})

export default router;
