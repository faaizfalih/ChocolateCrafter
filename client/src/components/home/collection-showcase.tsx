import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Product } from '@shared/schema';
import { getImageUrl } from '@/lib/utils';

const CollectionShowcase = () => {
  const { data, isLoading, error } = useQuery<{ products: Product[] }>({
    queryKey: ['/api/products/seasonal'],
  });

  const featuredProduct = data?.products[0]; // Using the first seasonal product as featured

  // Helper function to get image URL regardless of field name
  const getProductImageUrl = (product: Product) => {
    // Handle both camelCase and snake_case field names
    // @ts-ignore - TypeScript might not know about image_url field
    const imageSource = product.imageUrl || product.image_url;
    return getImageUrl(imageSource);
  };

  if (isLoading) {
    return (
      <section className="py-12 md:py-16 bg-[#F9F5F0]">
        <div className="container mx-auto px-4">
          <div className="h-72 md:h-96 bg-gray-200 rounded animate-pulse"></div>
          <div className="mt-8 max-w-xl mx-auto bg-white p-6 rounded shadow-sm animate-pulse">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3 aspect-square bg-gray-200 rounded"></div>
              <div className="w-full md:w-2/3 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !data || data.products.length === 0) {
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
    <section className="relative">
      {/* Full-width background image */}
      <div className="w-full h-96 md:h-[500px] bg-cover bg-center relative" 
           style={{ backgroundImage: `url(${featuredProduct ? getProductImageUrl(featuredProduct) : ''})` }}>
        
        {/* Overlay removed */}
        
        {/* Overlay headline */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-semibold text-white text-center px-4">
            Seasonal Highlight: Strawberry Sakura
          </h2>
        </div>
      </div>
      
      {/* Product details box */}
      <div className="container mx-auto px-4 -mt-24 md:-mt-32 relative z-10">
        <div className="max-w-xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-lg">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Thumbnail product image */}
            <div className="w-full md:w-1/3">
              <div className="col-span-1 relative h-0 pb-[100%] overflow-hidden">
                <img 
                  src={featuredProduct ? getProductImageUrl(featuredProduct) : ''} 
                  alt={featuredProduct?.name || 'Featured product'} 
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    console.error(`Failed to load featured image: ${target.src}`);
                    
                    // Try attached_assets as fallback if not already using it
                    if (featuredProduct && !target.src.includes('/attached_assets/') && !target.src.includes('/assets/General')) {
                      target.src = `/attached_assets/${featuredProduct.imageUrl}`;
                    } else if (!target.src.includes('/assets/General')) {
                      // Final fallback
                      target.src = '/assets/General Photo1.jpg';
                    }
                  }}
                />
              </div>
            </div>
            
            {/* Product description and CTA */}
            <div className="w-full md:w-2/3">
              <p className="text-neutral-600 mb-4 md:mb-6">
                A soft, Hokkaido-style milk loaf infused with Ciwidey strawberries and sakura leaf essence.
              </p>
              <Button 
                className="bg-primary text-white hover:bg-[#E09E69] transition-colors px-6 py-3 text-sm md:text-base font-medium"
                onClick={() => {
                  if (featuredProduct) {
                    window.location.href = `/product?id=${featuredProduct.id}`;
                  }
                }}
              >
                Order Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectionShowcase;
