import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const HeroSection = () => {
  return (
    <section className="relative h-[80vh] md:h-[90vh] bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1608198093002-ad4e005484ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80" 
          alt="Premium Japanese Shokupan bread"
          className="object-cover h-full w-full opacity-80"
        />
      </div>
      <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10 text-center text-white">
        <p className="text-sm md:text-base uppercase tracking-widest mb-2 md:mb-4 opacity-90">Limited Batch, Delivered Fresh.</p>
        <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-6 md:mb-8 tracking-tight max-w-3xl">PREMIUM JAPANESE SHOKUPAN</h1>
        <Link href="/shop">
          <Button className="bg-white text-primary hover:bg-[#E09E69] hover:text-white transition-colors px-8 py-3 md:py-4 font-medium text-sm md:text-base uppercase tracking-wider">
            Shop Now
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
