// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup for parsing JSON
app.use(bodyParser.json());

// TODO: Implement custom middleware for:

// Custom middleware for request logging
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} ${req.method} request for '${req.url}'`
  );
  next();
});

// Sample in-memory products database
let products = [
  {
    id: "1",
    name: "Laptop",
    description: "High-performance laptop with 16GB RAM",
    price: 1200,
    category: "electronics",
    inStock: true,
  },
  {
    id: "2",
    name: "Smartphone",
    description: "Latest model with 128GB storage",
    price: 800,
    category: "electronics",
    inStock: true,
  },
  {
    id: "3",
    name: "Coffee Maker",
    description: "Programmable coffee maker with timer",
    price: 50,
    category: "kitchen",
    inStock: false,
  },
];

// Root route
app.get("/", (req, res) => {
  res.send(
    "Welcome to the Product API! Go to /api/products to see all products."
  );
});

// Custom Middleware: API key auth middleware only for /api routes (pass ?apikey=12345)
app.use((req, res, next) => {
  const apikey = req.query.apikey;
  if (!apikey || apikey !== "12345") {
    return res
      .status(401)
      .json({ error: "Unauthorized: Invalid or missing API key" });
  }
  next();
});

// Product validation middleware
function validateProduct(req, res, next) {
  const { name, description, price, category, inStock } = req.body;

  if (
    typeof name !== "string" ||
    typeof description !== "string" ||
    typeof price !== "number" ||
    typeof category !== "string" ||
    typeof inStock !== "boolean"
  ) {
    return res.status(400).json({
      error:
        "Invalid product data. Ensure all fields are correct: name (string), description (string), price (number), category (string), inStock (boolean).",
    });
  }

  next(); // Proceed if valid
}

// --- API Routes ---
// GET /api/products - Get all products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// TODO: Implement the following routes:

// GET /api/products/:id - Get a specific product by ID
app.get("/api/products/:id", (req, res) => {
  const productId = req.params.id;
  const product = products.find((p) => p.id === productId);
  product
    ? res.json(product)
    : res.status(404).json({ error: "Product not found" });
});

// POST /api/products - Create a new product with validation
app.post("/api/products", validateProduct, (req, res) => {
  const newProduct = {
    id: uuidv4(), // Generate a unique ID for the new product
    ...req.body, // Spread the request body into the new product object
  };
  products.push(newProduct); // Add the new product to the in-memory database
  res.status(201).json(newProduct); // Respond with the created product
});

// PUT /api/products/:id - Update a product with validation
app.put("/api/products/:id", validateProduct, (req, res) => {
  const productId = req.params.id;
  const index = products.findIndex((p) => p.id === productId);
  if (index !== -1) {
    const updatedProduct = {
      ...products[index],
      ...req.body, // Update the product with the request body
    };
    products[index] = updatedProduct; // Replace the old product with the updated one
    res.json(updatedProduct); // Respond with the updated product
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

// DELETE /api/products/:id - Delete a product
app.delete("/api/products/:id", (req, res) => {
  const productId = req.params.id;
  const index = products.findIndex((p) => p.id === productId);
  if (index !== -1) {
    products.splice(index, 1); // Remove the product from the in-memory database
    res.status(204).send(); // Respond with no content
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

// Custom middleware for error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});
// Custom middleware for 404 Not Found
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Example route implementation for GET /api/products

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;
