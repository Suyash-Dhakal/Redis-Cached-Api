import mongoose from 'mongoose'

const productSchema= new mongoose.Schema(
{
_id: String,
name: String,
category: String,
price: Number,
stock: Number,
rating: Number
},
{timestamps: true}
);

export const Product = mongoose.model("Product", productSchema);
