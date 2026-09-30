import React from "react";
import { useSelector } from "react-redux";

import {
  AppAside,
  AppContent,
  AppSidebar,
  AppFooter,
  AppHeader,
} from "../components";

const DefaultLayout = () => {
  const sidebarShow = useSelector(
    (state) => state.sidebarShow
  );

  const sidebarUnfoldable = useSelector(
    (state) => state.sidebarUnfoldable ?? false
  );

  const sidebarWidth = !sidebarShow
    ? "lg:ml-0"
    : sidebarUnfoldable
      ? "lg:ml-[56px]"
      : "lg:ml-64";

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Application Area */}
      <div
        className={`
          flex
          min-h-screen
          min-w-0
          flex-col
          transition-[margin]
          duration-300
          ease-in-out
          ${sidebarWidth}
        `}
      >
        {/* Header */}
        <AppHeader />

        {/* Content */}
        <main className="min-w-0 flex-1 overflow-x-auto">
          <AppContent />
        </main>

        {/* Footer */}
        <AppFooter />
      </div>

      {/* Right Aside */}
      <AppAside />
    </div>
  );
};

export default DefaultLayout;