'use client';

import { siteConfig } from '@/config/site.config';
import { usePathname } from 'next/navigation';

const Title = () => {
  const pathname = usePathname();
  const currentNavItem = siteConfig.navItems.find((item) => item.href === pathname);

  const pageTitle = currentNavItem ? currentNavItem.label : siteConfig.title;

  return (
    <div className="w-full flex justify-center mb-12 mt-6">
      <h1 className="font-bold text-3xl"> {pageTitle}</h1>
    </div>
  );
};

export default Title;
