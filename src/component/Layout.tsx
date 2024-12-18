import React from "react";
import Navbar from "./Navbar";

interface LayoutProps {
    children: React.ReactNode;
  }

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="w-full bg-gray-100 min-h-screen">
      <Navbar />
      <div>{children}</div>
    </div>
  );
};

export default Layout;