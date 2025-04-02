
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import ProductCard from '@/components/ui/product-card';
import { Product } from '@shared/schema';
import { cn } from '@/lib/utils';

const BestSellersGrid = () => {
  const { data, isLoading, error } = useQuery<{ products: Product[] }>({
    queryKey: ['/api/products/bestsellers'],
  });

  if (isLoading) {
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {/* Mobile Navigation Skeleton (Top) */}
          <div className="md:hidden flex flex-col space-y-4 mb-8">
            <div className="h-7 bg-gray-200 rounded animate-pulse w-36"></div>
            <div className="flex flex-wrap gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:gap-12">
            {/* Desktop Left Navigation Skeleton (Hidden on mobile) */}
            <div className="hidden md:block w-48 space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-6 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
            
            {/* Product Grid Skeleton - Adjusted for mobile */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-square bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
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
        {/* Mobile Navigation (Top) */}
        <div className="md:hidden flex flex-col space-y-4 mb-8">
          <h2 className="font-medium text-xl mb-2">Categories</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/shop?category=bestsellers" className="block font-medium text-primary">
              Best Sellers
            </Link>
            <Link href="/shop?category=seasonal" className="block text-neutral-500 hover:text-primary transition-colors">
              Seasonal
            </Link>
            <Link href="/shop?category=gifting" className="block text-neutral-500 hover:text-primary transition-colors">
              Gifting
            </Link>
            <Link href="/shop" className="block text-sm border-b border-primary hover:border-[#E09E69] hover:text-[#E09E69] transition-colors">
              Shop All
            </Link>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:gap-12">
          {/* Desktop Left Navigation (Hidden on mobile) */}
          <div className="hidden md:block w-48 space-y-6 pt-4">
            <Link href="/shop?category=bestsellers" className="block font-medium text-primary">
              Best Sellers
            </Link>
            <Link href="/shop?category=seasonal" className="block text-neutral-500 hover:text-primary transition-colors">
              Seasonal
            </Link>
            <Link href="/shop?category=gifting" className="block text-neutral-500 hover:text-primary transition-colors">
              Gifting
            </Link>
            <Link href="/shop" className="inline-block mt-8 text-sm border-b border-primary hover:border-[#E09E69] hover:text-[#E09E69] transition-colors">
              Shop All
            </Link>
          </div>

          {/* Product Grid - Adjusted for mobile */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
            {data.products.map((product) => (
              <ProductCard key={product.id} product={product} variant="grid" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestSellersGrid;
