import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { Product } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice, getImageUrl } from '@/lib/utils';
import { useState } from 'react';
import { useCart } from '@/context/cart-context';
import { Plus, Minus } from 'lucide-react';
import ProductCard from '@/components/ui/product-card';

const ProductPage = () => {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  
  const { data: productData, isLoading: productLoading } = useQuery<{ product: Product }>({
    queryKey: [`/api/products/slug/${params.id}`],
    // Use onSettled instead of onError
    onSettled: (data, error) => {
      if (error || !data) {
        navigate('/not-found');
      }
    }
  });
  
  const { data: relatedData, isLoading: relatedLoading } = useQuery<{ products: Product[] }>({
    queryKey: ['/api/products/bestsellers'],
    enabled: !!productData?.product,
  });
  
  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    setQuantity(value);
  };
  
  const handleAddToCart = () => {
    if (productData?.product) {
      addToCart(productData.product, quantity);
    }
  };
  
  if (productLoading) {
    return (
      <div className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded"></div>
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!productData?.product) {
    return null; // Will redirect to not-found
  }
  
  const { product } = productData;
  
  return (
    <div className="py-16 container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-square overflow-hidden">
          <img 
            src={getImageUrl(product.imageUrl)} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div>
          <h1 className="font-playfair text-3xl font-semibold mb-2">{product.name}</h1>
          <p className="text-2xl text-[#E09E69] mb-6">{formatPrice(product.price)}</p>
          
          <div className="prose max-w-none mb-8">
            <p>{product.description}</p>
          </div>
          
          <div className="mb-6">
            <p className="text-sm mb-2">Quantity</p>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <Input 
                type="number" 
                min="1" 
                value={quantity} 
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="w-16 text-center" 
              />
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Button 
            className="w-full bg-primary text-white hover:bg-[#E09E69] py-3 font-medium"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
          
          <div className="mt-8 border-t pt-6">
            <p className="mb-2"><span className="font-medium">No Preservatives:</span> Best enjoyed within 3 days or freeze for later</p>
            <p><span className="font-medium">Next-Day Delivery:</span> Order by 4 PM for next-day delivery</p>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      <div className="mt-24">
        <h2 className="font-playfair text-2xl font-semibold text-center mb-10">You May Also Like</h2>
        
        {relatedLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-square bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedData?.products
              .filter(p => p.id !== product.id)
              .slice(0, 4)
              .map(relatedProduct => (
                <ProductCard 
                  key={relatedProduct.id} 
                  product={relatedProduct} 
                  variant="minimal" 
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
