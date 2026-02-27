import "./globals.css";
import ThemeRegistry from './ThemeRegistry';
import { Providers } from './providers';

export const metadata = {
  title: "KEVINCAB - Premier Taxi Service Kenya",
  description: "Reliable travel across Kenya. Airport transfers, city rides, and inter-county trips.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <Providers>{children}</Providers>
        </ThemeRegistry>
      </body>
    </html>
  );
}
