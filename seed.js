import { connectDB } from "./db/connectDB.js";
import { Product } from "./models/product.model.js";
import { products } from "./mockData.js";

export const seedDB = async () => {
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log("Mock data inserted");
  connectDB.connection.close();
};


