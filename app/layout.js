import "./globals.css";
import ThemeRegistry from './ThemeRegistry';
import { Providers } from './providers';
import CursorRipple from '@/components/CursorRipple';

export const metadata = {
  title: "Kevincab Tour and Travel - Transfer Services & National Park Tours",
  description: "Professional transfer services and national park tours across Kenya. Airport to hotel, hotel to hotel, guesthouse to airport transfers, and more.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ scrollBehavior: 'smooth' }}>
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
