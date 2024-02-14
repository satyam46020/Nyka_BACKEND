const express = require('express');
const productrouter = express.Router();
const Product = require('../model/Product.model');

productrouter.get('/products', async (req, res) => {
  try {
    let query = {};

    if (req.query.search) {
      query.name = { $regex: new RegExp(req.query.search, 'i') };
    }
    
    if (req.query.gender) {
      query.gender = req.query.gender;
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.sort === 'asc') {
      const products = await Product.find(query).sort({ price: 1 });
      res.status(200).json(products);
    }
    else if (req.query.sort === 'desc') {
      const products = await Product.find(query).sort({ price: -1 });
      res.status(200).json(products);
    }

    else {
      const products = await Product.find(query);
      res.status(200).json(products);
    }
  }  catch (error) {
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
    const newProduct = new Product(req.body);
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
