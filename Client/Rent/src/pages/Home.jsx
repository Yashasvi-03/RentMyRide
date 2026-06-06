import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CarsSection from "../components/CarSection";
import { useEffect, useState } from "react";
import WhyChoose from "../components/WhyChoose";
import HowItWorks from "../components/HowItWorks";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

function Home() {
  const [filters,setFilters]=useState({
    location:"",
    fromDate:"",
    toDate:"",
  })
  useEffect(() => {
  if (window.location.hash === "#cars") {
    setTimeout(() => {
      document
        .getElementById("cars")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }
}, []);
  return (
    <div  className="bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#312e81]  text-white">
      <Navbar />
      <Hero setFilters={setFilters}/>
      <CarsSection filters={filters}/>
      <WhyChoose/>
      <HowItWorks/>
      <CTA/>
      <Footer/>
    </div>
  );
}

export default Home;
