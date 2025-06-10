import express from 'express';
import { Product } from '../models/product.model.js';
import { redisClient } from '../utils/redisClient.js'; 

const router = express.Router();

router.get('/', async (req, res)=>{
    try {

        const cachedProducts = await redisClient.get('products');
        if(cachedProducts){
            console.log("Cache hit");
            return res.status(200).json(JSON.parse(cachedProducts));
        }
        console.log("Cache miss");
        // Fetch products from MongoDB
        const products = await Product.find({});
        if(!products || products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }
        // Store products in Redis cache
        await redisClient.set('products', JSON.stringify(products), {
            EX: 3600, // Cache for 1 hour
            NX: true // Only set if not already exists
        });
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

export default router;