'use client';

import React, { useState, useEffect } from 'react';
import { BellRing, Search, Bot } from 'lucide-react';
import { ThemeButtons } from '@/components/customs/theme-buttons';
import Skeleton from '@/components/splash/skeleton-component';
import HeaderAvatar from './header-avatar';
import { FiSidebar } from 'react-icons/fi';
import SearchDialog from '@/components/customs/search-dialog';
import { Kbd } from '@/components/ui/kbd';
import { useNotifications } from '@/providers/socket-provider';
import NotificationsPanel from './notifications-panel';
import { useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [notifOpen, setNotifOpen] = useState<boolean>(false);
  const { notificationCount, setNotificationCount } = useNotifications();

  // open on Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNotifClick = () => {
    setNotifOpen(!notifOpen);
    // Optional: reset badge when user opens notifications
    if (!notifOpen) {
      setNotificationCount(0);
    }
  };

  if (!mounted) {
    return (
      <div className="bg-white dark:bg-accent p-2 flex justify-between items-center rounded-b-2xl mb-2">
        <div className="flex items-center"></div>
        <div className="flex items-center space-x-4">
          <Skeleton width="24px" height="24px" rounded="rounded-full" />
          <Skeleton width="24px" height="24px" rounded="rounded-full" />
          <Skeleton width="80px" height="32px" rounded="rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-secondary dark:bg-background p-2 flex justify-between items-center rounded-b-2xl mb-2">
      <div className="flex items-center space-x-2 pl-2 md:pl-0">
        {onMenuClick && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="text-2xl text-black dark:text-white mr-2 cursor-pointer"
                  onClick={onMenuClick}
                >
                  <FiSidebar />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Open Menu</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className="flex items-center space-x-3 sm:space-x-5 ml-auto pr-2">
        {/* <button
          onClick={() => setSearchOpen(true)}
          className="hidden sm:flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-500" />
            <span className="text-sm truncate">Search ...</span>
          </div>
          <div className="flex items-center gap-1">
            <Kbd>Ctrl</Kbd>
            <Kbd>K</Kbd>
          </div>
        </button>

        <button
          onClick={() => setSearchOpen(true)}
          className="sm:hidden flex items-center justify-center text-gray-50 hover:text-yellow-300 transition"
        >
          <Search className="w-6 h-6" />
        </button> */}

        {/* <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => router.push('/chat-bot')}
                className="flex items-center justify-center text-gray-50 hover:text-yellow-300 transition cursor-pointer"
              >
                <Bot className="w-6 h-6" />
              </button>
            </TooltipTrigger>
            <TooltipContent> AIMS – Your Asset AI Assistant</TooltipContent>
          </Tooltip>
        </TooltipProvider> */}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-pointer">
                <HeaderAvatar />
              </div>
            </TooltipTrigger>
            <TooltipContent> Your Profile</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleNotifClick}
                className="relative flex items-center justify-center text-gray-50 hover:text-yellow-300 transition cursor-pointer"
              >
                <BellRing className="w-6 h-6" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>Notifications Panel</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {searchOpen && (
        <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      )}

      <NotificationsPanel
        isOpen={notifOpen}
        onClose={() => setNotifOpen(false)}
      />
    </div>
  );
}
