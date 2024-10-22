'use client'
import localFont from "next/font/local";
import "./globals.css";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Header from "./components/header";
import Footer from "./components/footer";
import BootstrapClient from "./components/bootstrapClient";
import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";

const MIN_WIDTH = 200;
const MAX_WIDTH = 600; 

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const THEME_KEY = 'theme';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');

  //#region theme control
  const applyTheme = useCallback((newTheme: 'light' | 'dark' | 'auto') => {
    document.documentElement.setAttribute('data-bs-theme', newTheme);
  }, [])


  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY) as 'light' | 'dark' | 'auto';
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme('auto');
    }
  }, [applyTheme]);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    setTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    applyTheme(newTheme)
  };

  //#endregion

  return (
    <html lang="en" data-bs-theme="" id="hdkn">
      <Script id='google-analytics' strategy='afterInteractive'>
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-S5Z6JM69TE');
          `}
      </Script>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <BootstrapClient />
          <Header theme={theme} onThemeChange={handleThemeChange} />
          {children}
          <Footer />
      </body>
    </html>
  );
}
