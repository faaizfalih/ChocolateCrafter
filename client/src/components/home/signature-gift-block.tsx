import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const SignatureGiftBlock = () => {
  return (
    <section className="py-12 md:py-16 bg-[#F9F5F0]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          <div className="relative min-h-[300px] overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
              alt="Signature Loaf"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-end p-8">
              <h3 className="text-white font-playfair text-2xl md:text-3xl font-medium mb-4">Signature Loaves</h3>
              <Link href="/shop?category=signature">
                <Button className="inline-block bg-white text-primary hover:bg-[#E09E69] hover:text-white transition-colors px-6 py-3 font-medium text-sm">
                  Shop Now
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative min-h-[300px] overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1557308536-ee471ef2c390?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
              alt="Corporate Gifting"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-end p-8">
              <h3 className="text-white font-playfair text-2xl md:text-3xl font-medium mb-4">Corporate Gifting</h3>
              <Link href="/corporate-gifting">
                <Button className="inline-block bg-white text-primary hover:bg-[#E09E69] hover:text-white transition-colors px-6 py-3 font-medium text-sm">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignatureGiftBlock;
