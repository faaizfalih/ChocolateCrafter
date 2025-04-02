import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const OurStory = () => {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="relative mb-16 rounded-lg overflow-hidden h-[50vh]">
          <img 
            src="https://images.unsplash.com/photo-1550617931-e17a7b70dce2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Bread making process"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center p-8 text-center">
            <h1 className="font-playfair text-3xl md:text-5xl font-semibold text-white mb-4">Bread, Elevated with Purpose</h1>
          </div>
        </div>
        
        {/* Story Blocks */}
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none mb-16">
            <p className="text-xl leading-relaxed">
              At Mugifumi, we believe that bread is more than just sustenance—it's an experience that brings comfort, joy, and connection. Our journey began with a simple question: why can't we have truly exceptional Japanese milk bread (shokupan) that honors tradition while embracing innovation?
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
            <div>
              <h2 className="font-playfair text-2xl font-semibold mb-4">Ingredient Integrity</h2>
              <p className="text-neutral-600 mb-4">
                We source directly from farms that share our values. Our butter comes from grass-fed cows, our cream is always fresh, never ultra-pasteurized, and our seasonal ingredients like strawberries and yuzu are harvested at peak ripeness.
              </p>
              <p className="text-neutral-600">
                The foundation of our bread—premium Japanese flour—is imported directly from mills that have perfected their craft over generations.
              </p>
            </div>
            
            <div>
              <h2 className="font-playfair text-2xl font-semibold mb-4">Japanese Craft, Reinvented</h2>
              <p className="text-neutral-600 mb-4">
                Our master baker studied the traditional Japanese shokupan method, then spent years adapting it to create our signature texture—a perfect balance of pillowy softness and subtle chew that can only come from proper fermentation.
              </p>
              <p className="text-neutral-600">
                We honor these techniques while infusing creative flavors that speak to both our Japanese inspiration and Indonesian heritage.
              </p>
            </div>
            
            <div>
              <h2 className="font-playfair text-2xl font-semibold mb-4">No Shortcuts</h2>
              <p className="text-neutral-600 mb-4">
                We never use preservatives, artificial flavors, or dough conditioners. Each loaf requires a full 36-hour process from starter to finished product. We produce in small batches daily to ensure every customer receives bread at its absolute prime.
              </p>
              <p className="text-neutral-600">
                This commitment means our bread won't last as long as commercial bread—and that's exactly the point. Real food should be enjoyed fresh.
              </p>
            </div>
          </div>
          
          {/* Quote Block */}
          <div className="bg-[#F9F5F0] p-10 text-center rounded-lg mb-20">
            <blockquote className="font-playfair text-2xl md:text-3xl italic mb-6">
              "Mugifumi is not just shokupan—it's a ritual of care and craft."
            </blockquote>
            <p className="font-medium">Hana Tanaka, Founder & Head Baker</p>
          </div>
          
          {/* Our Process */}
          <div className="mb-16">
            <h2 className="font-playfair text-2xl md:text-3xl font-semibold text-center mb-12">Our Process</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">The Yudane Method</h3>
                    <p className="text-neutral-600">
                      We begin with yudane—a traditional Japanese technique of mixing boiling water with flour to gelatinize the starches, resulting in bread that stays moist longer without preservatives.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Slow Fermentation</h3>
                    <p className="text-neutral-600">
                      Our dough ferments for 24 hours at controlled temperatures, developing complex flavors and a texture that can't be rushed.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Hand-Shaping</h3>
                    <p className="text-neutral-600">
                      Each dough portion is hand-folded using a Japanese technique that creates the signature layers and structure of authentic shokupan.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Second Proof</h3>
                    <p className="text-neutral-600">
                      After shaping, our loaves proof in traditional Japanese shokupan pans, allowing for the perfect rise and structure.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                    5
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Precision Baking</h3>
                    <p className="text-neutral-600">
                      We bake in small batches with precise temperature control and steam injection to achieve that perfect soft crust and tender interior.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                    6
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Same-Day Delivery</h3>
                    <p className="text-neutral-600">
                      Our bread is delivered within hours of baking to ensure you experience it at its absolute peak freshness.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="text-center py-10 border-t border-b border-neutral-200 mb-10">
            <h2 className="font-playfair text-2xl font-semibold mb-4">Experience Mugifumi for Yourself</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto mb-8">
              The story of our bread is best understood through taste. We invite you to experience the difference that authentic methods and premium ingredients make.
            </p>
            <Link href="/shop">
              <Button className="bg-primary text-white hover:bg-[#E09E69]">
                Shop Our Collections
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurStory;
