import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { insertCorporateInquirySchema } from '@shared/schema';

const formSchema = insertCorporateInquirySchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().min(2, "Company name is required"),
  phone: z.string().min(8, "Please enter a valid phone number"),
  message: z.string().min(10, "Please provide some details about your inquiry"),
});

const CorporateGifting = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      phone: "",
      message: "",
      quantity: undefined,
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      const response = await apiRequest("POST", "/api/corporate-inquiry", values);
      
      if (response.ok) {
        toast({
          title: "Inquiry Submitted",
          description: "Thank you for your inquiry. We'll be in touch shortly!",
        });
        form.reset();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit your inquiry. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="relative mb-16 overflow-hidden rounded-lg h-[40vh]">
          <img 
            src="https://images.unsplash.com/photo-1557308536-ee471ef2c390?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
            alt="Corporate Gifting"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center p-8 text-center">
            <h1 className="font-playfair text-3xl md:text-5xl font-semibold text-white mb-4">Gifts That Impress</h1>
            <p className="text-white text-lg max-w-2xl">Elevate your corporate gifting with Mugifumi's premium shokupan gift sets.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left Column - Information */}
          <div>
            <h2 className="font-playfair text-2xl font-semibold mb-6">Why Choose Mugifumi for Corporate Gifting</h2>
            
            <div className="prose max-w-none mb-8">
              <p>
                Mugifumi Premium Shokupan offers a unique and memorable gifting experience for your clients, partners, and team members. Our artisanal Japanese milk bread is crafted with the finest ingredients and presented in elegant packaging that reflects your company's commitment to quality.
              </p>
              
              <h3 className="text-xl font-medium mt-8 mb-4">Our Corporate Services Include:</h3>
              
              <ul className="space-y-2">
                <li>Custom gift boxes with your company branding</li>
                <li>Personalized cards with your message</li>
                <li>Bulk ordering with special pricing</li>
                <li>Coordinated delivery to multiple locations</li>
                <li>Seasonal and holiday-themed gifting options</li>
                <li>Recurring gift programs for client appreciation</li>
              </ul>
              
              <h3 className="text-xl font-medium mt-8 mb-4">Popular Corporate Gift Sets:</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <div className="border p-4 rounded-lg">
                  <h4 className="font-medium">Essential Gift Box</h4>
                  <p className="text-sm text-neutral-600 mt-1">4 premium signature loaves</p>
                  <p className="text-[#E09E69] mt-2">From Rp250.000</p>
                </div>
                
                <div className="border p-4 rounded-lg">
                  <h4 className="font-medium">Premium Selection</h4>
                  <p className="text-sm text-neutral-600 mt-1">6 premium loaves with seasonal variants</p>
                  <p className="text-[#E09E69] mt-2">From Rp380.000</p>
                </div>
                
                <div className="border p-4 rounded-lg">
                  <h4 className="font-medium">Executive Gift Set</h4>
                  <p className="text-sm text-neutral-600 mt-1">8 premium loaves with artisanal jam</p>
                  <p className="text-[#E09E69] mt-2">From Rp500.000</p>
                </div>
                
                <div className="border p-4 rounded-lg">
                  <h4 className="font-medium">Custom Package</h4>
                  <p className="text-sm text-neutral-600 mt-1">Tailored to your requirements</p>
                  <p className="text-[#E09E69] mt-2">Custom Pricing</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#F9F5F0] p-6 rounded-lg">
              <h3 className="font-medium mb-2">Need immediate assistance?</h3>
              <p className="text-neutral-600 mb-4">Contact our corporate team directly:</p>
              <p className="flex items-center">
                <i className="fab fa-whatsapp text-[#25D366] mr-2"></i>
                <a href="https://wa.me/6281234567890" className="text-primary hover:text-[#E09E69]">+62 812 3456 7890</a>
              </p>
              <p className="flex items-center mt-1">
                <i className="far fa-envelope text-neutral-500 mr-2"></i>
                <a href="mailto:corporate@mugifumi.co.id" className="text-primary hover:text-[#E09E69]">corporate@mugifumi.co.id</a>
              </p>
            </div>
          </div>
          
          {/* Right Column - Inquiry Form */}
          <div>
            <h2 className="font-playfair text-2xl font-semibold mb-6">Corporate Inquiry Form</h2>
            <p className="text-neutral-600 mb-8">
              Fill out the form below and our corporate team will get back to you within 24 hours to discuss your specific requirements.
            </p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address*</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@company.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Company Ltd." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number*</FormLabel>
                      <FormControl>
                        <Input placeholder="+62 812 3456 7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Quantity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g., 50" 
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Requirements*</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Please share details about your gifting needs, timeline, budget, or any special requirements." 
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary text-white hover:bg-[#E09E69]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                </Button>
                
                <p className="text-xs text-neutral-500 mt-4">
                  By submitting this form, you agree to our <a href="#" className="underline">Privacy Policy</a>.
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporateGifting;
