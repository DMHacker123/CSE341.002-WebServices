const Joi = require("joi");
const courses = [];
const express = require("express");
const app = express();

// ===========================
// Middleware
// ===========================
app.use(express.json());

// ===========================
// Sample Data
// ===========================
const products = [
  { id: 1, name: "Product A", price: 19.99 },
  { id: 2, name: "Product B", price: 29.99 },
  { id: 3, name: "Product C", price: 39.99 }
];

// ===========================
// Basic Routes
// ===========================

// Home page
app.get("/", (req, res) => {
  res.send("Hello, World!!!!");
});

// About page
app.get("/about", (req, res) => {
  res.send("This is the about page.");
});

// Contact page
app.get("/contact", (req, res) => {
  res.send("This is the contact page.");
});

// ===========================
// API Routes
// ===========================

// Sample API data
app.get("/api/data", (req, res) => {
  res.json({
    message: "This is some sample data from the API.",
    timestamp: new Date()
  });
});

// Get a user by ID
app.get("/api/users/:id", (req, res) => {
  const user = {
    id: req.params.id,
    name: "John Doe",
    email: "john.doe@example.com"
  };

  res.json(user);
});

// Get all products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// Get product by ID
app.get("/api/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);

  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({
      message: "Product not found"
    });
  }

  res.json(product);
});

// Search products
app.get("/api/search", (req, res) => {
  const query = (req.query.q || "").toLowerCase();

  const results = products.filter(product =>
    product.name.toLowerCase().includes(query)
  );

  res.json(results);
});

// ===========================
// POST Routes
// ===========================

// Create a new course

app.post("/api/courses", (req, res) => {

    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        price: Joi.number().positive().required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name,
        price: req.body.price
    };

    courses.push(course);

    res.status(201).json(course);
});

app.put("/api/courses/:id", (req, res) => {

    // Look up the course
    const course = courses.find(c => c.id === parseInt(req.params.id));

    // If not existing, return 404
    if (!course) {
        return res.status(404).send("The course with the given ID was not found.");
    }

    // Validate
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        price: Joi.number().positive().required()
    });

    const { error } = schema.validate(req.body);

    // If invalid, return 400 - Bad Request
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // Update course
    course.name = req.body.name;
    course.price = req.body.price;

    // Return the updated course
    res.send(course);
});


// Create a new product
app.post("/api/products", (req, res) => {
  const newProduct = {
    id: products.length + 1,
    ...req.body
  };

  products.push(newProduct);

  res.status(201).json({
    message: "Product created successfully",
    product: newProduct
  });
});

// ===========================
// PUT Routes
// ===========================

// Update a product
app.put("/api/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);

  const productIndex = products.findIndex(
    p => p.id === productId
  );

  if (productIndex === -1) {
    return res.status(404).json({
      message: "Product not found"
    });
  }

  products[productIndex] = {
    ...products[productIndex],
    ...req.body
  };

  res.json({
    message: "Product updated successfully",
    product: products[productIndex]
  });
});

// ===========================
// DELETE Routes
// ===========================

// Delete course
app.delete('/api/courses/:id', (req, res) => {
  // Look up the course
  const course = courses.find(c => c.id === parseInt(req.params.id));

  // Not existing, return 404
  if (!course) {
    return res.status(404).send('The course with the given ID was not found.');
  }

  // Delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  // Return the same course
  res.send(course);
});

// ===========================
// 404 Error Handler
// ===========================
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

// ===========================
// Start the Server
// ===========================
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});