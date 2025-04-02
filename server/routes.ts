import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProductSchema, 
  insertOrderSchema, 
  insertOrderItemSchema, 
  insertCorporateInquirySchema,
  insertContactFormSchema,
  insertNewsletterSchema,
} from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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

  const httpServer = createServer(app);
  return httpServer;
}
