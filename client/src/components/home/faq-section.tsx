import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "wouter";

const FAQSection = () => {
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
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-[#F9F5F0]">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="font-playfair text-2xl md:text-3xl font-semibold text-center mb-8 md:mb-12">Frequently Asked Questions</h2>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`faq-${index}`}
              className="border-b border-neutral-300 pb-4"
            >
              <AccordionTrigger className="font-medium text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pt-3 text-neutral-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        <div className="text-center mt-8 md:mt-10">
          <Link href="/faq" className="inline-block border-b border-primary hover:border-[#E09E69] hover:text-[#E09E69] transition-colors text-sm md:text-base font-medium">
            View All FAQs
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
