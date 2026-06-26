'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';

export function NavbarWrapper() {
  const pathname = usePathname();
  if (pathname.startsWith('/0V3R')) return null;
  return <Navbar />;
}
