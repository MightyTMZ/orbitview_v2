import HeroSection from "./oldLandingComponents/HeroSection";
import Highlights from "./oldLandingComponents/Highlights";
import DemoShowcase from "./oldLandingComponents/DemoShowcase";
import CommunityEvents from "./oldLandingComponents/CommunityEvents";
import Testimonials from "./oldLandingComponents/Testimonials";
import EdtechIntegration from "./oldLandingComponents/EdtechIntegration";
import Pricing from "./oldLandingComponents/Pricing";
import FAQ from "./oldLandingComponents/FAQ";
import Newsletter from "./oldLandingComponents/Newsletter";
import Footer from "./oldLandingComponents/Footer";

import Hero from "./refinedlanding/Hero/Hero";
import ExploreSection from "./refinedlanding/Explore/Explore";
import Discover from "./refinedlanding/Discover/Discover";
import Launch from "./refinedlanding/Launch/Launch";
import MessagingFeatures from "./refinedlanding/SendingMessages/Messages";

const LandingPage = () => {
  // server side component with some client side components
  return (
    <main className="w-full landing">
      <Hero />
      <ExploreSection />
      <Discover />
      <Launch />
      <MessagingFeatures />
      <Newsletter />
      <Footer />
      {/* <Highlights />
      <DemoShowcase />
      <CommunityEvents />
      <Testimonials />
      <EdtechIntegration />
      <Pricing />
      */}
    </main>
  );
};

export default LandingPage;
