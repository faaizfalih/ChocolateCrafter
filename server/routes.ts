import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { 
  insertProductSchema, 
  insertOrderSchema, 
  insertOrderItemSchema, 
  insertCorporateInquirySchema,
  insertContactFormSchema,
  insertNewsletterSchema,
  products
} from "@shared/schema";
import { ZodError } from "zod";
import path from 'path';
import fs from 'fs';

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve attached assets
  app.get('/attached_assets/:filename', (req, res) => {
    const filename = decodeURIComponent(req.params.filename);
    console.log(`Attempting to serve: ${filename}`);
    
    const filePath = path.join(process.cwd(), 'attached_assets', filename);
    console.log(`Full path: ${filePath}`);
    
    // Check if file exists
    if (fs.existsSync(filePath)) {
      // Determine Content-Type based on file extension
      const ext = path.extname(filename).toLowerCase();
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
      console.error(`File not found: ${filePath}`);
      return res.status(404).send('File not found');
    }
  });
  
  // API routes
  
  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json({ products });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  
  app.get("/api/products/featured", async (req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json({ products });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });
  
  app.get("/api/products/bestsellers", async (req, res) => {
    try {
      const products = await storage.getBestSellerProducts();
      res.json({ products });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bestseller products" });
    }
  });
  
  app.get("/api/products/seasonal", async (req, res) => {
    try {
      const products = await storage.getSeasonalProducts();
      res.json({ products });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch seasonal products" });
    }
  });
  
  app.get("/api/products/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const products = await storage.getProductsByCategory(category);
      res.json({ products });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products by category" });
    }
  });
  
  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProductById(Number(req.params.id));
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ product });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  
  app.get("/api/products/slug/:slug", async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ product });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  
  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json({ product });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });
  
  // Orders
  app.post("/api/orders", async (req, res) => {
    try {
      const { order, items } = req.body;
      
      const orderData = insertOrderSchema.parse(order);
      const orderItemsData = items.map((item: any) => insertOrderItemSchema.parse(item));
      
      const createdOrder = await storage.createOrder(orderData, orderItemsData);
      
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
      const order = await storage.getOrderById(Number(req.params.id));
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const items = await storage.getOrderItems(order.id);
      
      res.json({ order, items });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });
  
  // Corporate Inquiries
  app.post("/api/corporate-inquiry", async (req, res) => {
    try {
      const inquiryData = insertCorporateInquirySchema.parse(req.body);
      const inquiry = await storage.createCorporateInquiry(inquiryData);
      
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
      const contact = await storage.createContactForm(contactData);
      
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
      const isSubscribed = await storage.isEmailSubscribed(newsletterData.email);
      if (isSubscribed) {
        return res.status(400).json({ message: "Email is already subscribed" });
      }
      
      const newsletter = await storage.createNewsletter(newsletterData);
      
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
        await db.delete(products).execute();
      } catch (error) {
        console.log("Error deleting existing products:", error);
      }
      
      // Insert products with proper paths
      for (const product of productsData) {
        await storage.createProduct({
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
