-- Insert sample products
INSERT INTO products (name, slug, description, price, image_url, category, featured, best_seller, seasonal, stock)
VALUES
  (
    'Classic Milk Bread Loaf',
    'classic-milk-bread-loaf',
    'Our signature milk bread loaf made with premium ingredients for a soft, fluffy texture.',
    55000,
    '/assets/Classic Milk Bread.jpg',
    'classic',
    TRUE,
    TRUE,
    FALSE,
    20
  ),
  (
    'Matcha Milk Bread Loaf',
    'matcha-milk-bread-loaf',
    'Premium matcha infused into our signature milk bread for a vibrant and aromatic experience.',
    62000,
    '/assets/Matcha Milk Bread.jpg',
    'flavored',
    TRUE,
    TRUE,
    FALSE,
    15
  ),
  (
    'Double Chocolate Milk Bread',
    'double-chocolate-milk-bread',
    'Rich cocoa milk bread with chocolate chips throughout for an indulgent chocolate experience.',
    68000,
    '/assets/Chocolate Milk Bread.jpg',
    'flavored',
    FALSE,
    TRUE,
    FALSE,
    10
  ),
  (
    'Strawberry Milk Bread',
    'strawberry-milk-bread',
    'Delicate strawberry-flavored milk bread made with real strawberry puree.',
    65000,
    '/assets/Strawberry Milk Bread.jpg',
    'flavored',
    FALSE,
    FALSE,
    TRUE,
    12
  ),
  (
    'Earl Grey Milk Bread',
    'earl-grey-milk-bread',
    'Elegant Earl Grey tea-infused milk bread with subtle bergamot notes.',
    64000,
    '/assets/Earl Grey Milk Bread.jpg',
    'flavored',
    FALSE,
    FALSE,
    FALSE,
    8
  ),
  (
    'Matcha Milk Jam',
    'matcha-milk-jam',
    'Creamy matcha meets sweet milk in this rich, aromatic spread made for our shokupan.',
    114000,
    '/assets/General Photo3.jpg',
    'spreads',
    FALSE,
    FALSE,
    FALSE,
    15
  ),
  (
    'All-Natural Strawberry Jam',
    'all-natural-strawberry-jam',
    'Ciwidey strawberries preserved at peak ripeness—no preservatives, just pure fruit.',
    72000,
    '/assets/Strawberry Jam1.jpg',
    'spreads',
    FALSE,
    FALSE,
    FALSE,
    20
  ),
  (
    'Yuzu Honey Shokupan',
    'yuzu-honey-shokupan',
    'Refreshing citrus yuzu-infused milk bread with a touch of natural honey. Bright and aromatic.',
    80000,
    '/assets/General Photo5.jpg',
    'seasonal',
    FALSE,
    FALSE,
    TRUE,
    8
  ),
  (
    'Hojicha Black Sesame Shokupan',
    'hojicha-black-sesame-shokupan',
    'Roasted hojicha tea meets nutty black sesame in this sophisticated and aromatic shokupan.',
    58000,
    '/assets/General Photo4.jpg',
    'flavored',
    FALSE,
    TRUE,
    TRUE,
    10
  ),
  (
    'Premium Strawberry Jam Gift Set',
    'premium-strawberry-jam-gift-set',
    'Two sizes of our signature all-natural strawberry jam in elegant packaging—perfect for gifting.',
    160000,
    '/assets/Strawberry Jam2.jpg',
    'spreads',
    TRUE,
    FALSE,
    FALSE,
    15
  )
ON CONFLICT (slug) DO NOTHING; 