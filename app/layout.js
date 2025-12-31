import "./globals.css";

export const metadata = {
  title: "Hospital Appointment System",
  description: "Book doctor appointments easily",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
