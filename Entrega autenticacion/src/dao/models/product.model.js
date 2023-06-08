import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productCollections = 'products';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: Number,
        required: true,
        unique: true
    },
    price:{
        type: Number,
        required: true
    },
    stock:{
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    thumbnails: {
        type: String,
        required: true
    },
    status:{
        type:Boolean,
        default: true
    },
    carts: {
        type: Array,
        default: [],
    }

});

productSchema.plugin(mongoosePaginate);


export const productModel = mongoose.model(productCollections, productSchema);

