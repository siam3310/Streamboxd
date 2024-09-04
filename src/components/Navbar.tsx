"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { MdHome, MdSearch } from "react-icons/md";

const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: <MdHome size={24} /> },
    { href: "/search", label: "Search", icon: <MdSearch size={24} /> },
  ];

  return (
    <nav className="bg-black">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between p-2 md:p-4">
        <a
          href="/"
          className="flex items-center space-x-2 rtl:space-x-reverse"
        >
          <img
            src="/images/logo.png"
            className="h-6 md:h-8"
            alt="Streamboxd logo"
          />
          <span className="text-xl md:text-2xl font-semibold whitespace-nowrap text-white">
            Streamboxd
          </span>
        </a>
        <ul className="flex space-x-6 p-2 md:p-0 rounded-lg">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={`block text-base md:text-lg ${
                  pathname === item.href
                    ? "text-yellow-500"
                    : "text-gray-90 hover:text-yellow-500 dark:text-white md:dark:hover:text-yellow-600"
                }`}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                <span className="flex items-center space-x-1 md:space-x-2">
                  {item.icon}
                  <span className="hidden md:inline-block">{item.label}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
