import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import NewsletterSection from "@/components/home/newsletter-section";

const FAQ = () => {
  const faqs = [
    {
      question: "What makes Mugifumi Shokupan different?",
      answer: "Mugifumi Premium Shokupan is crafted using authentic Japanese techniques combined with the finest ingredients. Our bread features the signature soft, fluffy texture with a delicate, sweet flavor and none of the preservatives found in mass-produced bread. We bake in small batches daily to ensure exceptional freshness and quality."
    },
    {
      question: "How long does Mugifumi bread stay fresh?",
      answer: "Our bread is best enjoyed within 3 days of purchase when stored in a cool, dry place. For extended freshness, we recommend freezing slices and toasting them when ready to enjoy."
    },
    {
      question: "Do you use preservatives or additives?",
      answer: "No. We pride ourselves on using only natural ingredients with no preservatives, artificial flavors, or additives. This is why our bread tastes so pure and requires consumption within a few days of baking."
    },
    {
      question: "What's the best way to enjoy Mugifumi Shokupan?",
      answer: "Our Classic Shokupan is delicious on its own or lightly toasted with butter. It also makes excellent sandwiches and French toast. Flavor varieties like Strawberry Sakura and Matcha Red Bean are perfect for breakfast or as an afternoon treat with tea."
    },
    {
      question: "Do you offer corporate gifting options?",
      answer: "Yes! Our premium gift sets make excellent corporate gifts. We offer custom packaging, branded cards, and bulk ordering with special pricing. Please visit our Corporate Gifting page or contact us directly for more information."
    },
    {
      question: "How do I place an order?",
      answer: "You can place an order directly through our website by browsing our product catalog, selecting the items you want, and proceeding to checkout. For special orders or bulk purchases, please contact us directly."
    },
    {
      question: "What are your delivery options?",
      answer: "We offer same-day delivery for orders placed before 12 PM, and next-day delivery for orders placed before 4 PM. Delivery is available throughout Jakarta and select surrounding areas. For specific delivery time requests, please contact us directly."
    },
    {
      question: "Can I customize my order?",
      answer: "Yes, we offer customization options for special occasions and corporate gifts. Please contact us directly with your requirements, and we'll work with you to create a personalized experience."
    },
    {
      question: "How do I store my bread?",
      answer: "For optimal freshness, store your Mugifumi Shokupan in an airtight container at room temperature for up to 3 days. For longer storage, slice and freeze in a sealed container for up to 1 month. To enjoy, simply toast frozen slices directly from the freezer."
    },
    {
      question: "Do you have any vegan or gluten-free options?",
      answer: "Currently, our traditional Shokupan contains dairy products. We are working on developing vegan alternatives that meet our high standards. Unfortunately, we do not offer gluten-free options at this time, as wheat flour is an essential ingredient in authentic Shokupan."
    },
    {
      question: "How do I know when my order will arrive?",
      answer: "After placing your order, you'll receive a confirmation email with an estimated delivery time. On the day of delivery, our driver will contact you shortly before arriving. You can also track your order status through your account on our website."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Due to the fresh nature of our products and our commitment to quality, we currently only deliver within Jakarta and select surrounding areas. We hope to expand our delivery range in the future."
    }
  ];

  const faqCategories = [
    {
      title: "Product Information",
      faqs: [0, 1, 2, 3, 8, 9]
    },
    {
      title: "Orders & Delivery",
      faqs: [5, 6, 7, 10, 11]
    },
    {
      title: "Corporate Services",
      faqs: [4]
    }
  ];

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="font-playfair text-3xl md:text-4xl font-semibold text-center mb-4">Frequently Asked Questions</h1>
        <p className="text-center text-neutral-600 mb-12 max-w-2xl mx-auto">
          Find answers to common questions about our products, ordering process, and more. Can't find what you're looking for? Feel free to contact us directly.
        </p>

        <div className="max-w-3xl mx-auto mb-16">
          {faqCategories.map((category, idx) => (
            <div key={idx} className="mb-12">
              <h2 className="font-playfair text-2xl font-medium mb-6">{category.title}</h2>
              
              <Accordion type="single" collapsible className="space-y-4">
                {category.faqs.map((faqIndex) => (
                  <AccordionItem 
                    key={faqIndex}
                    value={`faq-${faqIndex}`}
                    className="border-b border-neutral-300 pb-4"
                  >
                    <AccordionTrigger className="font-medium text-left">
                      {faqs[faqIndex].question}
                    </AccordionTrigger>
                    <AccordionContent className="pt-3 text-neutral-600">
                      {faqs[faqIndex].answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
        
        <div className="bg-[#F9F5F0] p-8 rounded-lg max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-playfair text-2xl font-medium mb-4">Still Have Questions?</h2>
          <p className="text-neutral-600 mb-6">
            We're here to help! Reach out to us directly and we'll get back to you as soon as possible.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <a href="mailto:hello@mugifumi.co.id" className="flex items-center justify-center gap-2 text-primary hover:text-[#E09E69] transition-colors">
              <i className="far fa-envelope"></i>
              <span>hello@mugifumi.co.id</span>
            </a>
            <span className="hidden md:inline-block text-neutral-300">|</span>
            <a href="https://wa.me/6281234567890" className="flex items-center justify-center gap-2 text-primary hover:text-[#E09E69] transition-colors">
              <i className="fab fa-whatsapp"></i>
              <span>+62 812 3456 7890</span>
            </a>
          </div>
        </div>
      </div>
      
      <NewsletterSection />
    </div>
  );
};

export default FAQ;
