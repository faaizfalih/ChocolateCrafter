import {
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem,
  corporateInquiries, type CorporateInquiry, type InsertCorporateInquiry,
  contactForms, type ContactForm, type InsertContactForm,
  newsletters, type Newsletter, type InsertNewsletter,
} from "@shared/schema";

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
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Order operations
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  getOrderById(id: number): Promise<Order | undefined>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  
  // Corporate inquiries
  createCorporateInquiry(inquiry: InsertCorporateInquiry): Promise<CorporateInquiry>;
  
  // Contact form
  createContactForm(form: InsertContactForm): Promise<ContactForm>;
  
  // Newsletter subscription
  createNewsletter(newsletter: InsertNewsletter): Promise<Newsletter>;
  isEmailSubscribed(email: string): Promise<boolean>;
}

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
      {
        name: "Classic Shokupan",
        slug: "classic-shokupan",
        description: "Our signature milk bread with a soft, fluffy texture and slightly sweet flavor. Perfect for sandwiches or toast.",
        price: 65000,
        imageUrl: "https://images.unsplash.com/photo-1586765501663-0ae193335182?auto=format&fit=crop&w=600&q=80",
        category: "signature",
        featured: true,
        bestSeller: true,
        seasonal: false,
        stock: 20,
      },
      {
        name: "Strawberry Sakura Shokupan",
        slug: "strawberry-sakura-shokupan",
        description: "Soft milk bread infused with real strawberries and a hint of cherry blossom. A seasonal favorite!",
        price: 85000,
        imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
        category: "seasonal",
        featured: true,
        bestSeller: true,
        seasonal: true,
        stock: 15,
      },
      {
        name: "Matcha Red Bean Shokupan",
        slug: "matcha-red-bean-shokupan",
        description: "Premium matcha-infused milk bread with sweet red bean swirls. A perfect balance of earthy and sweet.",
        price: 85000,
        imageUrl: "https://images.unsplash.com/photo-1551975632-c88c9af930e4?auto=format&fit=crop&w=600&q=80",
        category: "signature",
        featured: true,
        bestSeller: true,
        seasonal: false,
        stock: 12,
      },
      {
        name: "Chocolate Marble Shokupan",
        slug: "chocolate-marble-shokupan",
        description: "Soft milk bread marbled with rich dark chocolate. Delightful as a breakfast treat or dessert.",
        price: 75000,
        imageUrl: "https://images.unsplash.com/photo-1600326145359-3a44909d1a39?auto=format&fit=crop&w=600&q=80",
        category: "signature",
        featured: false,
        bestSeller: true,
        seasonal: false,
        stock: 18,
      },
      {
        name: "Earl Grey Shokupan",
        slug: "earl-grey-shokupan",
        description: "Delicate Earl Grey tea-infused milk bread with subtle bergamot notes. Elegant and sophisticated.",
        price: 75000,
        imageUrl: "https://images.unsplash.com/photo-1587248720327-8eb72564be1a?auto=format&fit=crop&w=600&q=80",
        category: "seasonal",
        featured: false,
        bestSeller: true,
        seasonal: true,
        stock: 10,
      },
      {
        name: "Yuzu Honey Shokupan",
        slug: "yuzu-honey-shokupan",
        description: "Refreshing citrus yuzu-infused milk bread with a touch of natural honey. Bright and aromatic.",
        price: 80000,
        imageUrl: "https://images.unsplash.com/photo-1570145820259-b5b80c5c8bd6?auto=format&fit=crop&w=600&q=80",
        category: "seasonal",
        featured: false,
        bestSeller: false,
        seasonal: true,
        stock: 8,
      }
    ];
    
    sampleProducts.forEach(product => this.createProduct(product));
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
      product => product.category === category
    );
  }
  
  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.featured
    );
  }
  
  async getBestSellerProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.bestSeller
    );
  }
  
  async getSeasonalProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.seasonal
    );
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const now = new Date();
    
    const product: Product = {
      ...insertProduct,
      id,
      createdAt: now,
    };
    
    this.products.set(id, product);
    this.productSlugs.set(product.slug, id);
    
    return product;
  }
  
  async updateProduct(id: number, update: Partial<InsertProduct>): Promise<Product | undefined> {
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
    const product = this.products.get(id);
    if (!product) return false;
    
    this.productSlugs.delete(product.slug);
    return this.products.delete(id);
  }
  
  // Order operations
  async createOrder(insertOrder: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const id = this.currentOrderId++;
    const now = new Date();
    
    const order: Order = {
      ...insertOrder,
      id,
      status: "pending",
      createdAt: now,
    };
    
    this.orders.set(id, order);
    
    // Create order items
    const orderItems: OrderItem[] = items.map(item => ({
      ...item,
      id: this.currentOrderItemId++,
      orderId: id,
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
  async createCorporateInquiry(inquiry: InsertCorporateInquiry): Promise<CorporateInquiry> {
    const id = this.currentInquiryId++;
    const now = new Date();
    
    const corporateInquiry: CorporateInquiry = {
      ...inquiry,
      id,
      createdAt: now,
    };
    
    this.corporateInquiries.set(id, corporateInquiry);
    
    return corporateInquiry;
  }
  
  // Contact form
  async createContactForm(form: InsertContactForm): Promise<ContactForm> {
    const id = this.currentContactFormId++;
    const now = new Date();
    
    const contactForm: ContactForm = {
      ...form,
      id,
      createdAt: now,
    };
    
    this.contactForms.set(id, contactForm);
    
    return contactForm;
  }
  
  // Newsletter subscription
  async createNewsletter(newsletter: InsertNewsletter): Promise<Newsletter> {
    const id = this.currentNewsletterId++;
    const now = new Date();
    
    const newsletterEntry: Newsletter = {
      ...newsletter,
      id,
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

export const storage = new MemStorage();
