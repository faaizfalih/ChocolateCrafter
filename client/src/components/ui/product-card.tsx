import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Product } from "@shared/schema";
import { useCart } from "@/context/cart-context";
import { formatPrice, getImageUrl } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "minimal" | "grid";
}

// Helper function to get image URL regardless of field name
const getProductImageUrl = (product: Product) => {
  // Handle both camelCase and snake_case field names
  // @ts-ignore - TypeScript might not know about image_url field
  const imageSource = product.imageUrl || product.image_url;
  return getImageUrl(imageSource);
};

const ProductCard = ({ product, variant = "default" }: ProductCardProps) => {
  const { addToCart } = useCart();
  if (variant === "minimal") {
    return (
      <div>
        <Link href={`/product/${product.slug}`}>
          <div className="mb-3 aspect-square overflow-hidden bg-white">
            <img
              src={getProductImageUrl(product)}
              alt={product.name}
              className="w-full h-full object-cover"
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
          <h3 className="font-medium text-sm md:text-base">{product.name}</h3>
          <p className="text-xs md:text-sm text-neutral-600">
            {formatPrice(product.price)}
          </p>
        </Link>
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div>
        <Link href={`/product/${product.slug}`}>
          <div className="mb-3 aspect-square overflow-hidden">
            <img
              src={getProductImageUrl(product)}
              alt={product.name}
              className="w-full h-full object-cover transition-transform hover:scale-105"
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
          <h3 className="font-medium text-sm md:text-base">{product.name}</h3>
          <p className="text-xs md:text-sm text-neutral-600">
            {formatPrice(product.price)}
          </p>
        </Link>
      </div>
    );
  }

  // Default variant
  return (
    <div className="space-y-3">
      <Link href={`/product?id=${product.id}`} className="block">
        <div className="aspect-square overflow-hidden rounded-lg relative">
          {product.bestSeller && (
            <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
              Best Seller
            </span>
          )}
          <img
            src={getProductImageUrl(product)}
            alt={product.name}
            className="w-full h-full object-cover transition-transform hover:scale-105"
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
        <h3 className="font-medium mb-1 md:text-lg">{product.name}</h3>
        <p className="text-sm text-neutral-600 mb-2 md:mb-3">
          From {formatPrice(product.price)}
        </p>
      </Link>
      <Button
        className="bg-primary text-white hover:bg-[#E09E69] transition-colors w-full py-2 md:py-3 text-sm font-medium"
        onClick={() => addToCart(product)}
      >
        Order Now
      </Button>
    </div>
  );
};

export default ProductCard;
