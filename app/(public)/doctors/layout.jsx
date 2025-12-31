// app/(public)/doctors/layout.jsx
// This applies dynamic rendering to ALL pages inside /doctors and subroutes

export const dynamic = "force-dynamic";
export const revalidate = 0;

// This layout wraps all pages in /doctors (list + [slug])
// You can return children directly — no visual changes
export default function DoctorsLayout({ children }) {
  return <>{children}</>;
}