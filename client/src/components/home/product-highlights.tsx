import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import ProductCard from '@/components/ui/product-card';
import { Product } from '@shared/schema';

const ProductHighlights = () => {
  const { data, isLoading, error } = useQuery<{ products: Product[] }>({
    queryKey: ['/api/products/featured'],
  });

  if (isLoading) {
    return (
      <section className="py-12 md:py-16 container mx-auto px-4">
        <h2 className="font-playfair text-2xl md:text-3xl font-semibold text-center mb-8 md:mb-12">Our Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="py-12 md:py-16 container mx-auto px-4">
        <div className="text-center text-red-500">
          Failed to load featured products. Please try again later.
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 container mx-auto px-4">
      <h2 className="font-playfair text-2xl md:text-3xl font-semibold text-center mb-8 md:mb-12">Our Collections</h2>
      
      {/* Mobile scrollable container */}
      <div className="md:hidden">
        <div className="horizontal-scroll flex space-x-4 overflow-x-auto pb-6">
          {data.products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-64">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Desktop grid layout */}
      <div className="hidden md:grid grid-cols-3 gap-8 xl:gap-12">
        {data.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <div className="text-center mt-8 md:mt-12">
        <Link href="/shop" className="inline-block border-b border-primary hover:border-[#E09E69] hover:text-[#E09E69] transition-colors text-sm md:text-base font-medium">
          View All Products
        </Link>
      </div>
    </section>
  );
};

export default ProductHighlights;
