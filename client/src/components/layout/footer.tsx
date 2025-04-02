import { Link } from 'wouter';

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-300 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-medium mb-4">Help</h3>
            <ul className="space-y-2">
              <li><Link href="/shop" className="hover:text-white transition-colors">Shipping & Delivery</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">About</h3>
            <ul className="space-y-2">
              <li><Link href="/our-story" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="/our-story" className="hover:text-white transition-colors">Ingredients</Link></li>
              <li><Link href="/our-story" className="hover:text-white transition-colors">Craftsmanship</Link></li>
              <li><Link href="/our-story" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><Link href="/shop" className="hover:text-white transition-colors">Shop All</Link></li>
              <li><Link href="/shop?category=signature" className="hover:text-white transition-colors">Signature Collection</Link></li>
              <li><Link href="/shop?category=seasonal" className="hover:text-white transition-colors">Seasonal Flavors</Link></li>
              <li><Link href="/corporate-gifting" className="hover:text-white transition-colors">Corporate Gifting</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Contact</h3>
            <p className="mb-4">
              Mugifumi Premium Shokupan<br />
              Jalan Kemang Raya No. 42<br />
              Jakarta Selatan, 12730<br />
              Indonesia
            </p>
            <p className="mb-4">
              contact@mugifumi.co.id<br />
              +62 812 3456 7890
            </p>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0">© {new Date().getFullYear()} Mugifumi Premium Shokupan. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-sm hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-sm hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
