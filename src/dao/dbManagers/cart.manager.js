import { cartModel } from '../models/cart.model.js';


export default class CartManager {
    constructor() {
        console.log('CartManager constructor')
    }

    getAll = async () => {
        const cart = await cartModel.find().lean();
        return cart;
    }

    addCart = async (cart) => {
        const result = await cartModel.create(cart);
        return result;
    }

    update = async (id, cart) => {
        const result = await cartModel.updateOne({ _id: id }, cart);
        return result;
    }

    getCartById = async (id) => {
        const result = await cartModel.findOne({ _id: id });
        return result;
    }; 


    productToCart = async (product, cart,cid) => {

       const productID = product._id;
       const index = cart.products.findIndex(c=> c.product.toString() === productID.toString());
       if (index != -1) {

        cart.products[index].quantity = cart.products[index].quantity + 1 
        const result = await cartModel.updateOne({ _id: cid }, cart);        
        return result;
        
       }   
         
       cart.products.push({ product: product._id,});
       const result = await cartModel.updateOne({ _id: cid }, cart);
       return result;      
    }

    deleteAll = async(cid) => { 
          const result = await cartModel.updateOne({ _id: cid }, { $set: { products:[]}});
          
        return result;
    };

       
    updateQuantity = async(cid,pid,upProduct,product,cart ) => {
        
        const productID = product._id;
        const quantity = upProduct.quantity;

        console.log("cosola"+ upProduct);
        const index = cart.products.findIndex(c=> c.product.toString() === productID.toString());
        if (index != -1) {
            cart.products[index].quantity = quantity;
            const result = await cartModel.updateOne({ _id: cid }, cart);        
        return result;
        }

    }

    deleteOnlyOne = async(cid,pid,product,cart) => { 
        
        const productID = product._id;
                     
        const index = cart.products.findIndex(c=> c.product.toString() === productID.toString());

        if (index != -1) {
            cart.products.splice(index, 1);
            const result = await cartModel.updateOne({ _id: cid }, cart);        
            return result;
            
        }

        
        
      
  };


};