"use client";

import { usePathname } from 'next/navigation';

export default function ConditionalHeaderFooter({ children }) {
  const pathname = usePathname();
  
  // Do not render children (Navbar/Footer) on /admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }
  
  return children;
}
