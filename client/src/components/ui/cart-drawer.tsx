import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { Link } from "wouter";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const CartDrawer = () => {
  const { items, isCartOpen, closeCart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { toast } = useToast();
  
  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      
      // In a real app, we would collect shipping info and payment details
      // For this demo, we'll just create a mock order
      
      const order = {
        customerName: "Demo Customer",
        customerEmail: "customer@example.com",
        customerPhone: "+628123456789",
        shippingAddress: "Jl. Demo Address No. 123",
        city: "Jakarta",
        postalCode: "12345",
        total: totalPrice,
      };
      
      const orderItems = items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));
      
      const response = await apiRequest("POST", "/api/orders", { order, items: orderItems });
      
      if (response.ok) {
        toast({
          title: "Order Placed Successfully",
          description: "Thank you for your order!",
        });
        
        clearCart();
        closeCart();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };
  
  return (
    <Sheet open={isCartOpen} onOpenChange={state => !state && closeCart()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-5">
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription>
            {items.length === 0 ? "Your cart is empty" : `${items.length} item(s) in your cart`}
          </SheetDescription>
        </SheetHeader>
        
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center gap-4">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            <h3 className="font-medium text-lg">Your cart is empty</h3>
            <p className="text-muted-foreground">Add items to your cart to see them here</p>
            <Button 
              onClick={closeCart}
              className="mt-4 bg-primary hover:bg-[#E09E69]"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-8">
              {items.map(item => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="w-20 h-20 flex-shrink-0">
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <Link href={`/product/${item.product.slug}`} className="font-medium hover:text-[#E09E69]">
                        {item.product.name}
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {formatPrice(item.product.price)}
                    </p>
                    
                    <div className="flex items-center mt-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                        <span className="sr-only">Decrease quantity</span>
                      </Button>
                      
                      <span className="w-10 text-center">{item.quantity}</span>
                      
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                        <span className="sr-only">Increase quantity</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              
              <Button 
                className="w-full bg-primary hover:bg-[#E09E69]"
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? "Processing..." : "Checkout"}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={closeCart}
              >
                Continue Shopping
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
