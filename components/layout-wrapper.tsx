'use client';

import { usePathname } from 'next/navigation';
import { Link } from '@heroui/link';
import { Navbar } from '@/components/navbar';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Páginas que não devem ter navbar e layout
  const authPages = ['/login', '/signup'];
  const isAuthPage = authPages.includes(pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://heroui.com?utm_source=next-app-template"
          title="heroui.com homepage"
        >
          <span className="text-default-600">Created by</span>
          <p className="text-secondary">BrunoReiis</p>
        </Link>
      </footer>
    </div>
  );
}
