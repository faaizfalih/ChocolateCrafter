import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { formatPrice, getImageUrl } from '@/lib/utils';
import { Product } from '@shared/schema';
import { cn } from '@/lib/utils';
import ProductCard from '@/components/ui/product-card';

// Helper function to get image URL regardless of field name
const getProductImageUrl = (product: Product) => {
  // Handle both camelCase and snake_case field names
  // @ts-ignore - TypeScript might not know about image_url field
  const imageSource = product.imageUrl || product.image_url;
  return getImageUrl(imageSource);
};

const BestSellersGrid = () => {
  const { data, isLoading, error } = useQuery<{ products: Product[] }>({
    queryKey: ['/api/products/bestsellers'],
  });

  if (isLoading) {
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {/* Mobile Categories Header - Styled like Best Cakes header */}
          <div className="md:hidden text-center mb-8">
            <h2 className="text-3xl font-medium mb-4">Best Cakes</h2>
            <div className="flex justify-center gap-4 text-lg text-neutral-400">
              <span className="text-black">Best Cakes</span>
              <span>Best Chocolates</span>
              <span>Best Gifting</span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:gap-12">
            {/* Desktop Left Navigation Skeleton (Hidden on mobile) */}
            <div className="hidden md:block w-48 space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-6 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
            
            {/* Product Grid Skeleton - Two columns on mobile, three on desktop */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 animate-pulse">
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
        {/* Mobile Categories Header - Styled like Best Cakes header */}
        <div className="md:hidden text-center mb-8">
          <h2 className="text-3xl font-medium mb-4">Best Cakes</h2>
          <div className="flex justify-center gap-4 text-lg">
            <Link href="/shop?category=bestsellers" className="text-black">
              Best Cakes
            </Link>
            <Link href="/shop?category=seasonal" className="text-neutral-400 hover:text-black transition-colors">
              Best Chocolates
            </Link>
            <Link href="/shop?category=gifting" className="text-neutral-400 hover:text-black transition-colors">
              Best Gifting
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

          {/* Product Grid - Two columns on mobile, three on desktop */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6 md:gap-x-8 md:gap-y-12">
            {data.products.map((product) => (
              <div key={product.id} className="group md:hidden">
                <Link href={`/product/${product.slug}`}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-neutral-100">
                    {product.bestSeller && (
                      <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
                        Best Seller
                      </span>
                    )}
                    <img
                      src={getProductImageUrl(product)}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        console.error(`Failed to load image for ${product.name}: ${target.src}`);
                        
                        // Try attached_assets as fallback if not already using it
                        if (!target.src.includes('/attached_assets/') && !target.src.includes('/assets/General')) {
                          target.src = `/attached_assets/${product.imageUrl}`;
                        } else if (!target.src.includes('/assets/General')) {
                          // Final fallback
                          target.src = '/assets/General Photo1.jpg';
                        }
                      }}
                    />
                  </div>
                  <div className="mt-2">
                    <h3 className="text-sm font-medium">{product.name}</h3>
                    <p className="text-xs text-neutral-600">From {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(product.price)}</p>
                  </div>
                </Link>
              </div>
            ))}
            
            {/* Use the original ProductCard for desktop view */}
            {data.products.map((product) => (
              <div key={`desktop-${product.id}`} className="hidden md:block">
                <ProductCard product={product} variant="grid" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestSellersGrid;
