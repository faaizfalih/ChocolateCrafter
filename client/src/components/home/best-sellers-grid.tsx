import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import ProductCard from '@/components/ui/product-card';
import { Product } from '@shared/schema';

const BestSellersGrid = () => {
  const { data, isLoading, error } = useQuery<{ products: Product[] }>({
    queryKey: ['/api/products/bestsellers'],
  });

  if (isLoading) {
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-playfair text-2xl md:text-3xl font-semibold text-center mb-8 md:mb-12">Best Sellers</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-square bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500">
            Failed to load bestseller products. Please try again later.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-playfair text-2xl md:text-3xl font-semibold text-center mb-8 md:mb-12">Best Sellers</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {data.products.map((product) => (
            <ProductCard key={product.id} product={product} variant="grid" />
          ))}
        </div>
        
        <div className="text-center mt-8 md:mt-10">
          <Link href="/shop" className="inline-block border-b border-primary hover:border-[#E09E69] hover:text-[#E09E69] transition-colors text-sm md:text-base font-medium">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSellersGrid;
