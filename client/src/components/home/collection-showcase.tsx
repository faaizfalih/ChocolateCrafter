import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import ProductCard from '@/components/ui/product-card';
import { Product } from '@shared/schema';

const CollectionShowcase = () => {
  const { data, isLoading, error } = useQuery<{ products: Product[] }>({
    queryKey: ['/api/products/seasonal'],
  });

  if (isLoading) {
    return (
      <section className="py-12 md:py-16 bg-[#F9F5F0]">
        <div className="container mx-auto px-4">
          <h2 className="font-playfair text-2xl md:text-3xl font-semibold text-center mb-2">Seasonal Collection</h2>
          <p className="text-center text-neutral-600 mb-8 md:mb-12 max-w-2xl mx-auto">
            Introducing our limited seasonal flavors, crafted with fresh seasonal ingredients and available for a limited time.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
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
      <section className="py-12 md:py-16 bg-[#F9F5F0]">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500">
            Failed to load seasonal products. Please try again later.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-[#F9F5F0]">
      <div className="container mx-auto px-4">
        <h2 className="font-playfair text-2xl md:text-3xl font-semibold text-center mb-2">Seasonal Collection</h2>
        <p className="text-center text-neutral-600 mb-8 md:mb-12 max-w-2xl mx-auto">
          Introducing our limited seasonal flavors, crafted with fresh seasonal ingredients and available for a limited time.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {data.products.map((product) => (
            <ProductCard key={product.id} product={product} variant="minimal" />
          ))}
        </div>
        
        <div className="text-center mt-8 md:mt-10">
          <Link href="/shop?category=seasonal">
            <Button className="bg-primary text-white hover:bg-[#E09E69] transition-colors px-6 py-3 text-sm md:text-base font-medium">
              View Seasonal Collection
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CollectionShowcase;
