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
import { insertContactFormSchema } from '@shared/schema';

const formSchema = insertContactFormSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Please provide some details in your message"),
});

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      const response = await apiRequest("POST", "/api/contact", values);
      
      if (response.ok) {
        toast({
          title: "Message Sent",
          description: "Thank you for your message. We'll get back to you soon!",
        });
        form.reset();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="font-playfair text-3xl md:text-4xl font-semibold text-center mb-4">Contact Us</h1>
        <p className="text-center text-neutral-600 mb-12 max-w-xl mx-auto">
          Have questions or need help? We're here for you. Fill out the form below and we'll get back to you as soon as possible.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <div>
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
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject*</FormLabel>
                      <FormControl>
                        <Input placeholder="How can we help you?" {...field} />
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
                      <FormLabel>Message*</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Please share your questions or comments..." 
                          className="min-h-[150px]"
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
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </div>
          
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="font-playfair text-xl font-medium mb-4">Our Location</h2>
              <p className="text-neutral-600 mb-4">
                Mugifumi Premium Shokupan<br />
                Jalan Kemang Raya No. 42<br />
                Jakarta Selatan, 12730<br />
                Indonesia
              </p>
              <div className="aspect-[4/3] overflow-hidden rounded-md bg-neutral-100">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2950762584824!2d106.8135891748191!3d-6.228951661171946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3b8a7a9df29%3A0x2d75a0ef9d0a51f!2sJl.%20Kemang%20Raya%2C%20Kota%20Jakarta%20Selatan%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sen!2sid!4v1712234092776!5m2!1sen!2sid" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
            
            <div>
              <h2 className="font-playfair text-xl font-medium mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#F9F5F0] flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="far fa-envelope text-sm text-[#E09E69]"></i>
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <a href="mailto:hello@mugifumi.co.id" className="text-neutral-600 hover:text-[#E09E69] transition-colors">
                      hello@mugifumi.co.id
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#F9F5F0] flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-phone-alt text-sm text-[#E09E69]"></i>
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <a href="tel:+6281234567890" className="text-neutral-600 hover:text-[#E09E69] transition-colors">
                      +62 812 3456 7890
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#F9F5F0] flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fab fa-whatsapp text-sm text-[#E09E69]"></i>
                  </div>
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <a href="https://wa.me/6281234567890" className="text-neutral-600 hover:text-[#E09E69] transition-colors">
                      +62 812 3456 7890
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="font-playfair text-xl font-medium mb-4">Business Hours</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Monday - Friday</span>
                  <span>8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Saturday</span>
                  <span>9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Sunday</span>
                  <span>10:00 AM - 3:00 PM</span>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="font-playfair text-xl font-medium mb-4">Follow Us</h2>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-[#F9F5F0] flex items-center justify-center hover:bg-[#E09E69] hover:text-white transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#F9F5F0] flex items-center justify-center hover:bg-[#E09E69] hover:text-white transition-colors">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#F9F5F0] flex items-center justify-center hover:bg-[#E09E69] hover:text-white transition-colors">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#F9F5F0] flex items-center justify-center hover:bg-[#E09E69] hover:text-white transition-colors">
                  <i className="fab fa-tiktok"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
