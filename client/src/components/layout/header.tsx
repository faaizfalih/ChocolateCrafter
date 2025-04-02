import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useCart } from '@/context/cart-context';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';

const Header = () => {
  const [location] = useLocation();
  const { totalItems, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Shop', path: '/shop' },
    { name: 'Corporate Gifting', path: '/corporate-gifting' },
    { name: 'Our Story', path: '/our-story' },
    { name: 'FAQ', path: '/faq' },
  ];

  return (
    <header className="bg-white fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden mr-4">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] pt-10">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-4 right-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
              <nav className="flex flex-col gap-6 mt-6">
                {navLinks.map((link) => (
                  <Link 
                    key={link.path} 
                    href={link.path} 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-base font-medium ${location === link.path ? 'text-[#E09E69]' : 'text-primary hover:text-[#E09E69] transition-colors'}`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          
          <Link href="/" className="font-playfair text-2xl font-semibold tracking-tight">
            MUGIFUMI
          </Link>
        </div>
        
        <nav className="hidden md:flex space-x-8 text-sm font-medium">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path}
              className={`${location === link.path ? 'text-[#E09E69]' : 'hover:text-[#E09E69] transition-colors'}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          
          <Button variant="ghost" size="icon" onClick={openCart} className="relative">
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#E09E69] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
            <span className="sr-only">Cart</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
