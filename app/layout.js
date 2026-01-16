import './globals.css';
import { AuthProvider } from '../lib/authContext';
import Navbar from '@/components/MianNavbar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}