import MainWrapper from "@/wrapper/main";
import Hero from "@/components/home/Hero";
import CategoryCarousel from "@/components/home/CategoryCarousel";
import NewArrivals from "@/components/home/NewArrivals";
import RefurbishedSpotlight from "@/components/home/RefurbishedSpotlight";

/*
  Home Page
   - Hero Section (Main Banner)
   - Category Carousel (Featured Categories)
   - New Arrivals (Latest Products)
   - Refurbished Spotlight (Featured Used Items)
*/

export default function Home() {
  return (
    <MainWrapper>
      <CategoryCarousel />
      <Hero />
      <NewArrivals />
      <RefurbishedSpotlight />
    </MainWrapper>
  );
}
