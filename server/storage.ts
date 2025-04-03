import {
  users,
  type User,
  type InsertUser,
  products,
  type Product,
  type InsertProduct,
  orders,
  type Order,
  type InsertOrder,
  orderItems,
  type OrderItem,
  type InsertOrderItem,
  corporateInquiries,
  type CorporateInquiry,
  type InsertCorporateInquiry,
  contactForms,
  type ContactForm,
  type InsertContactForm,
  newsletters,
  type Newsletter,
  type InsertNewsletter,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";
import pg from 'pg';
const { Client } = pg;
import * as fs from 'fs';
import * as path from 'path';

export interface IStorage {
  // User operations (from template)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Product operations
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getBestSellerProducts(): Promise<Product[]>;
  getSeasonalProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(
    id: number,
    product: Partial<InsertProduct>,
  ): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  deleteAllProducts(): Promise<boolean>;

  // Order operations
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  getOrderById(id: number): Promise<Order | undefined>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;

  // Corporate inquiries
  createCorporateInquiry(
    inquiry: InsertCorporateInquiry,
  ): Promise<CorporateInquiry>;

  // Contact form
  createContactForm(form: InsertContactForm): Promise<ContactForm>;

  // Newsletter subscription
  createNewsletter(newsletter: InsertNewsletter): Promise<Newsletter>;
  isEmailSubscribed(email: string): Promise<boolean>;
}

// Database implementation
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Product operations
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));
    return product;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug));
    return product;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(eq(products.category, category));
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.featured, true));
  }

  async getBestSellerProducts(): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(eq(products.bestSeller, true));
  }

  async getSeasonalProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.seasonal, true));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async updateProduct(
    id: number,
    product: Partial<InsertProduct>,
  ): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning({ id: products.id });
    return result.length > 0;
  }

  async deleteAllProducts(): Promise<boolean> {
    try {
      await db.delete(products).execute();
      return true;
    } catch (error) {
      console.error("Error deleting all products:", error);
      return false;
    }
  }

  // Order operations
  async createOrder(
    insertOrder: InsertOrder,
    insertItems: InsertOrderItem[],
  ): Promise<Order> {
    // First create the order
    const [order] = await db.insert(orders).values(insertOrder).returning();

    // Then create all order items
    if (insertItems.length > 0) {
      const items = insertItems.map((item) => ({
        ...item,
        orderId: order.id,
      }));
      await db.insert(orderItems).values(items);
    }

    return order;
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));
  }

  // Corporate inquiries
  async createCorporateInquiry(
    inquiry: InsertCorporateInquiry,
  ): Promise<CorporateInquiry> {
    const [corporateInquiry] = await db
      .insert(corporateInquiries)
      .values(inquiry)
      .returning();
    return corporateInquiry;
  }

  // Contact form
  async createContactForm(form: InsertContactForm): Promise<ContactForm> {
    const [contactForm] = await db
      .insert(contactForms)
      .values(form)
      .returning();
    return contactForm;
  }

  // Newsletter subscription
  async createNewsletter(newsletter: InsertNewsletter): Promise<Newsletter> {
    const [newsletterEntry] = await db
      .insert(newsletters)
      .values(newsletter)
      .returning();
    return newsletterEntry;
  }

  async isEmailSubscribed(email: string): Promise<boolean> {
    const [entry] = await db
      .select({ id: newsletters.id })
      .from(newsletters)
      .where(eq(newsletters.email, email));
    return !!entry;
  }
}

