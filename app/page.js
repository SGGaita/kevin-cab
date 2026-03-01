import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import StatsBar from '@/components/StatsBar';
import Services from '@/components/Services';
import About from '@/components/About';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <StatsBar />
      <Services />
      <About />
      <Testimonials />
      <Contact />
      <Footer />
      <MobileBottomNav />
    </>
  );
}
