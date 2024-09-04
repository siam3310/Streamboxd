import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  manifest: '/manifest.json',
  title: "Streamboxd",
  description: "Stream Movies & TV Shows",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}> 
        <Navbar/>
        <div className="min-h-svh">
          {children}
        </div>
        <Footer/>
        </body>
    </html>
  );
}
