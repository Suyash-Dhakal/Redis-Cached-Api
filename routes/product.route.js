import express from 'express';
import { Product } from '../models/product.model.js';
import { redisClient } from '../utils/redisClient.js'; 

const router = express.Router();

// Route to get all products with caching
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

// Route to add a new product
router.post('/add-product', async (req,res)=>{
    try {
        const { id, name, category, price, stock, rating } = req.body;
        if (!id || !name || !category || !price || !stock || !rating) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // Check if product already exists
        const existingProduct = await Product.findOne({ _id: id });
        if (existingProduct) {
            return res.status(400).json({ message: "Product already exists" });
        }
        // Create a new product
        const newProduct = new Product({
            _id: id,
            name,
            category,
            price,
            stock,
            rating
        });

        // Save the product to MongoDB
        await newProduct.save();
        // Invalidate the cache
        await redisClient.del('products');
        res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

export default router;