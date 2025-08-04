import FeaturedProducts from "@/components/organisms/FeaturedProducts";
import DealsShowcase from "@/components/organisms/DealsShowcase";
import TrendingSection from "@/components/organisms/TrendingSection";

const Home = () => {
  return (
    <div className="min-h-screen">
      <FeaturedProducts />
      <DealsShowcase />
      <TrendingSection />
    </div>
  );
};

export default Home;