import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const response = await apiRequest("POST", "/api/newsletter", { email });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "You have been subscribed to our newsletter",
        });
        setEmail("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. This email might already be subscribed.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 md:py-16 bg-primary text-white">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <h2 className="font-playfair text-2xl md:text-3xl font-semibold mb-3">Stay Connected</h2>
        <p className="mb-6 md:mb-8 text-neutral-300 max-w-xl mx-auto">
          Join our mailing list to receive new flavor announcements, special offers, and bread-making tips.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 max-w-lg mx-auto">
          <Input 
            type="email" 
            placeholder="Your email address" 
            className="px-4 py-3 bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-400 flex-grow focus:outline-none focus:border-[#E09E69]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button 
            type="submit" 
            className="bg-[#E09E69] hover:bg-[#E09E69]/90 transition-colors px-6 py-3 font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
        
        <div className="mt-8 flex justify-center space-x-6">
          <a href="#" className="text-neutral-300 hover:text-white transition-colors">
            <i className="fab fa-instagram text-xl"></i>
          </a>
          <a href="#" className="text-neutral-300 hover:text-white transition-colors">
            <i className="fab fa-facebook text-xl"></i>
          </a>
          <a href="#" className="text-neutral-300 hover:text-white transition-colors">
            <i className="fab fa-twitter text-xl"></i>
          </a>
          <a href="#" className="text-neutral-300 hover:text-white transition-colors">
            <i className="fab fa-tiktok text-xl"></i>
          </a>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
