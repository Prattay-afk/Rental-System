import DiscoverSection from "@/components/Discover";
import FeaturesSection from "@/components/Features";
import FooterSection from "@/components/Footer";
import HeroSection from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      {/* <h1>Hi Anik er Baap</h1> */}
      <Navbar></Navbar>
      <HeroSection></HeroSection>
      <FeaturesSection></FeaturesSection>
      <DiscoverSection></DiscoverSection>
      <FooterSection></FooterSection>
    </div>
  );
}
