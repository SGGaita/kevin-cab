import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import StatsBar from '@/components/StatsBar';
import Services from '@/components/Services';
import About from '@/components/About';
import Gallery from '@/components/Gallery';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { getLocalBusinessSchema, getServiceSchema, getOrganizationSchema } from './structured-data';

export const metadata = {
  title: 'Kevincab - Best Taxi & Cab Services in Kenya | 24/7 Airport Transfers',
  description: 'Book reliable taxi and cab services across Kenya. Airport transfers, hotel pickups, SUV rentals, and executive transport. Available 24/7 in all 47 counties with GPS-tracked vehicles.',
  keywords: 'taxi Kenya, cab Nairobi, airport transfer Kenya, taxi Mombasa, Kenya cab service, airport pickup Nairobi, hotel transfer Kenya, SUV taxi Kenya, executive cab Kenya, 24/7 taxi service Kenya',
  alternates: {
    canonical: 'https://kevincab.co.ke',
  },
};

export default function Home() {
  // Structured data for SEO
  const localBusinessData = getLocalBusinessSchema({});
  const organizationData = getOrganizationSchema();
  
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      
      <Navbar />
      <Hero />
      <StatsBar />
      <Services />
      <About />
      <Gallery />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
}
