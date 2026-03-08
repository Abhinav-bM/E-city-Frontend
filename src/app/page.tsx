import Hero from "@/components/home/Hero";
import TrustSignals from "@/components/home/TrustSignals";
import CategoryCarousel from "@/components/home/CategoryCarousel";
import ShopByBudget from "@/components/home/ShopByBudget";
import NewArrivals from "@/components/home/NewArrivals";
import RefurbishedSpotlight from "@/components/home/RefurbishedSpotlight";
// import ConditionExplainer from "@/components/home/ConditionExplainer";
import MainWrapper from "@/wrapper/main";

export default function Home() {
  return (
    <MainWrapper>
      <Hero />
      <TrustSignals />
      <CategoryCarousel />
      <ShopByBudget />
      <NewArrivals />
      <RefurbishedSpotlight />
      {/* <ConditionExplainer /> */}
    </MainWrapper>
  );
}
