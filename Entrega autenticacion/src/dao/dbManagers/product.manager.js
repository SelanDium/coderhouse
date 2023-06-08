import { productModel } from '../models/product.model.js';



export default class ProductManager{
    constructor() {
        console.log('ProductManager constructor')      
    }

    getProducts = async () => {
        const products = await productModel.find().lean();
        return products;    
    };

    addProduct = async (create) => {           
        const result = await productModel.create(create);
        return result;
    };

    deleteProduct = async(id) => { 
        const result = await productModel.deleteOne({ _id: id });

        return result;
    };
    
    getProductById = async (id) => {
        const result = await productModel.findOne({ _id: id });
        return result;
    }; 

    updateProduct = async (id,upProduct)=> {
        const result = await productModel.updateOne({ _id: id }, upProduct);
        return result;
    }
};



