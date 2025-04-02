import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import ProductCard from '@/components/ui/product-card';
import { Product } from '@shared/schema';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Shop = () => {
  const [location] = useLocation();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  // Parse URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1]);
    const category = urlParams.get('category');
    if (category) {
      setActiveCategory(category);
    }
  }, [location]);
  
  // Get all products
  const { data, isLoading } = useQuery<{ products: Product[] }>({
    queryKey: ['/api/products'],
  });
  
  const handleTabChange = (value: string) => {
    setActiveCategory(value);
  };
  
  const filteredProducts = data?.products.filter(product => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'signature') return product.category === 'signature';
    if (activeCategory === 'seasonal') return product.seasonal;
    if (activeCategory === 'bestsellers') return product.bestSeller;
    return true;
  });

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h1 className="font-playfair text-3xl md:text-4xl font-semibold text-center mb-4">Shop Premium Shokupan</h1>
        <p className="text-center text-neutral-600 mb-8 md:mb-12 max-w-2xl mx-auto">
          Each loaf is lovingly handcrafted daily using premium ingredients and traditional Japanese techniques.
        </p>
        
        <Tabs 
          defaultValue={activeCategory} 
          value={activeCategory}
          onValueChange={handleTabChange}
          className="w-full mb-10"
        >
          <div className="flex justify-center mb-8">
            <TabsList className="bg-[#F9F5F0]">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                All Products
              </TabsTrigger>
              <TabsTrigger value="signature" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Signature
              </TabsTrigger>
              <TabsTrigger value="seasonal" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Seasonal
              </TabsTrigger>
              <TabsTrigger value="bestsellers" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Best Sellers
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value={activeCategory} className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 animate-pulse">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="aspect-square bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {filteredProducts && filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-lg text-neutral-600 mb-4">No products found in this category.</p>
                    <Button 
                      onClick={() => setActiveCategory('all')}
                      className="bg-primary text-white hover:bg-[#E09E69]"
                    >
                      View All Products
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Shop;
