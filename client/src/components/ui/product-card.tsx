import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Product } from "@shared/schema";
import { useCart } from "@/context/cart-context";
import { formatPrice, getImageUrl } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "minimal" | "grid";
}

const ProductCard = ({ product, variant = "default" }: ProductCardProps) => {
  const { addToCart } = useCart();
  if (variant === "minimal") {
    return (
      <div>
        <Link href={`/product/${product.slug}`}>
          <div className="mb-3 aspect-square overflow-hidden bg-white">
            <img
              src={getImageUrl(product.imageUrl)}
              alt={product.name}
              className="w-full h-full object-cover"
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
              src={getImageUrl(product.imageUrl)}
              alt={product.name}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </div>
          console.log(product.imageUrl); console.log(product.name);
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
            src={getImageUrl(product.imageUrl)}
            alt={product.name}
            className="w-full h-full object-cover transition-transform hover:scale-105"
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
