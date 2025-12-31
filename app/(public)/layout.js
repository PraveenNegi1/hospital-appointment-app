import Navbar from "@/components/MianNavbar";

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
