import HeroSection from '@/components/home/hero-section';
import CountdownSection from '@/components/home/countdown-section';
import ProductHighlights from '@/components/home/product-highlights';
import CollectionShowcase from '@/components/home/collection-showcase';
import BestSellersGrid from '@/components/home/best-sellers-grid';
import SignatureGiftBlock from '@/components/home/signature-gift-block';
import VisualStoryBlock from '@/components/home/visual-story-block';
import FAQSection from '@/components/home/faq-section';
import NewsletterSection from '@/components/home/newsletter-section';

const Home = () => {
  return (
    <>
      <HeroSection />
      <CountdownSection />
      <ProductHighlights />
      <CollectionShowcase />
      <BestSellersGrid />
      <SignatureGiftBlock />
      <VisualStoryBlock />
      <FAQSection />
      <NewsletterSection />
    </>
  );
};

export default Home;
