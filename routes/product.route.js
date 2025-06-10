import express from 'express';
import { Product } from '../models/product.model.js';

const router = express.Router();

router.get('/', async (req, res)=>{
    try {
        const products = await Product.find({});
        if(!products || products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

export default router;