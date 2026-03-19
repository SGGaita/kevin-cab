import "./globals.css";
import ThemeRegistry from './ThemeRegistry';
import { Providers } from './providers';
import CursorRipple from '@/components/CursorRipple';

export const metadata = {
  title: "Kevincab Tour and Travel - Best Taxi & Cab Services in Kenya | Airport Transfers",
  description: "Leading taxi and cab services in Kenya. 24/7 airport transfers, hotel pickups, and reliable transportation across all 47 counties. Book your ride now with GPS-tracked vehicles and professional drivers.",
  keywords: "taxi Kenya, cab services Kenya, airport transfer Nairobi, taxi Nairobi, cab Mombasa, Kenya taxi service, airport pickup Kenya, hotel transfer Kenya, reliable taxi Kenya, 24/7 cab service, GPS taxi Kenya, professional drivers Kenya, economy taxi, SUV taxi Kenya, executive cab service, taxi Naivasha, cab services Naivasha, SUV taxi Naivasha, cab Naivasha, cab services Nakuru, SUV taxi Nakuru, cab Nakuru",
  authors: [{ name: "Kevincab Tour and Travel" }],
  creator: "Kevincab Tour and Travel",
  publisher: "Kevincab Tour and Travel",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://kevincab.co.ke'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Kevincab - Best Taxi & Cab Services in Kenya",
    description: "24/7 reliable taxi and cab services across Kenya. Airport transfers, hotel pickups, and professional drivers. Book now!",
    url: 'https://kevincab.co.ke',
    siteName: 'Kevincab Tour and Travel',
    locale: 'en_KE',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kevincab Tour and Travel - Kenya Taxi Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Kevincab - Best Taxi & Cab Services in Kenya",
    description: "24/7 reliable taxi and cab services across Kenya. Airport transfers, hotel pickups, and professional drivers.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ scrollBehavior: 'smooth' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap" rel="stylesheet" />
        <meta name="geo.region" content="KE" />
        <meta name="geo.placename" content="Kenya" />
        <meta name="geo.position" content="-1.286389;36.817223" />
        <meta name="ICBM" content="-1.286389, 36.817223" />
      </head>
      <body>
        <ThemeRegistry>
          <Providers>
            <CursorRipple />
            {children}
          </Providers>
        </ThemeRegistry>
      </body>
    </html>
  );
}
