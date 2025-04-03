import express from "express";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, createStorage } from "./storage";
import { db } from "./db";
import { 
  insertProductSchema, 
  insertOrderSchema, 
  insertOrderItemSchema, 
  insertCorporateInquirySchema,
  insertContactFormSchema,
  insertNewsletterSchema,
  type Product
} from "@shared/schema";
import { ZodError } from "zod";
import { join, extname } from "path";
import fs from "fs";
import bcrypt from "bcrypt";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

// Configure multer storage
const storage_config = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = join(process.cwd(), 'attached_assets');
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      console.log(`Creating attached_assets directory at ${uploadDir}`);
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique name for the file
    const uniqueFilename = `${Date.now()}-${uuidv4()}${extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

// Create multer instance with file filter for images only
const upload = multer({
  storage: storage_config,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!') as any);
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve attached assets
  app.get('/attached_assets/:filename', (req, res) => {
    const filename = decodeURIComponent(req.params.filename);
    console.log(`Attempting to serve attached asset: ${filename}`);
    
    const filePath = join(process.cwd(), 'attached_assets', filename);
    console.log(`Full attached asset path: ${filePath}`);
    
    // Check if file exists
    if (fs.existsSync(filePath)) {
      // Determine Content-Type based on file extension
      const ext = extname(filename).toLowerCase();
      let contentType = 'application/octet-stream'; // Default content type
      
      // Set appropriate content type based on file extension
      switch (ext) {
        case '.jpg':
        case '.jpeg':
          contentType = 'image/jpeg';
          break;
        case '.png':
          contentType = 'image/png';
          break;
        case '.gif':
          contentType = 'image/gif';
          break;
        case '.svg':
          contentType = 'image/svg+xml';
          break;
        case '.webp':
          contentType = 'image/webp';
          break;
        case '.txt':
          contentType = 'text/plain';
          break;
      }
      
      // Set cache headers for better performance
      res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
      res.setHeader('Content-Type', contentType);
      
      try {
        // Stream the file to the response
        const stream = fs.createReadStream(filePath);
        stream.on('error', (error) => {
          console.error(`Error streaming file ${filePath}:`, error);
          if (!res.headersSent) {
            res.status(500).send('Error serving file');
          }
        });
        stream.pipe(res);
      } catch (error) {
        console.error(`Error serving file ${filePath}:`, error);
        if (!res.headersSent) {
          res.status(500).send('Error serving file');
        }
      }
    } else {
      console.error(`Attached asset file not found: ${filePath}`);
      res.status(404).send('File not found');
    }
  });
  
  // Serve assets from public/assets directory
  app.get('/assets/:filename', (req, res) => {
    const filename = decodeURIComponent(req.params.filename);
    console.log(`Attempting to serve asset: ${filename}`);
    
    const filePath = join(process.cwd(), 'public', 'assets', filename);
    console.log(`Full asset path: ${filePath}`);
    
    // Check if file exists
    if (fs.existsSync(filePath)) {
      // Determine Content-Type based on file extension
      const ext = extname(filename).toLowerCase();
      let contentType = 'application/octet-stream'; // Default content type
      
      // Set appropriate content type based on file extension
      switch (ext) {
        case '.jpg':
        case '.jpeg':
          contentType = 'image/jpeg';
          break;
        case '.png':
          contentType = 'image/png';
          break;
        case '.gif':
          contentType = 'image/gif';
          break;
        case '.svg':
          contentType = 'image/svg+xml';
          break;
        case '.webp':
          contentType = 'image/webp';
          break;
        case '.txt':
          contentType = 'text/plain';
          break;
      }
      
      // Set cache headers for better performance
      res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
      res.setHeader('Content-Type', contentType);
      return fs.createReadStream(filePath).pipe(res);
    } else {
      console.error(`Asset file not found: ${filePath}`);
      return res.status(404).send('File not found');
    }
  });
  
  // API routes
  
  // Use the direct PostgreSQL storage implementation
  const directStorage = createStorage();
  
  // File Upload endpoint
  app.post("/api/upload", upload.single('image'), (req, res) => {
    try {
      if (!req.file) {
        console.error("No file received in upload request");
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      // Return the file path that can be stored in the database
      const imageUrl = req.file.filename;
      
      // Log file details for debugging
      console.log("File uploaded successfully:", {
        filename: imageUrl,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        path: req.file.path
      });
      
      return res.status(200).json({
        message: "File uploaded successfully",
        imageUrl: imageUrl
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      return res.status(500).json({ 
        message: "Error uploading file",
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });
  
  // Products
  app.get("/api/products", async (req, res) => {
    const products = await directStorage.getAllProducts();
    res.json({ products });
  });
  
  app.get("/api/products/featured", async (req, res) => {
    const products = await directStorage.getFeaturedProducts();
    res.json({ products });
  });
  
  app.get("/api/products/bestsellers", async (req, res) => {
    const products = await directStorage.getBestSellerProducts();
    res.json({ products });
  });
  
  app.get("/api/products/seasonal", async (req, res) => {
    const products = await directStorage.getSeasonalProducts();
    res.json({ products });
  });
  
  app.get("/api/products/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const products = await directStorage.getProductsByCategory(category);
      res.json({ products });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products by category" });
    }
  });
  
  app.get("/api/products/:idOrSlug", async (req, res) => {
    const { idOrSlug } = req.params;
    let product: Product | undefined;

    // Check if idOrSlug is a number
    const id = parseInt(idOrSlug);
    if (!isNaN(id)) {
      product = await directStorage.getProductById(id);
    } else {
      product = await directStorage.getProductBySlug(idOrSlug);
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ product });
  });
  
  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await directStorage.createProduct(productData);
      res.status(201).json({ product });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Invalid product data",
          errors: error.flatten().fieldErrors,
        });
      }
      res.status(500).json({ message: "Error creating product" });
    }
  });
  
  // Update a product
  app.put("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      console.log("Updating product with ID:", id);
      console.log("Update data:", req.body);

      // Partial validation
      const updates = req.body;
      
      const updatedProduct = await directStorage.updateProduct(id, updates);
      
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      console.log("Product updated successfully:", updatedProduct);
      
      res.json({ product: updatedProduct });
    } catch (error) {
      console.error("Error updating product:", error);
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Invalid product data",
          errors: error.flatten().fieldErrors,
        });
      }
      res.status(500).json({ message: "Error updating product" });
    }
  });
  
  // Delete a product
  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const success = await directStorage.deleteProduct(id);
      
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting product" });
    }
  });
  
  // Orders
  app.post("/api/orders", async (req, res) => {
    try {
      const { order, items } = req.body;
      
      const orderData = insertOrderSchema.parse(order);
      const orderItemsData = items.map((item: any) => insertOrderItemSchema.parse(item));
      
      const createdOrder = await directStorage.createOrder(orderData, orderItemsData);
      
      res.status(201).json({ 
        order: createdOrder,
        message: "Order placed successfully" 
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });
  
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await directStorage.getOrderById(Number(req.params.id));
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const items = await directStorage.getOrderItems(order.id);
      
      res.json({ order, items });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });
  
  // Corporate Inquiries
  app.post("/api/corporate-inquiry", async (req, res) => {
    try {
      const inquiryData = insertCorporateInquirySchema.parse(req.body);
      const inquiry = await directStorage.createCorporateInquiry(inquiryData);
      
      res.status(201).json({ 
        inquiry,
        message: "Inquiry submitted successfully" 
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid inquiry data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit inquiry" });
    }
  });
  
  // Contact Form
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactFormSchema.parse(req.body);
      const contact = await directStorage.createContactForm(contactData);
      
      res.status(201).json({ 
        contact,
        message: "Message sent successfully" 
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid contact data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });
  
  // Newsletter Subscription
  app.post("/api/newsletter", async (req, res) => {
    try {
      const newsletterData = insertNewsletterSchema.parse(req.body);
      
      // Check if email is already subscribed
      const isSubscribed = await directStorage.isEmailSubscribed(newsletterData.email);
      if (isSubscribed) {
        return res.status(400).json({ message: "Email is already subscribed" });
      }
      
      const newsletter = await directStorage.createNewsletter(newsletterData);
      
      res.status(201).json({ 
        newsletter,
        message: "Subscribed successfully" 
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid email", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to subscribe" });
    }
  });
  
  // Create DB products with attached_assets images
  app.get('/api/migrate-products', async (req, res) => {
    try {
      // Update product image paths to use attached_assets
      const productsData = [
        {
          name: "Hokkaido Milk Shokupan",
          slug: "hokkaido-milk-shokupan",
          description:
            "Our classic loaf—pillowy-soft and deeply umami, made with Hokkaido milk and Japanese flour.",
          price: 42000,
          imageUrl: "Hokkaido Milk2.jpg",
          category: "signature",
          featured: true,
          bestSeller: true,
          seasonal: false,
          stock: 20,
        },
        {
          name: "Whole Wheat Shokupan",
          slug: "whole-wheat-shokupan",
          description:
            "Nutty, wholesome, and still cloud-soft. A nutritious twist on our signature texture.",
          price: 39000,
          imageUrl: "Whole Wheat1.jpg",
          category: "signature",
          featured: false,
          bestSeller: false,
          seasonal: false,
          stock: 15,
        },
        {
          name: "Matcha White Chocolate Shokupan",
          slug: "matcha-white-chocolate-shokupan",
          description:
            "Earthy matcha swirled with ribbons of creamy white chocolate—balanced and indulgent.",
          price: 59000,
          imageUrl: "Matcha1.jpg",
          category: "flavored",
          featured: true,
          bestSeller: true,
          seasonal: true,
          stock: 12,
        },
        {
          name: "Sakura Strawberry Anshokupan (Classic)",
          slug: "sakura-strawberry-anshokupan-classic",
          description:
            "Strawberries from Ciwidey and red bean paste meet in a soft, sakura-infused loaf. Traditional square shokupan style.",
          price: 49000,
          imageUrl: "Sakura Strawberry1.jpg",
          category: "sakura",
          featured: true,
          bestSeller: true,
          seasonal: true,
          stock: 10,
        },
        {
          name: "Sakura Strawberry Anshokupan (Yamagata)",
          slug: "sakura-strawberry-anshokupan-yamagata",
          description:
            "Strawberries from Ciwidey and red bean paste meet in a soft, sakura-infused loaf. Hand-twisted with an open swirl top.",
          price: 54000,
          imageUrl: "Sakura Strawberry5.jpg",
          category: "sakura",
          featured: true,
          bestSeller: false,
          seasonal: true,
          stock: 8,
        },
        {
          name: "All-Natural Strawberry Jam",
          slug: "all-natural-strawberry-jam",
          description:
            "Ciwidey strawberries preserved at peak ripeness—no preservatives, just pure fruit.",
          price: 72000,
          imageUrl: "Strawberry Jam1.jpg",
          category: "spreads",
          featured: false,
          bestSeller: false,
          seasonal: false,
          stock: 20,
        },
        {
          name: "Yuzu Honey Shokupan",
          slug: "yuzu-honey-shokupan",
          description:
            "Refreshing citrus yuzu-infused milk bread with a touch of natural honey. Bright and aromatic.",
          price: 80000,
          imageUrl: "General Photo5.jpg",
          category: "seasonal",
          featured: false,
          bestSeller: false,
          seasonal: true,
          stock: 8,
        },
        {
          name: "Hojicha Black Sesame Shokupan",
          slug: "hojicha-black-sesame-shokupan",
          description:
            "Roasted hojicha tea meets nutty black sesame in this sophisticated and aromatic shokupan.",
          price: 58000,
          imageUrl: "General Photo4.jpg",
          category: "flavored",
          featured: false,
          bestSeller: true,
          seasonal: true,
          stock: 10,
        },
        {
          name: "Premium Strawberry Jam Gift Set",
          slug: "premium-strawberry-jam-gift-set",
          description:
            "Two sizes of our signature all-natural strawberry jam in elegant packaging—perfect for gifting.",
          price: 160000,
          imageUrl: "Strawberry Jam2.jpg",
          category: "spreads",
          featured: true,
          bestSeller: false,
          seasonal: false,
          stock: 15,
        },
      ];
      
      // Delete existing products (if any)
      try {
        // Use the storage module instead of direct db access
        await directStorage.deleteAllProducts();
      } catch (error) {
        console.log("Error deleting existing products:", error);
      }
      
      // Insert products with proper paths
      for (const product of productsData) {
        await directStorage.createProduct({
          ...product,
          imageUrl: product.imageUrl // The getImageUrl function will handle the path
        });
      }
      
      res.json({ success: true, message: "Products migrated successfully" });
    } catch (error) {
      console.error("Migration error:", error);
      res.status(500).json({ success: false, message: "Failed to migrate products", error: String(error) });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
