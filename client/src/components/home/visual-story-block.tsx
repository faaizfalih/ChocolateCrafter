import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const VisualStoryBlock = () => {
  return (
    <section className="relative min-h-[50vh] md:min-h-[70vh] bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1550617931-e17a7b70dce2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
          alt="Bread making process"
          className="object-cover h-full w-full opacity-70"
        />
      </div>
      <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10 text-center text-white py-12 md:py-0">
        <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6 md:mb-8 max-w-3xl">Handcrafted Daily with the Finest Ingredients</h2>
        <p className="text-base md:text-lg max-w-2xl mb-8 leading-relaxed">
          We source only the highest quality ingredients, from premium Japanese flour to farm-fresh dairy. Each loaf is lovingly handcrafted using traditional methods that honor the art of Japanese bread making.
        </p>
        <Link href="/our-story">
          <Button className="inline-block border border-white text-white hover:bg-white hover:text-primary transition-colors px-6 py-3 font-medium">
            Discover Our Process
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default VisualStoryBlock;
