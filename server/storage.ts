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
        imageUrl: "/Hokkaido Milk1.jpg",
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
        imageUrl: "/Whole Wheat1.jpg",
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
        imageUrl: "/assets/Matcha1.jpg",
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
        imageUrl: "/Matcha2.jpg",
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
        imageUrl: "/Sakura Strawberry1.jpg",
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
        imageUrl: "/Sakura Strawberry5.jpg",
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
        imageUrl: "/General Photo3.jpg", // Using general photo as placeholder
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
        imageUrl: "/Strawberry Jam1.jpg",
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
        imageUrl: "/General Photo5.jpg", // Using general photo as placeholder for Yuzu
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
        imageUrl: "/General Photo4.jpg", // Using general photo as placeholder
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
        imageUrl: "/Strawberry Jam2.jpg",
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
    const product = this.products.get(id);
    if (!product) return false;

    this.productSlugs.delete(product.slug);
    return this.products.delete(id);
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

export const storage = new MemStorage();
