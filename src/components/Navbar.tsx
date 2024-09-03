"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { MdHome, MdSearch } from "react-icons/md";

const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: <MdHome size={24} /> }, // Decreased icon size
    { href: "/search", label: "Search", icon: <MdSearch size={24} /> }, // Decreased icon size
  ];

  return (
    <div>
      <nav className="bg-black">
        <div className="max-w-screen-xl flex items-center justify-between md:mx-auto p-2 ml-3 md:p-4">
          {" "}
          {/* Reduced padding for mobile */}
          <a
            href="/"
            className="flex items-center space-x-2 rtl:space-x-reverse" // Reduced space between logo and text
          >
            <img
              src="/images/logo.png"
              className="h-6 md:h-8"
              alt="Streamboxd logo"
            />{" "}
            {/* Reduced logo size for mobile */}
            <span className="self-center text-xl md:text-2xl font-semibold whitespace-nowrap dark:text-white">
              Streamboxd
            </span>
          </a>
          <div className="md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-row p-2 md:p-0 space-x-6 md:space-x-8 rtl:space-x-reverse rounded-lg">
              {" "}
              {/* Reduced padding and spacing for mobile */}
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`block text-base md:text-lg ${
                      // Adjusted text size for mobile
                      pathname === item.href
                        ? "text-yellow-500"
                        : "text-gray-90 hover:text-yellow-500 dark:text-white md:dark:hover:text-yellow-200"
                    }`}
                    aria-current={pathname === item.href ? "page" : undefined}
                  >
                    <span className="flex items-end space-x-1 md:space-x-2">
                      {" "}
                      {/* Adjusted space between icon and text */}
                      {item.icon} {/* Render the icon */}
                      <span className="hidden md:inline-block">
                        {item.label}
                      </span>{" "}
                      {/* Hide text on mobile */}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
