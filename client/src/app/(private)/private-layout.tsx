'use client';

import React, { useState } from 'react';
import TabSideBar from '@/components/navigation/private_navs/tab-side-bar';
import Header from '@/components/navigation/private_navs/header';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Controls desktop sidebar visibility
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(false);
  // Controls mobile sidebar overlay
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen scroll-smooth">
      {/* Desktop Sidebar */}
      {desktopSidebarOpen && (
        <div className="hidden md:block sticky top-0 h-screen shrink-0 z-30">
          <TabSideBar
            isOpen={desktopSidebarOpen}
            onClose={() => setDesktopSidebarOpen(false)}
          />
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 z-40 md:hidden">
            <div className="h-full overflow-y-auto overflow-x-hidden">
              <TabSideBar
                isOpen={mobileSidebarOpen}
                onClose={() => setMobileSidebarOpen(false)}
              />
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-background shrink-0">
          <Header
            onMenuClick={() => {
              // Toggle desktop sidebar on md+ screens, mobile overlay on sm
              if (window.innerWidth >= 768) {
                setDesktopSidebarOpen(!desktopSidebarOpen);
              } else {
                setMobileSidebarOpen(!mobileSidebarOpen);
              }
            }}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-background dark:bg-primary p-3">
          {/* <div className="rounded-xl bg-linear-to-br from-background to-muted/20 h-full p-5"> */}
            <div
  style={{
    backgroundImage: "url('/images/background.jpg')",
  }}
  className="rounded-xl h-full p-5 bg-cover bg-center"
>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
