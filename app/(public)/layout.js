// app/(public)/layout.js
import Navbar from "@/components/MianNavbar";

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}