// Memory storage implementation for fallback
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private productSlugs: Map<string, number>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem[]>;
  private corporateInquiries: Map<number, CorporateInquiry>;
  private contactForms: Map<number, ContactForm>;
  private newsletters: Map<number, Newsletter>;
  private emailsSubscribed: Set<string>;

  currentUserId: number;
  currentProductId: number;
  currentOrderId: number;
  currentOrderItemId: number;
  currentInquiryId: number;
  currentContactFormId: number;
  currentNewsletterId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.productSlugs = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.corporateInquiries = new Map();
    this.contactForms = new Map();
    this.newsletters = new Map();
    this.emailsSubscribed = new Set();

    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    this.currentInquiryId = 1;
    this.currentContactFormId = 1;
    this.currentNewsletterId = 1;

    // Initialize with sample products
    this.initializeProducts();
  }

  private initializeProducts() {
    const sampleProducts: InsertProduct[] = [
      // Signature Category
      {
        name: "Hokkaido Milk Shokupan",
        slug: "hokkaido-milk-shokupan",
        description:
          "Our classic loaf—pillowy-soft and deeply umami, made with Hokkaido milk and Japanese flour.",
        price: 42000,
        imageUrl: "/assets/Hokkaido Milk1.jpg",
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
        imageUrl: "/assets/Whole Wheat1.jpg",
        category: "signature",
        featured: false,
        bestSeller: false,
        seasonal: false,
        stock: 15,
      },
      // Flavored & Seasonal Category
      {
        name: "Matcha White Chocolate Shokupan",
        slug: "matcha-white-chocolate-shokupan",
        description:
          "Earthy matcha swirled with ribbons of creamy white chocolate—balanced and indulgent.",
        price: 59000,
        imageUrl: "/attached_assets/matcha1.jpg",
        category: "flavored",
        featured: true,
        bestSeller: true,
        seasonal: true,
        stock: 12,
      },
      {
        name: "Dark Chocolate Almond Caramel Shokupan",
        slug: "dark-chocolate-almond-caramel-shokupan",
        description:
          "Rich cocoa, dark chocolate, and caramelized almond praline—our most decadent seasonal release.",
        price: 60000,
        imageUrl: "matcha2.jpg",
        category: "flavored",
        featured: true,
        bestSeller: false,
        seasonal: true,
        stock: 18,
      },
      // Sakura Strawberry Anshokupan Category
      {
        name: "Sakura Strawberry Anshokupan (Classic)",
        slug: "sakura-strawberry-anshokupan-classic",
        description:
          "Strawberries from Ciwidey and red bean paste meet in a soft, sakura-infused loaf. Traditional square shokupan style.",
        price: 49000,
        imageUrl: "/assets/Sakura Strawberry1.jpg",
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
        imageUrl: "/assets/Sakura Strawberry5.jpg",
        category: "sakura",
        featured: true,
        bestSeller: false,
        seasonal: true,
        stock: 8,
      },
      // Jams & Spreads Category
      {
        name: "Matcha Milk Jam",
        slug: "matcha-milk-jam",
        description:
          "Creamy matcha meets sweet milk in this rich, aromatic spread made for our shokupan.",
        price: 114000,
        imageUrl: "/assets/General Photo3.jpg", // Using general photo as placeholder
        category: "spreads",
        featured: false,
        bestSeller: false,
        seasonal: false,
        stock: 15,
      },
      {
        name: "All-Natural Strawberry Jam",
        slug: "all-natural-strawberry-jam",
        description:
          "Ciwidey strawberries preserved at peak ripeness—no preservatives, just pure fruit.",
        price: 72000,
        imageUrl: "/assets/Strawberry Jam1.jpg",
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
        imageUrl: "/assets/General Photo5.jpg", // Using general photo as placeholder for Yuzu
        category: "seasonal",
        featured: false,
        bestSeller: false,
        seasonal: true,
        stock: 8,
      },
      // Add Hojicha variant
      {
        name: "Hojicha Black Sesame Shokupan",
        slug: "hojicha-black-sesame-shokupan",
        description:
          "Roasted hojicha tea meets nutty black sesame in this sophisticated and aromatic shokupan.",
        price: 58000,
        imageUrl: "/assets/General Photo4.jpg", // Using general photo as placeholder
        category: "flavored",
        featured: false,
        bestSeller: true,
        seasonal: true,
        stock: 10,
      },
      // Add Strawberry Jam Gift Set
      {
        name: "Premium Strawberry Jam Gift Set",
        slug: "premium-strawberry-jam-gift-set",
        description:
          "Two sizes of our signature all-natural strawberry jam in elegant packaging—perfect for gifting.",
        price: 160000,
        imageUrl: "/assets/Strawberry Jam2.jpg",
        category: "spreads",
        featured: true,
        bestSeller: false,
        seasonal: false,
        stock: 15,
      },
    ];

    sampleProducts.forEach((product) => this.createProduct(product));
  }

  // User operations (from template)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Product operations
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const productId = this.productSlugs.get(slug);
    if (!productId) return undefined;
    return this.products.get(productId);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category,
    );
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.featured,
    );
  }

  async getBestSellerProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.bestSeller,
    );
  }

  async getSeasonalProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.seasonal,
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const now = new Date();

    // Explicitly handle all required fields to avoid type issues
    const product: Product = {
      id,
      name: insertProduct.name,
      slug: insertProduct.slug,
      description: insertProduct.description,
      price: insertProduct.price,
      imageUrl: insertProduct.imageUrl,
      category: insertProduct.category,
      featured: insertProduct.featured ?? false,
      bestSeller: insertProduct.bestSeller ?? false,
      seasonal: insertProduct.seasonal ?? false,
      stock: insertProduct.stock ?? 0,
      createdAt: now,
    };

    this.products.set(id, product);
    this.productSlugs.set(product.slug, id);

    return product;
  }

  async updateProduct(
    id: number,
    update: Partial<InsertProduct>,
  ): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    // Update slug mapping if slug is changing
    if (update.slug && update.slug !== product.slug) {
      this.productSlugs.delete(product.slug);
      this.productSlugs.set(update.slug, id);
    }

    const updatedProduct = { ...product, ...update };
    this.products.set(id, updatedProduct);

    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    if (!this.products.has(id)) {
      return false;
    }

    const product = this.products.get(id)!;
    this.productSlugs.delete(product.slug);
    this.products.delete(id);
    return true;
  }

  async deleteAllProducts(): Promise<boolean> {
    try {
      this.products.clear();
      this.productSlugs.clear();
      this.currentProductId = 1;
      return true;
    } catch (error) {
      console.error("Error deleting all products from memory:", error);
      return false;
    }
  }

  // Order operations
  async createOrder(
    insertOrder: InsertOrder,
    items: InsertOrderItem[],
  ): Promise<Order> {
    const id = this.currentOrderId++;
    const now = new Date();

    // Explicitly handle all required fields to avoid type issues
    const order: Order = {
      id,
      customerName: insertOrder.customerName,
      customerEmail: insertOrder.customerEmail,
      customerPhone: insertOrder.customerPhone,
      shippingAddress: insertOrder.shippingAddress,
      city: insertOrder.city,
      postalCode: insertOrder.postalCode,
      total: insertOrder.total,
      status: "pending",
      createdAt: now,
    };

    this.orders.set(id, order);

    // Create order items
    const orderItems: OrderItem[] = items.map((item) => ({
      id: this.currentOrderItemId++,
      orderId: id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    this.orderItems.set(id, orderItems);

    return order;
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return this.orderItems.get(orderId) || [];
  }

  // Corporate inquiries
  async createCorporateInquiry(
    inquiry: InsertCorporateInquiry,
  ): Promise<CorporateInquiry> {
    const id = this.currentInquiryId++;
    const now = new Date();

    // Explicitly handle all required fields
    const corporateInquiry: CorporateInquiry = {
      id,
      name: inquiry.name,
      email: inquiry.email,
      company: inquiry.company,
      phone: inquiry.phone,
      message: inquiry.message,
      quantity: inquiry.quantity ?? null,
      createdAt: now,
    };

    this.corporateInquiries.set(id, corporateInquiry);

    return corporateInquiry;
  }

  // Contact form
  async createContactForm(form: InsertContactForm): Promise<ContactForm> {
    const id = this.currentContactFormId++;
    const now = new Date();

    // Explicitly handle all required fields
    const contactForm: ContactForm = {
      id,
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
      createdAt: now,
    };

    this.contactForms.set(id, contactForm);

    return contactForm;
  }

  // Newsletter subscription
  async createNewsletter(newsletter: InsertNewsletter): Promise<Newsletter> {
    const id = this.currentNewsletterId++;
    const now = new Date();

    // Explicitly handle all required fields
    const newsletterEntry: Newsletter = {
      id,
      email: newsletter.email,
      createdAt: now,
    };

    this.newsletters.set(id, newsletterEntry);
    this.emailsSubscribed.add(newsletter.email);

    return newsletterEntry;
  }

  async isEmailSubscribed(email: string): Promise<boolean> {
    return this.emailsSubscribed.has(email);
  }
}

// Use DatabaseStorage when DATABASE_URL is available, otherwise fall back to MemStorage
export const storage = process.env.DATABASE_URL 
  ? new DatabaseStorage() 
  : new MemStorage();

// Add direct PostgreSQL implementation for testing
export class DirectPgStorage implements IStorage {
  private client: Client;
  private connected: boolean = false;

  constructor() {
    // Read the DATABASE_URL directly from the .env file
    let databaseUrl: string | undefined;
    try {
      const envFilePath = path.resolve(process.cwd(), '.env');
      const envFile = fs.readFileSync(envFilePath, 'utf8');
      const match = envFile.match(/DATABASE_URL=([^\r\n]+)/);
      if (match && match[1]) {
        databaseUrl = match[1];
        console.log("DirectPgStorage: Found DATABASE_URL in .env file");
      }
    } catch (error) {
      console.error("DirectPgStorage: Error reading .env file:", error);
    }

    const connectionString = databaseUrl || process.env.DATABASE_URL || "";
    this.client = new Client({
      connectionString,
      ssl: false,
    });
    
    // Try to connect to the database
    this.client.connect()
      .then(() => {
        console.log("DirectPgStorage: Successfully connected to PostgreSQL");
        this.connected = true;
      })
      .catch(err => {
        console.error("DirectPgStorage: Failed to connect to PostgreSQL:", err);
        this.connected = false;
      });
  }

  // User operations
  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!this.connected) return undefined;
    try {
      const result = await this.client.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
      );
      return result.rows[0];
    } catch (error) {
      console.error("DirectPgStorage: Error in getUserByUsername:", error);
      return undefined;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    if (!this.connected) throw new Error("Database not connected");
    try {
      const result = await this.client.query(
        'INSERT INTO users(username, password) VALUES($1, $2) RETURNING *',
        [user.username, user.password]
      );
      return result.rows[0];
    } catch (error) {
      console.error("DirectPgStorage: Error in createUser:", error);
      throw error;
    }
  }

  // Product operations
  async getAllProducts(): Promise<Product[]> {
    if (!this.connected) return [];
    try {
      const result = await this.client.query('SELECT * FROM products');
      return result.rows;
    } catch (error) {
      console.error("DirectPgStorage: Error in getAllProducts:", error);
      return [];
    }
  }

  async getProductById(id: number): Promise<Product | undefined> {
    if (!this.connected) return undefined;
    try {
      const result = await this.client.query(
        'SELECT * FROM products WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error("DirectPgStorage: Error in getProductById:", error);
      return undefined;
    }
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    if (!this.connected) return undefined;
    try {
      const result = await this.client.query(
        'SELECT * FROM products WHERE slug = $1',
        [slug]
      );
      return result.rows[0];
    } catch (error) {
      console.error("DirectPgStorage: Error in getProductBySlug:", error);
      return undefined;
    }
  }

  async getFeaturedProducts(): Promise<Product[]> {
    if (!this.connected) return [];
    try {
      const result = await this.client.query(
        'SELECT * FROM products WHERE featured = true'
      );
      return result.rows;
    } catch (error) {
      console.error("DirectPgStorage: Error in getFeaturedProducts:", error);
      return [];
    }
  }

  async getBestSellerProducts(): Promise<Product[]> {
    if (!this.connected) return [];
    try {
      const result = await this.client.query(
        'SELECT * FROM products WHERE best_seller = true'
      );
      return result.rows;
    } catch (error) {
      console.error("DirectPgStorage: Error in getBestSellerProducts:", error);
      return [];
    }
  }

  async getSeasonalProducts(): Promise<Product[]> {
    if (!this.connected) return [];
    try {
      const result = await this.client.query(
        'SELECT * FROM products WHERE seasonal = true'
      );
      return result.rows;
    } catch (error) {
      console.error("DirectPgStorage: Error in getSeasonalProducts:", error);
      return [];
    }
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    if (!this.connected) throw new Error("Database not connected");
    try {
      const result = await this.client.query(
        `INSERT INTO products(
          name, slug, description, price, image_url, category, 
          featured, best_seller, seasonal, stock
        ) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
        RETURNING *`,
        [
          insertProduct.name,
          insertProduct.slug,
          insertProduct.description,
          insertProduct.price,
          insertProduct.imageUrl,
          insertProduct.category,
          insertProduct.featured || false,
          insertProduct.bestSeller || false,
          insertProduct.seasonal || false,
          insertProduct.stock || 0
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error("DirectPgStorage: Error in createProduct:", error);
      throw error;
    }
  }

  async updateProduct(
    id: number,
    updates: Partial<InsertProduct>,
  ): Promise<Product | undefined> {
    if (!this.connected) return undefined;
    try {
      // Get the current product
      const currentProductResult = await this.client.query(
        'SELECT * FROM products WHERE id = $1',
        [id]
      );
      
      if (currentProductResult.rows.length === 0) {
        return undefined;
      }
      
      const currentProduct = currentProductResult.rows[0];
      
      // Update with new values or keep existing ones
      const updatedProduct = {
        name: updates.name ?? currentProduct.name,
        slug: updates.slug ?? currentProduct.slug,
        description: updates.description ?? currentProduct.description,
        price: updates.price ?? currentProduct.price,
        imageUrl: updates.imageUrl ?? currentProduct.image_url,
        category: updates.category ?? currentProduct.category,
        featured: updates.featured ?? currentProduct.featured,
        bestSeller: updates.bestSeller ?? currentProduct.best_seller,
        seasonal: updates.seasonal ?? currentProduct.seasonal,
        stock: updates.stock ?? currentProduct.stock,
      };
      
      const result = await this.client.query(
        `UPDATE products 
        SET name = $1, slug = $2, description = $3, price = $4, 
            image_url = $5, category = $6, featured = $7, 
            best_seller = $8, seasonal = $9, stock = $10
        WHERE id = $11
        RETURNING *`,
        [
          updatedProduct.name,
          updatedProduct.slug,
          updatedProduct.description,
          updatedProduct.price,
          updatedProduct.imageUrl,
          updatedProduct.category,
          updatedProduct.featured,
          updatedProduct.bestSeller,
          updatedProduct.seasonal,
          updatedProduct.stock,
          id
        ]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error("DirectPgStorage: Error in updateProduct:", error);
      return undefined;
    }
  }

  async deleteProduct(id: number): Promise<boolean> {
    if (!this.connected) return false;
    try {
      const query = 'DELETE FROM products WHERE id = $1 RETURNING id';
      const result = await this.client.query(query, [id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }

  async deleteAllProducts(): Promise<boolean> {
    try {
      const query = 'DELETE FROM products';
      await this.client.query(query);
      return true;
    } catch (error) {
      console.error('Error deleting all products:', error);
      return false;
    }
  }

  // Order operations
  // ... implement other methods as needed ...
}

export const createStorage = (): IStorage => {
  console.log("Creating storage implementation...");
  
  // Try to use the DirectPgStorage first
  try {
    const directStorage = new DirectPgStorage();
    console.log("Using DirectPgStorage implementation");
    return directStorage;
  } catch (error) {
    console.error("Failed to create DirectPgStorage:", error);
    
    // Fall back to configured storage
    return db 
      ? new DatabaseStorage() 
      : new MemStorage();
  }
};
