import { ThemeModeScript } from "flowbite-react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ThemeInit } from "../.flowbite-react/init";
import Auth0ProviderWrapper from "../components/Auth0ProviderWrapper";
import "./globals.css";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "800"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={poppins.className}>
      <head>
        <ThemeModeScript />
      </head>
      <body className={`${poppins.className} antialiased`}>
                <ThemeInit />
        <Auth0ProviderWrapper>{children}</Auth0ProviderWrapper>
      </body>
    </html>
  );
}

