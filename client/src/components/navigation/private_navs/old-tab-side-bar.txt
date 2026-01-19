'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { RiMenuFold2Fill, RiMenuUnfold2Fill } from 'react-icons/ri';
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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  HRMenuItems,
  EmployeeMenuItems,
  AccountantMenuItems,
  AdministrativeMenuItems,
} from './tab-side-bar.menu';

interface MenuItems {
  path: string;
  icon: React.ReactNode;
  label: string;
  role: string[];
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
  if (isOpen) {
    return <>{children}</>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right">
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default function TabSideBar() {
  const [mounted, setMounted] = useState<boolean>(false);
  const { user } = useAuthCheck();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    setIsOpen(window.innerWidth >= 768);
  }, []);

  useEffect(() => {
    if (!user) return;

    // List of paths to exclude from access check
    const excludedPaths = ['/admin', '/report'];

    // Skip excluded routes
    if (excludedPaths.some((path) => pathname.startsWith(path))) return;

    // Redirect if user doesn't have access to the current path
    if (!user.access.some((p) => pathname.startsWith(p))) {
      router.replace('/unauthorized');
    }
  }, [user, pathname, router]);

  useEffect(() => {
    const handleClickOutSide = (event: MouseEvent) => {
      // Only close sidebar on mobile (screen width < 768px)
      if (window.innerWidth >= 768) return;

      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutSide);
    return () => document.removeEventListener('mousedown', handleClickOutSide);
  }, []);

  const hasAccess = (requiredRoles: string[]) => {
    if (!user?.roleId.role) return false;
    // If role is empty array, allow access for all
    if (requiredRoles.length === 0) return true;
    return requiredRoles.includes(user.roleId.role);
  };

  const isActiveRoute = (path: string) => {
    return pathname === path;
  };

  // Determine which menu items to display based on user role
  const getMenuItems = (): MenuItems[] => {
    if (!user?.roleId.role) return [];

    const role = user.roleId.role;

    // Administrative roles
    if (['Administrator', 'Moderator', 'User'].includes(role)) {
      return AdministrativeMenuItems;
    }

    // Lecturer roles
    if (['HR-Administrator', 'HR-Manager', 'HR-Staff'].includes(role)) {
      return HRMenuItems;
    }

    if (['Accountant'].includes(role)) {
      return AccountantMenuItems;
    }

    //Employee role
    if (role === 'Employee') {
      return EmployeeMenuItems;
    }

    return [];
  };

  const menuItems = getMenuItems();

  const renderMenuItem = (item: MenuItems) => {
    const isActive = isActiveRoute(item.path);
    const baseClasses = `cursor-pointer flex items-center space-x-3 p-2 rounded-md transition-colors duration-200 ${
      isActive
        ? 'text-black bg-sidebar-accent dark:bg-sidebar-primary text-[0.8em] dark:text-white'
        : 'text-black dark:text-black hover:bg-zinc-300 hover:text-black dark:hover:bg-zinc-200 dark:hover:text-black bg-white text-[0.8em]'
    } ${isOpen ? 'pl-5' : 'justify-center'}`;

    return (
      <TooltipWrapper content={item.label} isOpen={isOpen}>
        <Link href={item.path} className={baseClasses}>
          <div
            className={`flex items-center justify-center ${
              isOpen ? 'mr-3' : ''
            }`}
          >
            {item.icon}
          </div>
          {isOpen && (
            <span
              className={`transition-all duration-500 ${
                isOpen
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-4 w-0'
              }`}
              style={{ transitionDelay: isOpen ? '150ms' : '0ms' }}
            >
              {item.label}
            </span>
          )}
        </Link>
      </TooltipWrapper>
    );
  };

  const renderBottomButton = (
    icon: React.ReactElement,
    label: string,
    onClick: () => void,
  ) => (
    <TooltipWrapper content={label} isOpen={isOpen}>
      <Button
        variant="default"
        className={`text-white bg-transparent hover:bg-neutral-700 cursor-pointer w-full justify-start px-4 py-2 rounded-md transition-colors duration-200 ${
          isOpen ? 'pl-5' : 'justify-center'
        }`}
        onClick={onClick}
      >
        {React.cloneElement(icon, {
          className: `h-4 w-4 ${isOpen ? 'mr-2' : ''}`,
        } as any)}
        {isOpen && <span className="text-[0.8em]">{label}</span>}
      </Button>
    </TooltipWrapper>
  );

  return (
    <>
      <TooltipProvider>
        {!mounted ? (
          <SidebarSkeleton isOpen={isOpen} />
        ) : (
          <div
            className={`flex ${
              isOpen ? 'w-64' : 'w-20'
            } h-full transition-all duration-500 ease-in-out bg-linear-to-br from-background to-muted/20`}
          >
            <div
              ref={sidebarRef}
              className="bg-primary dark:bg-background text-accent dark:text-white p-5 space-y-6 shadow-lg flex flex-col w-full relative h-full "
            >
              {/* Toggle */}

              <TooltipWrapper content="Open Menu" isOpen={isOpen}>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-black dark:text-white text-2xl mb-6 cursor-resize shrink-0"
                >
                  {isOpen ? (
                    <div className="flex justify-end cursor-pointer">
                      <RiMenuFold2Fill />
                    </div>
                  ) : (
                    <div className="flex justify-center cursor-pointer">
                      <RiMenuUnfold2Fill />
                    </div>
                  )}
                </button>
              </TooltipWrapper>

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto pr-1 py-1 space-y-4 ">
                {menuItems.map(
                  (item) =>
                    hasAccess(item.role) && (
                      <div key={item.path}>{renderMenuItem(item)}</div>
                    ),
                )}
              </div>

              {/* Bottom section */}
              <div className="mt-auto flex flex-col space-y-2 shrink-0">
                {renderBottomButton(<Settings />, 'Settings', () =>
                  router.push('/settings'),
                )}
                {renderBottomButton(<HelpCircle />, 'Get Help', () =>
                  router.push('/help'),
                )}
                {renderBottomButton(<Search />, 'Search', () =>
                  setSearchOpen(true),
                )}

                <Separator className="my-2" />
                <SideBarProfile isOpen={isOpen} />
              </div>
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
