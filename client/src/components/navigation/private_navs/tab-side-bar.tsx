'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Settings, HelpCircle, Search } from 'lucide-react';
import { useAuthCheck } from '@/hooks/use-auth-check.hooks';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import SidebarSkeleton from '@/components/splash/skeleton-pre-built/sidebar-skeleton';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import SideBarProfile from './side-bar-profile';
import SearchDialog from '@/components/customs/search-dialog';
import {
  ResearcherMenuItems,
  AdministrativeMenuItems,
  FishPondOperatorMenutItems,
  MonitoringManagerMenutItems,
} from './tab-side-bar.menu';

interface MenuItems {
  path: string;
  icon: React.ReactNode;
  label: string;
  role: string[];
}

interface TabSideBarProps {
  isOpen: boolean;
  onClose?: () => void;
}

interface TooltipWrapperProps {
  children: React.ReactNode;
  content: string;
  isOpen: boolean;
}

const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
  children,
  content,
  isOpen,
}) => {
  if (isOpen) return <>{children}</>;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right">
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default function TabSideBar({ isOpen, onClose }: TabSideBarProps) {
  const [mounted, setMounted] = useState(false);
  const { user } = useAuthCheck();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user) return;

    const excludedPaths = ['/admin', '/report'];
    if (excludedPaths.some((path) => pathname.startsWith(path))) return;

    if (!user.access.some((p) => pathname.startsWith(p))) {
      router.replace('/unauthorized');
    }
  }, [user, pathname, router]);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (!onClose) return;
  //     if (
  //       sidebarRef.current &&
  //       !sidebarRef.current.contains(event.target as Node)
  //     ) {
  //       onClose();
  //     }
  //   };
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => document.removeEventListener('mousedown', handleClickOutside);
  // }, [onClose]);

  const hasAccess = (roles: string[]) => {
    if (!user?.roleId.role) return false;
    if (roles.length === 0) return true;
    return roles.includes(user.roleId.role);
  };

  const getMenuItems = (): MenuItems[] => {
    if (!user?.roleId.role) return [];
    const role = user.roleId.role;

    if (['Administrator', 'Moderator', 'User'].includes(role))
      return AdministrativeMenuItems;
    if (role === 'Researcher') return ResearcherMenuItems;
    if (role === 'Fishpond-Operator') return FishPondOperatorMenutItems;
    if (role === 'Monitoring-Manager') return MonitoringManagerMenutItems;


    return [];
  };

  const menuItems = getMenuItems();

  const renderMenuItem = (item: MenuItems) => {
    const isActive = pathname === item.path;
    return (
      <TooltipWrapper content={item.label} isOpen={true}>
        <Link
          href={item.path}
          className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer transition-colors duration-200 ${
            isActive
              ? 'text-black bg-sidebar-accent dark:bg-sidebar-primary text-[0.8em] dark:text-white'
              : 'text-black dark:text-black hover:bg-zinc-300 hover:text-black dark:hover:bg-zinc-200 dark:hover:text-black bg-white text-[0.8em]'
          }`}
        >
          <div className="flex items-center justify-center mr-3">
            {item.icon}
          </div>
          <span className="text-[0.8em]">{item.label}</span>
        </Link>
      </TooltipWrapper>
    );
  };

  const renderBottomButton = (
    icon: React.ReactElement,
    label: string,
    onClick: () => void,
  ) => (
    <Button
      variant="default"
      className="text-white bg-transparent hover:bg-neutral-700 cursor-pointer w-full justify-start px-4 py-2 rounded-md transition-colors duration-200"
      onClick={onClick}
    >
      {React.cloneElement(icon, { className: 'h-4 w-4 mr-2' } as any)}
      <span className="text-[0.8em]">{label}</span>
    </Button>
  );

  if (!isOpen) return null;

  return (
    <>
      <TooltipProvider>
        {!mounted ? (
          <SidebarSkeleton isOpen={true} />
        ) : (
          <div
            ref={sidebarRef}
            className="flex flex-col w-64 h-full p-5 space-y-6 shadow-lg bg-secondary dark:bg-background text-accent dark:text-white relative"
          >
            <div className="flex items-center space-x-2 mb-6">
              <img src="/images/background-2.jpg" alt="Logo" className="h-8 w-8" />
              {isOpen && (
                <span className="font-bold text-[0.7em]">Smart Pond</span>
              )}
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto space-y-4">
              {menuItems.map(
                (item) =>
                  hasAccess(item.role) && (
                    <div key={item.path}>{renderMenuItem(item)}</div>
                  ),
              )}
            </div>

            {/* Bottom Section */}
            <div className="mt-auto flex flex-col space-y-2">
              {/* {renderBottomButton(<Settings />, 'Settings', () =>
                router.push('/settings'),
              )} */}
              {renderBottomButton(<HelpCircle />, 'Get Help', () =>
                router.push('/help'),
              )}
              {/* {renderBottomButton(<Search />, 'Search', () =>
                setSearchOpen(true),
              )} */}
              <Separator className="my-2" />
              <SideBarProfile isOpen={true} />
            </div>
          </div>
        )}
      </TooltipProvider>

      {searchOpen && (
        <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      )}
    </>
  );
}
