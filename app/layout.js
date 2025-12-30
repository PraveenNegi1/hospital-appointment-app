import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Hospital Appointment System',
  description: 'Book doctor appointments easily',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {/* <Navbar /> */}
        {children}
      </body>
    </html>
  );
}