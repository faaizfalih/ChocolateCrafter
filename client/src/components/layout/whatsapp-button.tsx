import { Button } from '@/components/ui/button';

const WhatsappButton = () => {
  return (
    <a 
      href="https://wa.me/6281234567890" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="fixed bottom-6 right-6 bg-[#25D366] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-50 hover:bg-[#20BA5C] transition-colors"
    >
      <i className="fab fa-whatsapp text-2xl"></i>
      <span className="sr-only">Contact us via WhatsApp</span>
    </a>
  );
};

export default WhatsappButton;
