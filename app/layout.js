// app/layout.js
import "./globals.css";
import { AuthProvider } from "@/lib/authContext";

export const metadata = {
  title: "HealthCare",
  description: "Hospital appointment booking platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}