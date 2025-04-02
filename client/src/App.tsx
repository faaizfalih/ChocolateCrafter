import { Route, Switch } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WhatsappButton from "@/components/layout/whatsapp-button";
import Home from "@/pages/home";
import Shop from "@/pages/shop";
import Product from "@/pages/product";
import CorporateGifting from "@/pages/corporate-gifting";
import OurStory from "@/pages/our-story";
import FAQ from "@/pages/faq";
import Contact from "@/pages/contact";
import NotFound from "@/pages/not-found";
import CartDrawer from "@/components/ui/cart-drawer";
import { CartProvider } from '@/context/cart-context';

function App() {
  return (
    <CartProvider>
      <Header />
      <CartDrawer />
      <main className="pt-16">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/shop" component={Shop} />
          <Route path="/product/:id" component={Product} />
          <Route path="/corporate-gifting" component={CorporateGifting} />
          <Route path="/our-story" component={OurStory} />
          <Route path="/faq" component={FAQ} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <WhatsappButton />
    </CartProvider>
  );
}

export default App;
