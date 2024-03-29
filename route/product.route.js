const express = require('express');
const productrouter = express.Router();
const Product = require('../model/Product.model');

productrouter.get('/products', async (req, res) => {
  try {
    const userId = req.userId;

    let query = { userId };    
    if (req.query.search) {
      query.name = { $regex: new RegExp(req.query.search, 'i') };
    }
    
    if (req.query.gender) {
      query.gender = req.query.gender;
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    const page = parseInt(req.query.page) || 1;  
    const limit = parseInt(req.query.limit) || 10;  

    const skip = (page - 1) * limit;

    let productsQuery = Product.find(query);

    if (req.query.sort === 'asc') {
      productsQuery = productsQuery.sort({ price: 1 });
    } else if (req.query.sort === 'desc') {
      productsQuery = productsQuery.sort({ price: -1 });
    }

    const products = await productsQuery.skip(skip).limit(limit).exec();

    res.status(200).json(products);
  } 
 catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

productrouter.get('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

productrouter.post('/products', async (req, res) => {
  try {
    const userId = req.userId; 

    const newProduct = new Product({
      ...req.body,
      userId: userId,
    });
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

productrouter.put('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, { new: true });
    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

productrouter.delete('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    await Product.findByIdAndDelete(productId);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = productrouter;
